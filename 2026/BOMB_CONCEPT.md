# 💣 Spielkonzept: "Die Zeitbombe" (Defuse the Bomb)
> Ein interaktives Rätselspiel für den BBC micro:bit – analog zum Tresor-Rätsel für den Zukunftstag / MINT-Workshops.

---

## 🎯 1. Übersicht & Spielidee

### 1.1 Das Szenario
Die Teilnehmenden schlüpfen in die Rolle eines Bombenentschärfungs-Teams (angelehnt an das beliebte Koop-Konzept von *„Keep Talking and Nobody Explodes“*).
Eine tickende „Zeitbombe“ (micro:bit) muss innerhalb eines Zeitlimits durch Lösen aufeinanderfolgender Sicherheitsmodule entschärft werden.
Das gesamte Spiel funktioniert **völlig autark ohne externe Drähte oder Zubehör** – alle Eingaben erfolgen rein über die On-Board-Tasten, Gesten und Sensoren des micro:bit!

Fehler lösen entweder **Strikes** (Strafzeit) oder die sofortige **Detonation** aus. Doch Teamwork zahlt sich aus: **Jeder gelöste Teilschritt belohnt das Team mit wertvoller Bonus-Restzeit!**

### 1.2 Warum analog zum Tresor?
Wie beim **Tresor-Rätsel** (`2025/main.ts` und `LOESUNG.md`) basiert das Spiel auf:
* **Mehrstufigem Ablauf (3 Phasen / Levels):**
  1. *Level 1: Tasten- & Eingabesequenz* – Entschärfung über die kombinierte Tasteneingabe **A+B** am Board.
  2. *Level 2: Umweltsensoren & Erschütterung* – Vorsichtige Handhabung, Lichtsensor, Sound & ruhige Hand.
  3. *Level 3: Das Finale / Der Entschärfungscode* – Kombination aus Ausrichtung (Kompass) und kapazitiver Logo-Bestätigung.
* **Klarem visuellem & auditivem Feedback:**
  * Der **Countdown wird permanent in der obersten Zeile** (von 10 auf 0 Pixel/Schritte) angezeigt. Das nächste Pixel, das verschwinden wird, **blinkt** dabei rhythmisch.
  * Das **Ticken** passt sich der Dringlichkeit an (zuerst alle 10s, dann 5s und am Schluss alle 2s).
* **Didaktischem Mehrwert:** Spielerisches Erkunden aller Sensoren des micro:bit ohne Aufbau-Aufwand (Plug & Play).

---

## 🔍 2. Übersicht aller micro:bit Möglichkeiten (Hardware & Features)

Der micro:bit bietet vielfältige Ein- und Ausgabemöglichkeiten – komplett ohne externe Verkabelung:

| Kategorie | Sensor / Feature | Verfügbarkeit | Erkennbare Aktionen / Werte | Einsatzmöglichkeit im Bomben-Rätsel |
| :--- | :--- | :--- | :--- | :--- |
| **Tasten / Touch** | **Taste A & B** | v1 & v2 | Gleichzeitig gedrückt (**nur kombinierte A+B Eingabe**) | **Deaktivierung / Entschärfung:**<br>• Reine **A+B** Eingabe (beide Tasten gleichzeitig gedrückt)<br>• Quittierung & Entsicherung. |
| | **Touch-Logo** | v2 | Berührt (Touch), Losgelassen, Lang gedrückt | Kapazitiver Fingerabdruck-Sensor / biometrische Freigabe; Not-Aus-Schalter. |
| **Bewegung & Lage** | **Beschleunigungssensor (Accelerometer)** | v1 & v2 | Gesten: Schütteln, Neigen (Links/Rechts, Vor/Zurück), Bildschirm oben/unten (Face Up/Down) | **Erschütterungssensor:**<br>• *Ruhige Hand:* Schütteln oder ruckartiges Bewegen löst Strikes aus!<br>• Lage-Rätsel: Bombe muss vorsichtig gehalten werden. |
| **Orientierung** | **Kompass (Magnetometer)** | v1 & v2 | Magnetische Himmelsrichtung (0–359°) | **Orientierungs-Rätsel:** Bombe muss exakt nach Norden ausgerichtet werden, um das Magnetventil zu blockieren. |
| **Akustik** | **Mikrofon (Sound Sensor)** | v2 | Lautes Geräusch (Loud Sound), Schallpegel (0–255) | **Schallsensor-Zünder:**<br>• Akustischer Impuls: Gezieltes Klatschen zum Überbrücken eines Relais.<br>• *Lärmverbot:* Bei zu lautem Geschrei tickt die Uhr schneller. |
| | **Integrierter Lautsprecher & Summer** | v2 (Speaker), v1 (via Pin 0/Kopfhörer) | Töne, Melodien, Frequenzen, Ticks | • **Dynamisches Ticken:** Zuerst alle 10s, dann alle 5s, am Schluss alle 2s.<br>• Warntöne / Alarmsirene<br>• Detonationsgeräusch vs. Siegesfanfare. |
| **Optik** | **Lichtsensor** | v1 & v2 (über LED-Matrix gemessen) | Helligkeit / Lichtstärke (0–255) | **Optischer Zünder / Lichtschranke:**<br>• Sensor muss abgedunkelt werden (Hand auflegen), um Laserstrahl zu unterbrechen. |
| | **5x5 LED-Display** | v1 & v2 | 25 rote LEDs mit Helligkeitsstufen | • **Sichtbarer Countdown:** Countdown in der obersten Zeile (von 10 auf 0 Pixel/Schritte), nächstes verschwindendes Pixel blinkt.<br>• Fehleranzeige (Strike-Symbol `X`).<br>• End-Animationen (Totenkopf `Skull` vs. Häkchen `Yes`). |
| **Umwelt** | **Temperatursensor** | v1 & v2 | Chiptemperatur in °C | Optional: Thermische Sperre durch Handwärme. |

---

## 🧩 3. Detailliertes Rätsel- & Level-Design (Das 3-Phasen-Konzept)

Das Spiel besteht aus **3 Sicherheitsstufen (Levels)**, die nacheinander gelöst werden müssen, bevor der Timer abläuft.

```
       [ START: BOMBE AKTIVIERT ]
                   │
                   ▼
  ┌─────────────────────────────────┐
  │   LEVEL 1: Die A+B Deaktivierung│ ➔ Nur kombinierte Taste A+B verwenden!
  │   (Keine Drähte nötig!)         │   Erfolgreiche Eingabe gibt Bonuszeit!
  └─────────────────────────────────┘
                   │  Erfolg (Level 1 cleared) + Bonuszeit
                   ▼
  ┌─────────────────────────────────┐
  │   LEVEL 2: Sensoren & Umwelt    │ ➔ Dunkelheit (Lichtsensor) + Klatschen.
  │   (Licht, Sound, Erschütterung) │   Erschütterung (Shake) gibt Strike!
  └─────────────────────────────────┘   Erfolg belohnt mit Bonuszeit (+20s)!
                   │  Erfolg (Level 2 cleared)
                   ▼
  ┌─────────────────────────────────┐
  │   LEVEL 3: Der Finale Code      │ ➔ Nach Norden ausrichten (Kompass)
  │   (Ausrichtung & Touch-Logo)    │   + Logo 3 Sekunden gedrückt halten.
  └─────────────────────────────────┘
                   │
      ┌────────────┴────────────┐
      ▼                         ▼
[ 🏆 DEFUSED! ]         [ 💥 BOOM! ]
(Alle Level geschafft)  (Zeit abgelaufen / 3 Strikes)
```

---

### 3.1 Level 1: Die Tasten-Deaktivierung (Nur kombinierte A+B Eingabe!)
* **Thema:** Deaktivierung der digitalen Sicherheitsrelais über die kombinierte Tasteneingabe **A+B** am Board.
* **Sichtbarer Countdown & Status:** Die oberste LED-Zeile zeigt permanent den Countdown von 10 auf 0 Pixel/Stufen an. Das nächste Pixel, das erlischt, blinkt rhythmisch.
* **Aufgabe & Mechanik:**
  * Es wird **ausschließlich die kombinierte A+B Eingabe** (beide Tasten gleichzeitig gedrückt) verwendet!
  * Einzelne Betätigungen von Taste A oder Taste B allein werden ignoriert oder lösen keine Deaktivierung aus – nur das synchrone Drücken von **A+B** schaltet das Relais.
  * Das Team muss die kombinierte A+B Deaktivierung gezielt auslösen.
  * **Belohnungs-Mechanik (Zeit-Bonus):** Das erfolgreiche Ausführen der A+B Kombination belohnt das Team mit **+20 Sekunden Bonuszeit** und einem Quittungston!
* **Erfolgs-Feedback:** Bestätigungsmelodie, **+20 Sekunden Bonus**, automatischer Wechsel zu Level 2.

---

### 3.2 Level 2: Der Erschütterungs- & Umweltsensor
* **Thema:** Der Zünder reagiert hochsensibel auf Licht und Erschütterungen.
* **Sichtbarer Countdown:** Die oberste Zeile zählt weiter sichtbar von 10 auf 0 herunter (nächstes Pixel blinkt).
* **Aufgabe & Mechanik:**
  1. **Lichtschranke blockieren:** Den Lichtsensor auf der LED-Matrix vollständig mit der flachen Hand abdunkeln (`lightLevel() < 15`).
  2. **Akustischer Entlastungsimpuls:** Während es dunkel ist, gezielt **einmal laut klatschen** (`DetectedSound.Loud`).
  3. **Strikte Erschütterungsfreiheit:** Während des gesamten Moduls darf der micro:bit nicht geschüttelt werden (`onGesture(Shake)` erzeugt sofort einen Strike!).
* **Belohnungs-Mechanik (Zeit-Bonus):** Das erfolgreiche Überbrücken des Sensors schenkt dem Team **+25 Sekunden Bonuszeit**!
* **Erfolgs-Feedback:** Schloss-Symbol / Doppelton, Übergang zu Level 3.

---

### 3.3 Level 3: Der Finale Entschärfungscode (Kompass & Touch-Logo)
* **Thema:** Das Deaktivieren der Hauptladung erfordert präzise Ausrichtung und biometrische Freigabe.
* **Aufgabe & Mechanik:**
  1. **Kompass-Ausrichtung:** Der micro:bit muss flach auf den Tisch gelegt und exakt nach **Norden** ausgerichtet werden (Magnetkurs zwischen 350° und 10°).
  2. **Biometrische Entschärfung:** Sobald die Nord-Richtung stimmt, muss das **goldene Touch-Logo** für mindestens 3 Sekunden ununterbrochen berührt werden.
* **Erfolgs-Feedback:** Das Ticken stoppt sofort – die Bombe ist entschärft!

---

### 3.4 Das Finale: Erfolg vs. Detonation

#### 🏆 Szenario A: Bombe erfolgreich entschärft (DEFUSED)
* **Visualisierung:** Großes Häkchen (`IconNames.Yes`), danach Laufschrift: `"DEFUSED!"`.
* **Audio:** Siegesfanfare (triumphale Melodie).
* **Status:** Der Timer stoppt, das System schaltet sich sicher ab.

#### 💥 Szenario B: Detonation (BOOM!)
* **Trigger:** Countdown erreicht 0 Sekunden ODER 3 Strikes erreicht.
* **Visualisierung:** Display flackert hektisch, Totenkopf-Symbol (`IconNames.Skull`), Laufschrift `"BOOM!"`.
* **Audio:** Absteigendes Glissando, dumpfer Explosions-Ton.

---

## ⏱️ 4. Feedback-, Timer- und Strike-System

### 4.1 Der sichtbare LED-Countdown
* **Countdown in der obersten Zeile:** Die oberste LED-Zeile (y = 0) dient als permanenter visueller Countdown von 10 auf 0 Pixel.
* **10-Stufen Balkenanzeige & Blinken:**
  * Der Countdown wird in 10 Stufen dargestellt (entsprechend den 5 LEDs der obersten Zeile: 5 LEDs x 2 Zustände, bzw. 10 Pixel-Einheiten).
  * Bereits abgelaufene Pixel sind dunkel (aus).
  * Vollständig verbleibende Pixel leuchten dauerhaft.
  * **Das nächste Pixel, das verschwinden wird, blinkt dabei rhythmisch**, sodass der Zeitverlust visuell sofort erfassbar ist!
* **Zeitzugewinn sichtbar:** Wird ein Schritt gelöst und die Restzeit erhöht sich, **schalten sich erloschene Pixel wieder an**! Das Team sieht sofort, wie wertvolle Zeit zurückgewonnen wird.

### 4.2 Das 3-Stufen-Tickintervall
Das akustische Ticken passt sich dynamisch der verbleibenden Restzeit an:
1. **Entspannte Phase (> 60 Sekunden Restzeit):** Ticken ertönt gemächlich **alle 10 Sekunden**.
2. **Kritische Phase (20 bis 60 Sekunden Restzeit):** Ticken beschleunigt sich auf **alle 5 Sekunden**.
3. **Panik-Phase (< 20 Sekunden Restzeit):** Ticken hetzt **alle 2 Sekunden**.

### 4.3 Schrittweiser Zeit-Bonus
* Abschluss von Level 1 (Kombinierte A+B Eingabe): **+20 Sekunden**
* Abschluss von Level 2: **+25 Sekunden**
* Dadurch können Teams, die schnell kombinieren, ihre Überlebenschancen aktiv verbessern.

### 4.4 Das Strike-System
* Maximal 3 Strikes erlaubt.
* Strike 1 & 2: Warnton, kurzes `"X"`, Abzug von 15 Sekunden.
* Strike 3: Sofortige Detonation!

---

## 📜 5. Handbuch des Bombenexperten (Für die Mitspieler)

> Die Experten sitzen abgewandt mit dem Handbuch. Nur der Entschärfer bedient den micro:bit!

```markdown
# 📋 Das Handbuch des Bombenexperten

## ⚠️ Sicherheitsregeln
1. Berühre die Bombe niemals selbst – nur der Entschärfer vor Ort bedient den micro:bit!
2. Achtung auf das Ticken: Zuerst tickt es alle 10 Sekunden, dann alle 5 Sekunden und unter 20 Sekunden alle 2 Sekunden!
3. Richtige Schritte schenken euch wertvolle Bonuszeit (+15s bis +25s)!
4. Bei 3 Strikes oder Ablauf des Timers explodiert das System.

---

### 1️⃣ Modul 1: Die Tasten-Sicherheitssequenz
* **Anzeige:** Oberste Zeile zeigt den Countdown (10 auf 0, nächstes Pixel blinkt).
* **Aktion:**
  * Verwende **ausschließlich die kombinierte A+B Eingabe**!
  * Drücke **Taste A und Taste B gleichzeitig (A+B)**, um das Sicherheitsrelais zu überbrücken.
  * Ein heller Bestätigungston ertönt und der Zeitbonus (+20s) wird gutgeschrieben!

---

### 2️⃣ Modul 2: Der Erschütterungs- & Schallsensor
* **Anzeige:** Countdown läuft sichtbar weiter.
* **Aktion:**
  1. Halte den micro:bit absolut ruhig – **NICHT schütteln** (Schütteln gibt sofort einen Strike)!
  2. Decke das gesamte 5x5 Display mit der flachen Hand lichtdicht ab.
  3. Während es dunkel ist: Klatsche **einmal kräftig in die Hände**!
  4. Ein Doppelton und ein Zeitzuschlag signalisieren den Erfolg.

---

### 3️⃣ Modul 3: Das Finale (Orientierung & Biometrie)
* **Anzeige:** Countdown nähert sich dem Ende.
* **Aktion:**
  1. Lege den micro:bit flach hin und drehe ihn exakt nach **Norden** (0°).
  2. Sobald die Nord-Richtung stimmt: Halte das **goldene micro:bit Logo** für mindestens **3 Sekunden** fest berührt.
* **Erfolg:** Das Häkchen erscheint, die Siegesfanfare ertönt – BOMB DEFUSED!
```

---

## 💻 6. Technische Software-Architektur (MakeCode TypeScript)

Hier ist die vollständige Implementierung ohne externe Drähte, mit sichtbarem LED-Countdown, gestaffeltem Ticken und Zeit-Bonus pro Schritt:

```typescript
/**
 * BOMB DEFUSAL PUZZLE (MakeCode TypeScript)
 * Komplett autark ohne externe Drähte
 */

// --- Spiel-Zustände ---
let AktuellesLevel = 1      // 1 = Tasten, 2 = Sensoren, 3 = Kompass/Logo, 4 = Defused, 5 = Detonated
let Strikes = 0
const MAX_STRIKES = 3
const MAX_ZEIT = 120        // Maximale Startzeit in Sekunden
let ZeitUebrig = 90         // Aktuelle Restzeit in Sekunden
let SpielGesperrt = false

// Status für Countdown-Blinken
let BlinkZustand = true

// Zeit-Tracking für Ticken
let LetzterTick = 0

// --- Start & Initialisierung ---
function StartSpiel() {
    AktuellesLevel = 1
    Strikes = 0
    ZeitUebrig = 90
    BlinkZustand = true
    SpielGesperrt = false
    LetzterTick = control.millis()
    UpdateDisplay()
}

// --- Sichtbarer Countdown in der obersten Zeile (von 10 auf 0 Pixel) ---
// 10 Stufen auf 5 LEDs: Jede LED entspricht 2 Stufen.
// Voll verbleibende Pixel leuchten dauerhaft, das nächste verschwindende Pixel blinkt.
function UpdateDisplay() {
    if (SpielGesperrt) return

    // Oberste Zeile (y = 0) für den Countdown aktualisieren
    // Zeit proportional auf 10 Stufen (10 auf 0) umrechnen:
    let stufen = Math.clamp(0, 10, Math.ceil((ZeitUebrig / MAX_ZEIT) * 10))

    for (let x = 0; x < 5; x++) {
        let ledIndex = x
        let vollSchwelle = (ledIndex + 1) * 2 // Schwelle für dauerhaft an (2, 4, 6, 8, 10)
        let blinkSchwelle = vollSchwelle - 1   // Schwelle für nächste Stufe (1, 3, 5, 7, 9)

        if (stufen >= vollSchwelle) {
            // Voll verbleibend: dauerhaft AN
            led.plot(x, 0)
        } else if (stufen == blinkSchwelle) {
            // Nächstes Pixel, das verschwinden wird: BLINKT
            if (BlinkZustand) {
                led.plot(x, 0)
            } else {
                led.unplot(x, 0)
            }
        } else {
            // Bereits erloschen: AUS
            led.unplot(x, 0)
        }
    }
}

// --- Zeit-Bonus gutschreiben ---
function AddiereBonuszeit(sekunden: number) {
    ZeitUebrig = Math.min(MAX_ZEIT, ZeitUebrig + sekunden)
    music.playTone(988, 80) // Heller Bestätigungston
    UpdateDisplay()
}

// --- Fehler- / Strike-Behandlung ---
function RegistriereFehler() {
    Strikes++
    music.playTone(200, 300)
    basic.showIcon(IconNames.No)
    basic.pause(400)
    ZeitUebrig = Math.max(3, ZeitUebrig - 15) // Zeitstrafe: -15s
    if (Strikes >= MAX_STRIKES) {
        Detoniere()
    } else {
        UpdateDisplay()
    }
}

// --- Detonation ---
function Detoniere() {
    AktuellesLevel = 5
    SpielGesperrt = true
    music.playTone(130, 800)
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

// --- Hintergrund-Schleife: Timer, Ticken & Countdown-Update (inkl. Blinken) ---
control.inBackground(function () {
    let sekundenZaehlerMs = 0
    while (AktuellesLevel < 4) {
        basic.pause(250) // 250ms Takt für flüssiges Blinken des nächsten Pixels
        sekundenZaehlerMs += 250
        BlinkZustand = !BlinkZustand

        if (sekundenZaehlerMs >= 1000) {
            sekundenZaehlerMs = 0
            ZeitUebrig--

            // Berechne Tick-Intervall abhängig von Restzeit:
            // > 60s  -> alle 10 Sekunden
            // 20-60s -> alle 5 Sekunden
            // < 20s  -> alle 2 Sekunden
            let tickIntervallMs = 10000
            if (ZeitUebrig <= 20) {
                tickIntervallMs = 2000
            } else if (ZeitUebrig <= 60) {
                tickIntervallMs = 5000
            }

            let jetzt = control.millis()
            if (jetzt - LetzterTick >= tickIntervallMs) {
                music.playTone(880, 25)
                LetzterTick = jetzt
            }
        }

        UpdateDisplay()

        if (ZeitUebrig <= 0) {
            Detoniere()
            break
        }
    }
})

// --- Level 1: Nur die kombinierte A+B Eingabe (Button.AB) ---
// Einzelne A- oder B-Eingaben werden nicht verwendet.
input.onButtonPressed(Button.AB, function () {
    if (AktuellesLevel != 1 || SpielGesperrt) return

    // Kombinierte A+B Eingabe löst Level 1 erfolgreich:
    AddiereBonuszeit(20) // Level 1 abgeschlossen: +20s Bonus!
    AktuellesLevel = 2
    basic.showIcon(IconNames.Yes)
    basic.pause(800)
    basic.clearScreen()
    UpdateDisplay()
})

// --- Level 2: Sensoren (Dunkelheit + Lauter Sound, Erschütterungsverbot) ---
input.onGesture(Gesture.Shake, function () {
    if (AktuellesLevel == 2 && !SpielGesperrt) {
        RegistriereFehler() // Bombe darf in Level 2 nicht geschüttelt werden!
    }
})

input.onSound(DetectedSound.Loud, function () {
    if (AktuellesLevel == 2 && !SpielGesperrt) {
        if (input.lightLevel() < 15) {
            // Richtig: Abgedunkelt UND geklatscht!
            AddiereBonuszeit(25) // Level 2 gelöst: +25s!
            AktuellesLevel = 3
            basic.showIcon(IconNames.Yes)
            basic.pause(800)
            UpdateDisplay()
        } else {
            RegistriereFehler()
        }
    }
})

// --- Level 3: Kompass (Nord) + Touch-Logo ---
let logoGedruecktDauer = 0
basic.forever(function () {
    if (AktuellesLevel == 3 && !SpielGesperrt) {
        let heading = input.compassHeading()
        let isNord = (heading < 15 || heading > 345)

        if (isNord && input.logoIsPressed()) {
            logoGedruecktDauer++
            music.playTone(500 + logoGedruecktDauer * 120, 60)
            if (logoGedruecktDauer >= 6) { // ca. 3 Sekunden gehalten
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

* **Zero-Setup & Plug & Play:** Da keine externen Drähte oder Krokodilklemmen benötigt werden, ist das Spiel sofort einsatzbereit, robust und ausfallsicher.
* **Spannungsaufbau durch adaptives Ticken:** Der Übergang von 10s auf 5s und schließlich 2s Taktung erzeugt authentische Escape-Room-Atmosphäre und zwingt die Jugendlichen zur Fokussierung.
* **Transparenz durch sichtbaren Countdown:** Die oberste LED-Zeile mit dem von 10 auf 0 zählenden und blinkenden Pixel vermittelt den Zeitdruck unmittelbar und visuell begreifbar.
* **Positive Verstärkung:** Dass gelöste Schritte wertvolle Bonuszeit zurückgeben, belohnt strukturiertes und ruhiges Vorgehen der Gruppe.
