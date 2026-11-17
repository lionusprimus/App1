# Folio

Notizbücher mit echtem Umblättern, Planer, Ziele, Wetter, Fokus-Timer, Finanzen und Rezepte – als Web-App für den iPhone-Home-Bildschirm.

**Krümel:** Eine kleine Wolke mit Augen wohnt unten rechts in der App. Sie zeigt Gefühle: Sie schaut zu, während du schreibst, denkt nach, freut sich, wenn sie etwas erledigt hat, und guckt verwirrt, wenn sie etwas nicht versteht. Du kannst sie antippen oder streicheln. Schreib ihr einfach, was sie tun soll, zum Beispiel „Zahnarzt Freitag um 10 Uhr“, „Milch auf die Einkaufsliste“, „12 € für Kino ausgegeben“ oder „Regnet es morgen?“. Sie versteht kurze deutsche Sätze und arbeitet komplett auf dem Gerät.

**KI für Krümel (optional):** Über den Glitzer-Knopf in Krümels Fenster lässt sich ein kostenloser Schlüssel von Google Gemini, OpenRouter oder einem anderen OpenAI-kompatiblen Anbieter eintragen. Dann redet Krümel frei und erledigt auch kompliziertere Wünsche in der App (Termine verschieben, mehrere Sachen auf einmal, Fragen zu Ausgaben). Der Schlüssel bleibt auf dem Gerät. Nachrichten und bei Bedarf passende App-Daten gehen an den gewählten Anbieter. Ist das Tageslimit erreicht oder kein Internet da, antwortet Krümel im einfachen Modus.

**Plattenspieler:** Unter *Mehr → Plattenspieler* werden deine Spotify-Playlists und Alben zu Schallplatten. Zum Abspielen eine Platte aus dem Regal auf den Plattenspieler ziehen oder antippen. Ohne Spotify-Verbindung fügst du Playlists und Alben über ihren Spotify-Link hinzu und hörst sie in der Spotify-App. Mit Verbindung (Spotify Premium und eine eigene Client ID aus dem Spotify-Dashboard, die Anleitung steht in der App) kommen deine eigenen Playlists von selbst ins Regal (gespeicherte Alben auf Wunsch), und die Platte spielt direkt auf deinem Spotify, mit Pause, Zurück und Weiter. Über „Bearbeiten“ im Regal lassen sich Platten wieder entfernen; entfernte Platten kommen beim nächsten Abgleich nicht zurück. Krümel legt auf Zuruf auf: „Leg Rumours auf“.

**Einstellungen:** Über das Zahnrad oben (oder *Mehr → Einstellungen*): Hell, Dunkel oder Automatisch, sieben Farbthemen (Burgunder, Ozean, Wald, Lavendel, Abendrot, Rosé, Graphit), farbiges Hintergrund-Leuchten und Krümel ein- oder ausblenden, dazu Verknüpfungen zu KI, Spotify und Backup.

**Finanzen korrigieren:** In der Liste „Einträge“ auf „Bearbeiten“ tippen und Einträge über das rote Minus entfernen, oder einen Eintrag antippen und im Formular löschen. Danach lässt sich das Löschen ein paar Sekunden lang rückgängig machen.

**Umsätze importieren:** In *Finanzen* bei „Einträge“ auf „Import“ tippen und Kontoauszüge als PDF oder ZIP (aus der Sparkassen-App: Auszüge teilen, In Dateien sichern) oder eine CSV-Datei aus dem Online-Banking wählen (Sparkasse: „CSV-CAMT V2“, die meisten anderen Banken klappen auch). Bei PDF-Auszügen rechnet Folio mit den Kontoständen nach, ob alle Umsätze erkannt wurden. Folio sortiert die Umsätze in Kategorien, überspringt schon vorhandene und vorgemerkte Umsätze und merkt sich korrigierte Kategorien pro Empfänger. Die Datei bleibt auf dem Gerät.

**Schule:** Unter *Mehr → Schule* Fächer wählen, Stundenplan eintragen, Hausaufgaben erfassen (sie stehen automatisch auch im Planer) und Noten sammeln. Der Schnitt wird pro Fach und insgesamt berechnet, Klausuren zählen doppelt; „2-“ zählt als 2,3 und „2+“ als 1,7. Für die Oberstufe lässt sich auf Punkte (0 bis 15) umschalten; Noten und Punkte werden ineinander umgerechnet (Note = (17 − Punkte) / 3).

**Untis:** In *Schule → Stundenplan* über „Aus Untis übernehmen“ den persönlichen iCal-Link oder den öffentlichen Link zum Klassen-Stundenplan aus Untis einfügen (oder eine .ics-Datei wählen). Folio übernimmt die Stunden, die sich jede Woche wiederholen, und ordnet Kürzel wie „M“ oder „D-LK“ Fächern zu. Ob der Link direkt abrufbar ist, entscheidet der Untis-Server; sonst geht es über die Datei.

**Lernkarten:** Unter *Mehr → Lernkarten* Stapel anlegen und Karten als „Vorderseite = Rückseite“ eintragen. Beim Lernen kommen Karten, die du gut kannst, seltener dran.

**Sparziele und Abos:** In *Finanzen* gibt es Sparziele mit Fortschrittsring, und Folio erkennt wiederkehrende Zahlungen der letzten sechs Monate und zeigt, was sie im Jahr kosten.

**Stimmung:** Oben in *Ziele* jeden Tag die Stimmung antippen, mit Verlauf der letzten fünf Wochen. Krümel fragt abends nach.

**Countdowns:** Auf der Startseite, zum Beispiel bis zu den Ferien oder jährlich bis zu einem Geburtstag.

**Sperre:** In den Einstellungen lässt sich Folio mit einem Code sperren, auf Wunsch mit Face ID.

**Platte des Tages und Musik-Tipp:** Im Plattenspieler steht jeden Tag eine andere Platte bereit; „Musik-Tipp“ an Krümel wählt passend zu Uhrzeit, Wetter und Stimmung.

**Diktieren:** Im Notizbuch beim Schreiben und in Krümels Chat über das Mikrofon.

**Installieren:** Die Seite in Safari öffnen, auf „Teilen“ tippen und „Zum Home-Bildschirm“ wählen.

- Alle Daten bleiben auf dem Gerät (localStorage und IndexedDB). Unter *Mehr → Backup* lässt sich alles als Datei sichern und wiederherstellen.
- Wetter: [Open-Meteo](https://open-meteo.com) (CC BY 4.0). Karte: [Natural Earth](https://www.naturalearthdata.com) über world-atlas.
- PDF-Export: jsPDF. PDF-Import: pdf.js von Mozilla (Apache License 2.0, siehe vendor/pdfjs). Schrift: Literata (SIL Open Font License).
