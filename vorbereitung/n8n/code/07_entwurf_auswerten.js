const heute = new Date().toISOString().slice(0, 10);
const quellen = $('Kontakte mit Einwilligung').all();
return $input.all().map((item, i) => {
  const q = quellen[i] ? quellen[i].json : {};
  let text = '';
  try { text = item.json.content[0].text; } catch (e) { text = ''; }
  let d = {};
  try { d = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1)); } catch (e) { d = {}; }
  return { json: {
    osm_id: q.osm_id,
    name: q.name,
    email_fuer_entwurf: q.email_fuer_entwurf,
    einwilligung_datum: q.einwilligung_datum,
    email_betreff: d.betreff || '',
    email_entwurf: d.text || 'Entwurf konnte nicht erstellt werden – bitte manuell schreiben.',
    entwurf_am: heute,
    status: 'Entwurf an CEO',
  } };
});
