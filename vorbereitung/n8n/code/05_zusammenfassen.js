const alle = $('Bewertung auswerten').all();
const n = (w) => alle.filter(i => i.json.bewertung === w).length;
return [{ json: { text:
  `Knuddelwuff Lead-Suche: ${alle.length} Betriebe bewertet.\n` +
  `passt: ${n('ja')} · passt nicht: ${n('nein')} · unklar: ${n('unklar')}\n` +
  `Details und Telefon-Leitfäden stehen in der Pipeline-Tabelle. Es wurde nichts versendet.` } }];
