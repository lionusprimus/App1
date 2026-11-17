# Folio

Ein schlanker Portfolio-Tracker als Web-App (React + TypeScript + Vite).

## Funktionen

- Positionen erfassen (Aktie, ETF, Krypto, Anleihe, Sonstiges) mit Anzahl, Kaufkurs und aktuellem Kurs
- Gesamtwert, investiertes Kapital, Gewinn/Verlust absolut und in Prozent
- Bester und schwächster Wert
- Aufteilung als Donut-Diagramm, nach Art oder nach Position
- Kurse direkt in der Tabelle ändern (Klick auf den Kurs, Enter zum Speichern)
- Suchen, Filtern, Sortieren
- Export und Import als JSON
- Daten bleiben lokal im Browser (localStorage)
- Hell/Dunkel nach Systemeinstellung, für Handy optimiert

## Starten

```bash
npm install
npm run dev      # Entwicklungsserver
npm run build    # Produktions-Build nach dist/
npm run preview  # Build lokal ansehen
```

Beim ersten Start werden Beispieldaten geladen. Löschen oder überschreiben kannst du sie jederzeit.
