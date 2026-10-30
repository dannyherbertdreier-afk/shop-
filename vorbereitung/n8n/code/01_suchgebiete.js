// Suchgebiete und Kategorien. Hier Städte ergänzen: Name, Breite, Länge, Radius in km.
const staedte = [
  { ort: 'Mannheim', lat: 49.4875, lon: 8.4660, radius_km: 15 },
  { ort: 'Frankfurt am Main', lat: 50.1109, lon: 8.6821, radius_km: 15 },
];
// OpenStreetMap-Kategorien für Hundebetriebe
const kategorien = [
  { kategorie: 'Hundesalon', tag: 'shop=pet_grooming' },
  { kategorie: 'Zoofachgeschäft', tag: 'shop=pet' },
  { kategorie: 'Hundepension / -tagesstätte', tag: 'amenity=animal_boarding' },
  { kategorie: 'Hundeschule / -training', tag: 'amenity=animal_training' },
];
const items = [];
for (const s of staedte) {
  for (const k of kategorien) {
    const [key, value] = k.tag.split('=');
    const r = Math.round(s.radius_km * 1000);
    const query = `[out:json][timeout:60];(node["${key}"="${value}"](around:${r},${s.lat},${s.lon});way["${key}"="${value}"](around:${r},${s.lat},${s.lon}););out center tags;`;
    items.push({ json: { ort_suche: s.ort, kategorie: k.kategorie, tag: k.tag, query } });
  }
}
return items;
