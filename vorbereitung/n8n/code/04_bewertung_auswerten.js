// Liest die Claude-Antwort (JSON) und bereitet das Tabellen-Update vor.
const heute = new Date().toISOString().slice(0, 10);
const quellen = $('Noch nicht bewertete auswählen').all();
return $input.all().map((item, i) => {
  const osm_id = quellen[i] ? quellen[i].json.osm_id : '';
  let text = '';
  try { text = item.json.content[0].text; } catch (e) { text = ''; }
  let d = {};
  try { d = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1)); } catch (e) { d = {}; }
  const passt = ['ja', 'nein', 'unklar'].includes(d.passt) ? d.passt : 'unklar';
  return { json: {
    osm_id,
    bewertung: passt,
    begruendung: d.begruendung || 'Antwort nicht auswertbar – bitte manuell prüfen.',
    telefonleitfaden: d.telefonleitfaden || '',
    bewertet_am: heute,
    status: 'bewertet',
  } };
});
