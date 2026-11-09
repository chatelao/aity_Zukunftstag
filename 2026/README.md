# 💣 Die Zeitbombe (BBC micro:bit Zukunftstag 2026)

Ein kooperatives Bombenentschärfungs-Puzzle für den BBC micro:bit – inspiriert vom Koop-Klassiker *„Keep Talking and Nobody Explodes“*.

Das Spiel funktioniert **völlig autark ohne externe Drähte oder Zubehör** – alle Eingaben erfolgen rein über die On-Board-Tasten, Gesten und Sensoren des micro:bit v2.

---

## 🎯 Spielidee & Regeln

* **Teamwork:** Die entschärfende Person bedient den micro:bit, während die Bombenexperten nur das Handbuch ([LOESUNG.md](LOESUNG.md)) konsultieren.
* **Sichtbarer LED-Countdown:** Die 5x5 LED-Matrix zeigt permanent den Countdown als Füllstand (25 LEDs).
* **Dynamisches Ticken:** Je weniger Zeit verbleibt, desto schneller tickt die Bombe (>60s: alle 10s, 20–60s: alle 5s, <20s: alle 2s).
* **Zeit-Bonus:** Richtige Aktionen schenken wertvolle Bonuszeit zurück!
* **Strikes & Detonation:** 3 Strikes oder ein abgelaufener Countdown führen zur Detonation.

---

## 🧩 Die 3 Sicherheitsmodule

1. **Level 1: Tasten-Sicherheitssequenz** – Die richtige Tastenfolge am micro:bit eingeben (`A ➔ B ➔ A+B ➔ A`).
2. **Level 2: Umweltsensoren & Erschütterung** – Lichtsensor abdecken und gezielt klatschen, ohne den micro:bit zu schütteln.
3. **Level 3: Finale Ausrichtung & Biometrie** – Den micro:bit flach nach Norden ausrichten und das goldene Touch-Logo 3 Sekunden lang berühren.

Ausführliche Anweisungen und Lösungsdetails befinden sich in [LOESUNG.md](LOESUNG.md).

---

## 💻 Als Erweiterung verwenden & In MakeCode bearbeiten

Dieses Repository kann direkt in Microsoft MakeCode für den micro:bit geladen werden:

1. Öffne [https://makecode.microbit.org/](https://makecode.microbit.org/)
2. Klicke auf **Importieren** ➔ **Importiere URL**
3. URL eingeben: `https://github.com/ochatelain/aity_zukunftstag2025_tresor` (oder den entsprechenden Fork)
4. Auf micro:bit v2 übertragen und losspielen!

#### Metadaten

* for PXT/microbit
