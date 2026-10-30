// Nur Zeilen ohne Bewertung; höchstens 20 pro Lauf (Kostenkontrolle).
const MAX_PRO_LAUF = 20;
return $input.all()
  .filter(i => i.json.osm_id && !String(i.json.bewertung || '').trim())
  .slice(0, MAX_PRO_LAUF);
