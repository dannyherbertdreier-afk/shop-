// Nur Kontakte mit dokumentierter Einwilligung, E-Mail-Adresse und noch ohne Entwurf; max. 10 pro Lauf.
const MAX_PRO_LAUF = 10;
const ja = (v) => ['ja', 'yes', 'x', 'true'].includes(String(v || '').trim().toLowerCase());
return $input.all()
  .filter(i => ja(i.json.einwilligung)
    && String(i.json.einwilligung_datum || '').trim()
    && String(i.json.email_fuer_entwurf || '').includes('@')
    && !String(i.json.email_entwurf || '').trim())
  .slice(0, MAX_PRO_LAUF);
