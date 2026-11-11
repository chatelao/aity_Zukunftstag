# 📜 Die Lösung (Spielanleitung)

> Hier ist der "Schummelzettel", um das Spiel von Anfang bis Ende zu lösen.
> Die erwarteten LED-Bilder pro Schritt findest du in [SCREENS.md](SCREENS.md).

## 1️⃣ Level 1: Die Verkabelung

* **Erkennungszeichen:** LEDs zeigen die Binärzahlen 3, 5, 7, 9 (rechtsbündig) und unten drei LEDs links.
* **Hardware:** Ein Kabel an **GND** anschließen und damit die Pins berühren (oder GND und Pin gleichzeitig mit den Fingern berühren).

| Eingabe / Trigger | Effekt |
| :--- | :--- |
| **GND + Pin 0** | Oberste Zeile verschwindet (3) |
| **GND + Pin 1** | Zweite Zeile verschwindet (5) |
| **GND + Pin 2** | Dritte Zeile verschwindet (7) |
| **Taste A** | Vierte Zeile verschwindet (9) |
| **Taste B** | Unterste Zeile verschwindet |

*Visualisierung:* `Häkchen ✔ → Dollarzeichen $ → "2"`

---

## 2️⃣ Level 2: Die Sensoren

* **Erkennungszeichen:** LEDs zeigen Punkte / Hohle Linien.
* **Hardware:** Keine Kabel nötig.

| Eingabe / Trigger | Effekt |
| :--- | :--- |
| **Lärm machen** (Klatschen) – Zeile wird mit steigender Lautstärke dunkler | Oberste Zeile verschwindet |
| **Schütteln** | Zweite Zeile verschwindet |
| **Nach Norden drehen** oder **Lichtsensor zuhalten** – Zeile wird dabei dunkler | Dritte Zeile verschwindet |
| **Nach Rechts neigen** | Vierte Zeile verschwindet |
| **Goldenes Logo berühren** | Unterste Zeile verschwindet |

*Visualisierung:* `Häkchen ✔ → Pokal 🏆`

---

## 🏆 Das Finale

Nach Level 2 erscheint das **Häkchen** und danach bleibt der **Pokal** dauerhaft stehen, begleitet von der Siegesfanfare.
