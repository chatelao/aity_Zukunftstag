# 🖥️ Erwartete Bildschirme (5x5 LED-Display)

> Ablauf des Spiels in [`main.ts`](main.ts) – Startbild und Anzeige nach jedem gelösten Schritt.

**Legende:**

| Zeichen | Bedeutung |
| :---: | :--- |
| `#` | LED an (volle Helligkeit) |
| `+` | LED gedimmt (analoges Rätsel, wird beim Annähern an die Lösung dunkler) |
| `.` | LED aus |

> [!NOTE]
> Die Zeilen können in **beliebiger Reihenfolge** gelöst werden. Unten ist die Reihenfolge von oben nach unten dargestellt.
> Jede gelöste Zeile verschwindet sofort und es ertönt ein kurzer Ton (C5).

---

## 1️⃣ Level 1: Binäre Fortschrittsanzeige (Pins & Tasten)

Jede Zeile zeigt eine Binärzahl: **3, 5, 7, 9** und die Zeile für Taste B.

### Start

```
        x: 0 1 2 3 4
          +---------+
  Zeile 0 |. . . # #|   3 = 00011  -> Pin 0
  Zeile 1 |. . # . #|   5 = 00101  -> Pin 1
  Zeile 2 |. . # # #|   7 = 00111  -> Pin 2
  Zeile 3 |. # . . #|   9 = 01001  -> Taste A
  Zeile 4 |# # # . .|              -> Taste B
          +---------+
```

### Schritt 1 – Pin 0 berührt (GND + P0)

```
+---------+
|. . . . .|
|. . # . #|
|. . # # #|
|. # . . #|
|# # # . .|
+---------+
```

### Schritt 2 – Pin 1 berührt (GND + P1)

```
+---------+
|. . . . .|
|. . . . .|
|. . # # #|
|. # . . #|
|# # # . .|
+---------+
```

### Schritt 3 – Pin 2 berührt (GND + P2)

```
+---------+
|. . . . .|
|. . . . .|
|. . . . .|
|. # . . #|
|# # # . .|
+---------+
```

### Schritt 4 – Taste A gedrückt

```
+---------+
|. . . . .|
|. . . . .|
|. . . . .|
|. . . . .|
|# # # . .|
+---------+
```

### Schritt 5 – Taste B gedrückt → Level 1 geschafft

```
 Leer (kurz)      Häkchen (2 s)    Dollar $ (5 s)    "2" (Laufschrift)
+---------+       +---------+       +---------+       +---------+
|. . . . .|       |. . . . .|       |. # # # .|       |. # # . .|
|. . . . .|       |. . . . #|       |# . # . .|       |. . . # .|
|. . . . .|  -->  |. . . # .|  -->  |. # # # .|  -->  |. . # . .|
|. . . . .|       |# . # . .|       |. . # . #|       |. # . . .|
|. . . . .|       |. # . . .|       |. # # # .|       |. # # # .|
+---------+       +---------+       +---------+       +---------+
                                    + Melodie
                                    "E G B C5"
```

---

## 2️⃣ Level 2: Hohles Logo (Sensoren & Gesten)

### Start

```
        x: 0 1 2 3 4
          +---------+
  Zeile 0 |# . # . .|   -> Lärm / Klatschen (analog, dimmt)
  Zeile 1 |. # . # .|   -> Schütteln
  Zeile 2 |. . # . #|   -> Nach Norden drehen ODER Lichtsensor zuhalten (analog, dimmt)
  Zeile 3 |. # . # .|   -> Nach rechts neigen
  Zeile 4 |# . # . .|   -> Goldenes Logo berühren
          +---------+
```

### Zwischenzustand – analoge Rätsel (Zeile 0 und 2)

Je lauter es ist bzw. je näher an Norden / je dunkler, desto schwächer leuchten die Zeilen 0 und 2:

```
+---------+
|+ . + . .|   <- Zeile 0 wird mit steigender Lautstärke dunkler
|. # . # .|
|. . + . +|   <- Zeile 2 wird Richtung Norden / bei Abdunkeln dunkler
|. # . # .|
|# . # . .|
+---------+
```

### Schritt 1 – Laut geklatscht (Schallpegel ≥ 128)

```
+---------+
|. . . . .|
|. # . # .|
|. . # . #|
|. # . # .|
|# . # . .|
+---------+
```

### Schritt 2 – Geschüttelt

```
+---------+
|. . . . .|
|. . . . .|
|. . # . #|
|. # . # .|
|# . # . .|
+---------+
```

### Schritt 3 – Nach Norden ausgerichtet (< 10°) oder Lichtsensor abgedeckt (< 10)

```
+---------+
|. . . . .|
|. . . . .|
|. . . . .|
|. # . # .|
|# . # . .|
+---------+
```

### Schritt 4 – Nach rechts geneigt

> [!WARNING]
> In der aktuellen [`main.ts`](main.ts) ist für Zeile 3 **kein Eingabe-Handler** vorhanden (z. B. `input.onGesture(Gesture.TiltRight, ...)`).
> Diese Zeile kann daher momentan nicht gelöscht werden und Level 2 lässt sich nicht abschließen. Die folgenden Bilder zeigen das **erwartete** Verhalten.

```
+---------+
|. . . . .|
|. . . . .|
|. . . . .|
|. . . . .|
|# . # . .|
+---------+
```

### Schritt 5 – Goldenes Logo berührt → Level 2 geschafft (Spielende)

```
 Leer (kurz)      Häkchen (1 s)    Pokal (bleibt stehen)
+---------+       +---------+       +---------+
|. . . . .|       |. . . . .|       |# # # # #|
|. . . . .|       |. . . . #|       |. # # # .|
|. . . . .|  -->  |. . . # .|  -->  |. . # . .|
|. . . . .|       |# . # . .|       |. # # # .|
|. . . . .|       |. # . . .|       |# # # # #|
+---------+       +---------+       +---------+
                                    + Siegesfanfare
                                    "G C5 E C5 G C5 E C5"
```

🏆 **Geschafft!** Der Pokal bleibt dauerhaft angezeigt.
