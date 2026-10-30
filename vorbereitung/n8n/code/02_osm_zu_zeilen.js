// Wandelt die OpenStreetMap-Antworten in Tabellenzeilen um. Nur Daten, die in OSM stehen.
const heute = new Date().toISOString().slice(0, 10);
const gesehen = new Set();
const zeilen = [];
const anfragen = $('Suchgebiete & Kategorien').all();
$input.all().forEach((item, i) => {
  const meta = (anfragen[i] && anfragen[i].json) || {};
  const elemente = Array.isArray(item.json.elements) ? item.json.elements : [];
  for (const el of elemente) {
    const t = el.tags || {};
    if (!t.name) continue; // ohne Namen nicht verwertbar
    const osm_id = `${el.type}/${el.id}`;
    if (gesehen.has(osm_id)) continue;
    gesehen.add(osm_id);
    const strasse = [t['addr:street'], t['addr:housenumber']].filter(Boolean).join(' ');
    zeilen.push({ json: {
      osm_id,
      name: t.name,
      kategorie: meta.kategorie || '',
      strasse,
      plz: t['addr:postcode'] || '',
      ort: t['addr:city'] || meta.ort_suche || '',
      website: t.website || t['contact:website'] || '',
      telefon: t.phone || t['contact:phone'] || '',
      email_oeffentlich: t.email || t['contact:email'] || '',
      quelle: 'OpenStreetMap (© OpenStreetMap-Mitwirkende, ODbL)',
      zuletzt_gesehen: heute,
    } });
  }
});
return zeilen;
