// Testet die Code-Knoten mit nachgebildeten n8n-Variablen ($input, $()). Aufruf: node tests/test_code_nodes.cjs
const fs = require('fs'); const path = require('path'); const assert = require('assert');
const run = (file, inputItems, refs = {}) => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'code', file), 'utf8');
  const $input = { all: () => inputItems };
  const $ = (name) => ({ all: () => { if (!(name in refs)) throw new Error('unbekannter Knoten ' + name); return refs[name]; } });
  return new Function('$input', '$', src)($input, $);
};
let ok = 0; const t = (name, fn) => { fn(); ok++; console.log('✔', name); };

const such = run('01_suchgebiete.js', []);
t('01 erzeugt 2 Städte × 4 Kategorien = 8 Abfragen', () => assert.strictEqual(such.length, 8));
t('01 Abfrage enthält Tag und Radius', () => {
  assert.ok(such[0].json.query.includes('node["shop"="pet_grooming"](around:15000,49.4875,8.466)'));
  assert.ok(such.every(i => i.json.query.startsWith('[out:json]')));
});

const osm = [
  { json: { elements: [
    { type: 'node', id: 1, tags: { name: 'Salon A', 'addr:street': 'Hauptstr.', 'addr:housenumber': '5', 'addr:postcode': '68159', 'addr:city': 'Mannheim', website: 'https://a.example', phone: '+49 621 1' } },
    { type: 'node', id: 2, tags: { shop: 'pet_grooming' } },
    { type: 'way', id: 3, center: {}, tags: { name: 'Salon B', 'contact:email': 'info@b.example' } },
  ] } },
  { json: { elements: [ { type: 'node', id: 1, tags: { name: 'Salon A' } } ] } },
  { json: { remark: 'runtime error' } },
];
const zeilen = run('02_osm_zu_zeilen.js', osm, { 'Suchgebiete & Kategorien': such.slice(0, 3) });
t('02 ohne Namen wird übersprungen, Dubletten entfernt', () => assert.deepStrictEqual(zeilen.map(z => z.json.osm_id), ['node/1', 'way/3']));
t('02 Felder korrekt', () => {
  const a = zeilen[0].json; assert.strictEqual(a.strasse, 'Hauptstr. 5'); assert.strictEqual(a.plz, '68159');
  assert.strictEqual(a.telefon, '+49 621 1'); assert.ok(a.quelle.includes('ODbL'));
  assert.strictEqual(zeilen[1].json.email_oeffentlich, 'info@b.example'); assert.strictEqual(zeilen[1].json.ort, 'Mannheim');
});
t('02 keine erfundenen Felder (keine Bewertung/Status)', () => assert.ok(!('bewertung' in zeilen[0].json) && !('status' in zeilen[0].json)));

const tabelle = Array.from({ length: 25 }, (_, i) => ({ json: { osm_id: 'node/' + i, bewertung: i < 2 ? 'ja' : '' } }));
const unbewertet = run('03_unbewertete_auswaehlen.js', tabelle);
t('03 nur unbewertete, max 20', () => { assert.strictEqual(unbewertet.length, 20); assert.ok(unbewertet.every(i => !i.json.bewertung)); });

const antworten = [
  { json: { content: [{ text: '{"passt":"ja","begruendung":"Hundesalon","telefonleitfaden":"Guten Tag ..."}' }] } },
  { json: { content: [{ text: 'Hier: {"passt":"vielleicht","begruendung":"x"}' }] } },
  { json: { error: 'x' } },
];
const bew = run('04_bewertung_auswerten.js', antworten, { 'Noch nicht bewertete auswählen': unbewertet.slice(0, 3) });
t('04 gültige Antwort übernommen', () => { assert.strictEqual(bew[0].json.bewertung, 'ja'); assert.strictEqual(bew[0].json.osm_id, 'node/2'); });
t('04 ungültiger Wert → unklar', () => assert.strictEqual(bew[1].json.bewertung, 'unklar'));
t('04 Fehler → unklar mit Hinweis', () => { assert.strictEqual(bew[2].json.bewertung, 'unklar'); assert.ok(bew[2].json.begruendung.includes('manuell')); });

const sum = run('05_zusammenfassen.js', [], { 'Bewertung auswerten': bew });
t('05 Zusammenfassung zählt richtig und betont: nichts versendet', () => { assert.ok(sum[0].json.text.includes('3 Betriebe')); assert.ok(sum[0].json.text.includes('nichts versendet')); });

const kontakte = [
  { json: { osm_id: 'a', einwilligung: 'ja', einwilligung_datum: '2026-11-02', email_fuer_entwurf: 'x@a.example' } },
  { json: { osm_id: 'b', einwilligung: 'ja', einwilligung_datum: '', email_fuer_entwurf: 'x@b.example' } },
  { json: { osm_id: 'c', einwilligung: 'nein', einwilligung_datum: '2026-11-02', email_fuer_entwurf: 'x@c.example' } },
  { json: { osm_id: 'd', einwilligung: 'Ja', einwilligung_datum: '2026-11-02', email_fuer_entwurf: 'x@d.example', email_entwurf: 'schon da' } },
  { json: { osm_id: 'e', einwilligung: 'ja', einwilligung_datum: '2026-11-02', email_fuer_entwurf: '' } },
];
const ausw = run('06_einwilligung_auswaehlen.js', kontakte);
t('06 nur mit Einwilligung + Datum + Adresse + ohne Entwurf', () => assert.deepStrictEqual(ausw.map(i => i.json.osm_id), ['a']));

const ent = run('07_entwurf_auswerten.js', [{ json: { content: [{ text: '{"betreff":"Danke für das Gespräch","text":"Guten Tag ..."}' }] } }], { 'Kontakte mit Einwilligung': ausw });
t('07 Entwurf übernommen, Status an CEO', () => { assert.strictEqual(ent[0].json.email_betreff, 'Danke für das Gespräch'); assert.strictEqual(ent[0].json.status, 'Entwurf an CEO'); });
console.log(`\n${ok} Tests bestanden`);
