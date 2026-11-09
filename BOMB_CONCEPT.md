# 💣 Spielkonzept: "Die Zeitbombe" (Defuse the Bomb)
> Ein interaktives Rätselspiel für den BBC micro:bit – analog zum Tresor-Rätsel für den Zukunftstag / MINT-Workshops.

---

## 🎯 1. Übersicht & Spielidee

### 1.1 Das Szenario
Die Teilnehmenden schlüpfen in die Rolle eines Bombenentschärfungs-Teams (z. B. angelehnt an das beliebte Konzept von *„Keep Talking and Nobody Explodes“*).
Eine tickende „Zeitbombe“ (micro:bit) muss innerhalb eines Zeitlimits oder durch Lösen aufeinanderfolgender Sicherheitsmodule entschärft werden.
Fehler (falsche Drähte, Erschütterungen, zu laute Geräusche) lösen entweder **Strikes** (Strafzeit / schnelleres Ticken) oder die sofortige **Detonation** aus!

### 1.2 Warum analog zum Tresor?
Wie beim **Tresor-Rätsel** (`2025/main.ts` und `LOESUNG.md`) basiert das Spiel auf:
* **Mehrstufigem Ablauf (3 Phasen / Levels):**
  1. *Level 1: Hardware & Verkabelung (Pins & Tasten)* – Drähte trennen / Brücken setzen.
  2. *Level 2: Umweltsensoren & Erschütterung* – Vorsichtige Handhabung, Licht/Ton/Bewegung.
  3. *Level 3: Das Finale / Der Entschärfungscode* – Kombination aus Lage/Kompass und Logo-Bestätigung.
* **Klarem visuellem & auditivem Feedback:** 5x5 LED-Matrix zeigt den Status (z. B. Zeilen/Drähte oder Fortschritt), Soundeffekte signalisieren Fortschritt oder Strikes.
* **Didaktischem Mehrwert:** Spielerisches Erkunden aller Sensoren und Schnittstellen des micro:bit.

---

## 🔍 2. Vollständige Übersicht aller micro:bit Möglichkeiten (Hardware & Features)

Der micro:bit (insbesondere Version 2, aber großteils auch Version 1) bietet vielfältige Ein- und Ausgabemöglichkeiten. Hier ist die vollständige Matrix aller Features und deren Einsatzmöglichkeiten für ein Bomben-Rätsel:

| Kategorie | Sensor / Feature | Verfügbarkeit | Erkennbare Aktionen / Werte | Einsatzmöglichkeit im Bomben-Rätsel |
| :--- | :--- | :--- | :--- | :--- |
| **Tasten / Touch** | **Taste A & B** | v1 & v2 | Gedrückt, Losgelassen, Gleichzeitig gedrückt (A+B) | Code-Eingabe (Morsecode / Sequenz), Timer stoppen, Dual-Key-Sicherheitsschalter (beide Tasten gleichzeitig halten). |
| | **Touch-Logo** | v2 | Berührt (Touch), Losgelassen, Lang gedrückt | Kapazitiver Fingerabdruck-Sensor / biometrische Freigabe; Kriechstrom-Prüfung; Not-Aus-Schalter. |
| **Pins & I/O** | **Krokodilklemmen-Pins (0, 1, 2)** | v1 & v2 | Digital In/Out, Analog In (0-1023), Touch-Pin (mit GND) | **Draht-Module („Kabel durchtrennen“):**<br>• Verbindung GND mit P0/P1/P2 lösen (Draht kappen)<br>• Leitfähige Gegenstände (Alufolie, Drahtbrücke) verbinden. |
| | **GND / 3V Pins** | v1 & v2 | Masse & Stromversorgung | Referenzpotenzial für Touch-Eingaben und Drahtbrücken. |
| | **Edge Connector (P3-P20)** | v1 & v2 | Zusätzliche GPIOs, I2C, SPI | Erweiterbar für externe LED-Countdowns, Servomotoren, Drehpotentiometer. |
| **Bewegung & Lage** | **Beschleunigungssensor (Accelerometer)** | v1 & v2 | Gesten: Schütteln, Neigen (Links/Rechts, Vor/Zurück), Bildschirm oben/unten (Face Up/Down), Freier Fall, 3g/6g/8g Schock | **Quecksilberschalter-Simulation:**<br>• Ruhige Hand: Bei Erschütterung oder Schütteln = Detonation oder Strike!<br>• Lage-Rätsel: Bombe muss in exakter Neigung gehalten werden, um Entschärfungsschraube zu lösen. |
| **Orientierung** | **Kompass (Magnetometer)** | v1 & v2 | Magnetische Himmelsrichtung (0–359°), Magnetfeldstärke | **Orientierungs-Rätsel:** Bombe muss exakt nach Norden (oder eine geheime Richtung) ausgerichtet werden, um den Funksender zu stören. Auch Erkennung von echten Magneten möglich. |
| **Akustik** | **Mikrofon (Sound Sensor)** | v2 | Lautes Geräusch (Loud Sound), Leises Geräusch (Quiet Sound), Schallpegel (0–255) | **Schallsensor-Zünder:**<br>• *Stille bewahren:* Wenn im Raum geredet/geschrien wird (> Schwellwert), tickt die Bombe doppelt so schnell.<br>• *Akustischer Code:* Klatschen (1x, 2x) zur Bestätigung. |
| | **Integrierter Lautsprecher & Summer** | v2 (Speaker), v1 (via Pin 0/Kopfhörer) | Töne, Melodien, Frequenzen, Tonhöhe, Klicks | • Tickgeräusche (Intervall sinkt bei Zeitablauf)<br>• Warntöne / Alarmsirene<br>• Explosions-Sound (White Noise / Glissando abwärts)<br>• Siegesfanfare bei Entschärfung. |
| **Optik** | **Lichtsensor** | v1 & v2 (über LED-Matrix gemessen) | Helligkeit / Lichtstärke (0–255) | **Lichtschranke / Fotodiode:**<br>• Bombe explodiert, wenn Licht darauf fällt (z.B. Auspacken aus der Kiste).<br>• Oder: Sensor muss abgedunkelt werden (Finger draufhalten), um einen Laser zu blockieren. |
| | **5x5 LED-Display** | v1 & v2 | 25 rote LEDs mit Helligkeitsstufen, Symbole, Text-Laufschrift, Balkendiagramme | • Grafischer Countdown (LEDs erlöschen von 25 auf 0).<br>• Modul- und Draht-Statusanzeige.<br>• Strike-Anzeige (X für Fehler).<br>• Explosionsanimation vs. Häkchen / „DEFUSED“. |
| | **Mikrofon-LED** | v2 | Zeigt Mikrofonaktivität an | Zusätzliche visuelle Kontroll-LED. |
| **Umwelt** | **Temperatursensor** | v1 & v2 | Chiptemperatur in °C | **Thermischer Sensor:** Bombe durch Handwärme (oder Kältepusten) um 2 Grad erwärmen, um Kältesperre aufzuheben. |
| **Kommunikation**| **Funk / Radio** | v1 & v2 | 2.4 GHz Paketfunk, Senden & Empfangen von Zahlen / Text | **Zwei-Geräte-Koop (Expert/Defuser):**<br>• micro:bit A ist die Bombe.<br>• micro:bit B ist das Diagnosegerät des Experten, das Status und Codes überträgt.<br>• Funk-Störsender (Radio-Signalstärke RSSI). |

---

## 🧩 3. Detailliertes Rätsel- & Level-Design (Das 3-Phasen-Konzept)

Das Spiel besteht aus **3 Sicherheitsstufen (Levels)**, die nacheinander gelöst werden müssen, bevor der Timer abläuft.

```
       [ START: BOMBE AKTIVIERT ]
                   │
                   ▼
  ┌─────────────────────────────────┐
  │   LEVEL 1: Die Draht-Matrix     │ ➔ 3 Drähte (P0, P1, P2) in richtiger
  │   (Kabel & Tasten)              │   Reihenfolge kappen (GND lösen)
  └─────────────────────────────────┘
                   │  Erfolg (Level 1 cleared)
                   ▼
  ┌─────────────────────────────────┐
  │   LEVEL 2: Sensoren & Umwelt    │ ➔ Bewegungslosigkeit (Accelerometer),
  │   (Licht, Sound, Erschütterung) │   Licht abdecken & 2x Klatschen
  └─────────────────────────────────┘
                   │  Erfolg (Level 2 cleared)
                   ▼
  ┌─────────────────────────────────┐
  │   LEVEL 3: Der Finale Code      │ ➔ Nach Norden ausrichten (Kompass)
  │   (Ausrichtung & Touch-Logo)    │   + Logo 3 Sekunden gedrückt halten
  └─────────────────────────────────┘
                   │
      ┌────────────┴────────────┐
      ▼                         ▼
[ 🏆 DEFUSED! ]         [ 💥 BOOM! ]
(Alle Level geschafft)  (Zeit abgelaufen / 3 Strikes)
```

---

### 3.1 Level 1: Die Draht-Matrix (Kabel & Tasten)
* **Thema:** Klassisches Entschärfen durch Durchtrennen/Abziehen von Kabeln.
* **Erkennungszeichen auf LED:** 5 durchgehende horizontale Balken (wie im Tresor Level 1).
* **Hardware-Aufbau:** Krokodilklemmen verbinden GND mit **P0**, **P1** und **P2**.
* **Aufgabe & Mechanik:**
  * Die Drähte müssen in einer bestimmten **Reihenfolge** entfernt werden (z. B. zuerst Gelb/P1, dann Blau/P0, dann Rot/P2).
  * Anschließend müssen **Taste A** und **Taste B** als Sicherheitsquittierung betätigt werden.
  * **Fehler-Logik:** Zieht jemand den falschen Draht zuerst, ertönt ein Fehlerton (Buzzer) und ein Strike (Strafzeit -15s) wird vergeben.
* **Erfolgs-Feedback:** Jede korrekte Aktion löscht eine Zeile auf dem Display. Sind alle 5 Zeilen gelöscht ➔ Kurze Melodie, Zwischenstand gespeichert, Übergang zu Level 2.

---

### 3.2 Level 2: Der Erschütterungs- & Umwelt-Mechanismus
* **Thema:** Der Zünder reagiert empfindlich auf äußere Einflüsse (Licht, Erschütterung, Schall).
* **Erkennungszeichen auf LED:** Ein pulsierendes Warnsymbol (z. B. ein zentrierter Punkt oder ein Ausrufezeichen).
* **Aufgabe & Mechanik:**
  1. **Lichtschranke blockieren:** Den Lichtsensor abdunkeln (Hand über das Board legen: `lightLevel() < 15`).
  2. **Akustischer Impuls:** Während es dunkel ist, ein kurzes lautes Klatschen erzeugen (`DetectedSound.Loud`).
  3. **Stille & Erschütterungsfreiheit bewahren:** Für 3 Sekunden darf der micro:bit nicht bewegt werden (Erschütterung / `onGesture(Shake)` gibt sofort einen Strike!).
* **Erfolgs-Feedback:** Display zeigt ein Schloss-Symbol, gefolgt von zwei kurzen Bestätigungstönen.

---

### 3.3 Level 3: Der Finale Entschärfungscode (Kompass & Touch)
* **Thema:** Die Deaktivierung der Hauptladung erfordert die exakte Ausrichtung des Geräts und biometrische Freigabe.
* **Erkennungszeichen auf LED:** Ein Kompass-Pfeil oder rotierender Strich.
* **Aufgabe & Mechanik:**
  1. **Kompass-Ausrichtung:** Der micro:bit muss flach gehalten und nach **Norden** ausgerichtet werden (Magnetischer Kurs zwischen 350° und 10°).
  2. Sobald die Nord-Richtung stabil gehalten wird, beginnen die LEDs am Rand im Kreis zu laufen.
  3. **Biometrische Bestätigung:** Während die Ausrichtung stimmt, muss das **goldene Touch-Logo** für mindestens 3 Sekunden ununterbrochen berührt werden.
* **Erfolgs-Feedback:** Das Ticken stoppt sofort!

---

### 3.4 Das Finale: Erfolg vs. Detonation

#### 🏆 Szenario A: Bombe erfolgreich entschärft (DEFUSED)
* **Visualisierung:** Großes Häkchen (`IconNames.Yes`), danach Laufschrift: `"DEFUSED!"`.
* **Audio:** Siegesfanfare / triumphale Tonfolge (z. B. Melodie wie im Tresor).
* **Status:** Der micro:bit geht in einen sicheren Ruhezustand; keine weiteren Eingaben möglich.

#### 💥 Szenario B: Detonation (BOOM!)
* **Trigger:** Countdown erreicht 00:00 ODER 3 Strikes gesammelt.
* **Visualisierung:**
  1. Display flackert hektisch auf voller Helligkeit.
  2. Totenkopf-Symbol (`IconNames.Skull`) oder Explosionswolke.
  3. Laufschrift: `"BOOM! GAME OVER"`.
* **Audio:** Schneller abfallender Glissando-Ton / tiefes Rauschen, gefolgt von einem langen tiefen Fehlerton.

---

## ⏱️ 4. Feedback-, Timer- und Strike-System

1. **Der Haupt-Timer (Countdown):**
   * Gesamtdauer standardmäßig: **3:00 Minuten (180 Sekunden)** (konfigurierbar).
   * Hintergrund-Schleife zählt sekündlich runter.
   * **Auditives Ticken:** Jede Sekunde ein kurzer Ton (`music.playTone(880, 20)`). In den letzten 30 Sekunden verdoppelt sich die Frequenz (alle 500 ms).
   * **Visueller Countdown:** Kann durch Drücken von A+B jederzeit kurz als Balken oder Ziffern angezeigt werden.

2. **Das Strike-System (Fehlversuche):**
   * Maximal 3 Strikes erlaubt.
   * Bei Strike 1: LED zeigt kurz ein großes `"X"`, Timer wird um 20 Sekunden gekürzt, Ticken wird spürbar schneller.
   * Bei Strike 2: LED zeigt `"XX"`, Timer um weitere 30 Sekunden gekürzt.
   * Bei Strike 3: Sofortige Detonation!

---

## 📜 5. Lösungsanleitung / "Handbuch für den Bombenexperten" (analog LOESUNG.md)

> Dieses Handbuch erhalten die Teammitglieder, die den micro:bit *nicht* berühren dürfen, sondern dem Entschärfer Anweisungen geben müssen!

```markdown
# 📋 Das Handbuch des Bombenexperten

## ⚠️ Sicherheitsregeln
1. Berühre die Bombe niemals selbst – nur der Entschärfer vor Ort bedient das Gerät!
2. Höre auf das Ticken: Wird es schneller, habt ihr einen Strike kassiert!
3. Bei 3 Strikes oder Ablauf des Timers detoniert das System.

---

### 1️⃣ Modul 1: Die Kabelsequenz
* **Anzeige:** 5 durchgezogene LED-Balken.
* **Aktion:**
  1. Trenne zuerst das Kabel an **Pin 1** (Zweite Zeile erlischt).
  2. Trenne als zweites das Kabel an **Pin 0** (Oberste Zeile erlischt).
  3. Trenne als drittes das Kabel an **Pin 2** (Dritte Zeile erlischt).
  4. Drücke kurz **Taste A** (Vierte Zeile erlischt).
  5. Drücke kurz **Taste B** (Unterste Zeile erlischt).
* *Achtung: Jedes falsche Kabel gibt sofort einen Strike!*

---

### 2️⃣ Modul 2: Der Erschütterungs- & Schallsensor
* **Anzeige:** Ein blinkender Punkt in der Mitte.
* **Aktion:**
  1. Halte die Bombe absolut ruhig – **NICHT schütteln**!
  2. Decke das Display vollständig mit der flachen Hand ab (Dunkelheit).
  3. Während es dunkel ist: Klatsche **einmal laut** in die Hände!
  4. Nimm die Hand weg, sobald ein Doppelpieps ertönt.

---

### 3️⃣ Modul 3: Die End-Deaktivierung
* **Anzeige:** Ein Kompass-Pfeil.
* **Aktion:**
  1. Drehe die Bombe vorsichtig flach auf dem Tisch, bis sie **genau nach Norden** (0°) zeigt.
  2. Wenn die Richtung stimmt, blinkt der äußere LED-Rahmen.
  3. Halte nun das **goldene micro:bit Logo** für **3 Sekunden** fest berührt.
* **Erfolg:** Das Häkchen erscheint, die Melodie spielt – die Bombe ist entschärft!
```

---

## 💻 6. Technische Software-Architektur (MakeCode TypeScript)

Hier ist die Architektur für das neue Rätsel, direkt umsetzbar in MakeCode analog zu `main.ts`:

```typescript
/**
 * BOMB DEFUSAL PUZZLE (MakeCode TypeScript)
 * Analog zum Tresor-Rätsel 2025
 */

// --- Spiel-Zustände ---
let AktuellesLevel = 1      // 1 = Wires, 2 = Sensors, 3 = Compass/Logo, 4 = Defused, 5 = Detonated
let Strikes = 0
const MAX_STRIKES = 3
let ZeitUebrig = 180         // Sekunden
let SpielGesperrt = false
let ZeilenStatus = [true, true, true, true, true]

// --- Start & Initialisierung ---
function StartSpiel() {
    AktuellesLevel = 1
    Strikes = 0
    ZeitUebrig = 180
    SpielGesperrt = false
    ZeilenStatus = [true, true, true, true, true]
    UpdateGraphik()
}

// --- Visualisierung ---
function UpdateGraphik() {
    basic.clearScreen()
    if (AktuellesLevel == 1) {
        // Level 1: Horizontale Balken (Befestigte Drähte)
        for (let i = 0; i < 5; i++) {
            if (ZeilenStatus[i]) {
                for (let x = 0; x < 5; x++) {
                    led.plot(x, i)
                }
            }
        }
    } else if (AktuellesLevel == 2) {
        // Level 2: Sensor-Fokus (Blinkendes Zentrum)
        led.plot(2, 2)
    } else if (AktuellesLevel == 3) {
        // Level 3: Fadenkreuz / Kompass
        led.plot(2, 1)
        led.plot(2, 3)
        led.plot(1, 2)
        led.plot(3, 2)
    }
}

// --- Fehler- / Strike-Behandlung ---
function RegistriereFehler() {
    Strikes++
    music.playTone(200, music.beat(BeatFraction.Double))
    basic.showIcon(IconNames.No)
    basic.pause(500)
    ZeitUebrig = Math.max(5, ZeitUebrig - 20) // 20s Zeitstrafe
    if (Strikes >= MAX_STRIKES) {
        Detoniere()
    } else {
        UpdateGraphik()
    }
}

// --- Detonation ---
function Detoniere() {
    AktuellesLevel = 5
    SpielGesperrt = true
    music.playTone(130, music.beat(BeatFraction.Whole))
    basic.showIcon(IconNames.Skull)
    music.playMelody("C5 B A G F E D C ", 300)
    basic.showString("BOOM!")
}

// --- Erfolg / Entschärft ---
function Entschaerft() {
    AktuellesLevel = 4
    SpielGesperrt = true
    basic.showIcon(IconNames.Yes)
    music.playMelody("C E G C5 C5 G E C ", 240)
    basic.showString("DEFUSED!")
}

// --- Hintergrund-Timer & Ticken ---
control.inBackground(function () {
    while (AktuellesLevel < 4) {
        basic.pause(1000)
        ZeitUebrig--
        // Ticken
        let tonIntervall = ZeitUebrig < 30 ? 1046 : 880
        music.playTone(tonIntervall, 20)

        if (ZeitUebrig <= 0) {
            Detoniere()
            break
        }
    }
})

// --- Level 1 Inputs (Kabel in exakter Reihenfolge P1 -> P0 -> P2) ---
let DrahtSchritt = 0
input.onPinReleased(TouchPin.P1, function () {
    if (AktuellesLevel != 1 || SpielGesperrt) return
    if (DrahtSchritt == 0) {
        ZeilenStatus[1] = false
        DrahtSchritt++
        music.playTone(523, 50)
        UpdateGraphik()
    } else {
        RegistriereFehler()
    }
})

input.onPinReleased(TouchPin.P0, function () {
    if (AktuellesLevel != 1 || SpielGesperrt) return
    if (DrahtSchritt == 1) {
        ZeilenStatus[0] = false
        DrahtSchritt++
        music.playTone(587, 50)
        UpdateGraphik()
    } else {
        RegistriereFehler()
    }
})

input.onPinReleased(TouchPin.P2, function () {
    if (AktuellesLevel != 1 || SpielGesperrt) return
    if (DrahtSchritt == 2) {
        ZeilenStatus[2] = false
        DrahtSchritt++
        music.playTone(659, 50)
        UpdateGraphik()
    } else {
        RegistriereFehler()
    }
})

input.onButtonPressed(Button.A, function () {
    if (AktuellesLevel != 1 || SpielGesperrt) return
    if (DrahtSchritt == 3) {
        ZeilenStatus[3] = false
        DrahtSchritt++
        music.playTone(698, 50)
        UpdateGraphik()
    }
})

input.onButtonPressed(Button.B, function () {
    if (AktuellesLevel != 1 || SpielGesperrt) return
    if (DrahtSchritt == 4) {
        ZeilenStatus[4] = false
        music.playTone(784, 50)
        // Level 1 beendet -> Wechsel zu Level 2
        AktuellesLevel = 2
        basic.showIcon(IconNames.Yes)
        basic.pause(1000)
        UpdateGraphik()
    }
})

// --- Level 2 Inputs (Sensoren: Dunkelheit + Sound, Erschütterungsverbot) ---
input.onGesture(Gesture.Shake, function () {
    if (AktuellesLevel == 2 && !SpielGesperrt) {
        RegistriereFehler() // Bombe darf in Level 2 nicht geschüttelt werden!
    }
})

input.onSound(DetectedSound.Loud, function () {
    if (AktuellesLevel == 2 && !SpielGesperrt) {
        if (input.lightLevel() < 15) {
            // Richtig: Abgedunkelt UND laut geklatscht
            AktuellesLevel = 3
            music.playTone(880, 100)
            basic.showIcon(IconNames.Yes)
            basic.pause(1000)
            UpdateGraphik()
        } else {
            RegistriereFehler()
        }
    }
})

// --- Level 3 Inputs (Kompass Nord + Touch Logo) ---
let logoGedruecktDauer = 0
basic.forever(function () {
    if (AktuellesLevel == 3 && !SpielGesperrt) {
        let heading = input.compassHeading()
        // Richtung Norden: heading < 15 oder > 345
        let isNord = (heading < 15 || heading > 345)

        if (isNord && input.logoIsPressed()) {
            logoGedruecktDauer++
            music.playTone(440 + logoGedruecktDauer * 100, 50)
            if (logoGedruecktDauer >= 6) { // ca. 3 Sekunden (bei 500ms Schleife)
                Entschaerft()
            }
        } else {
            logoGedruecktDauer = 0
        }
        basic.pause(500)
    }
})

// Start initialisieren
StartSpiel()
```

---

## 🚀 7. Didaktischer Mehrwert & Workshop-Einsatz

* **Teamwork & Kommunikation:** Das Spiel fördert exaktes Erklären und Zuhören (Information Gap: Experte mit Handbuch vs. Entschärfer an der Hardware).
* **Sensorik begreifbar machen:** Die Jugendlichen lernen, wie digitale Inputs (Pins, Tasten), analoge Umweltsensoren (Licht, Sound, Temperatur) und Bewegungssensoren (Beschleunigung, Kompass) in Code verarbeitet werden.
* **Hoher Spaßfaktor:** Der Countdown, das realistische Ticken und die Soundkulisse schaffen eine packende Escape-Room-Atmosphäre für den Zukunftstag.
