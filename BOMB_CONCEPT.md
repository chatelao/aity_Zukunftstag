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
  1. *Level 1: Tasten- & Eingabesequenz* – Entschärfungs-Code über On-Board-Buttons eingeben.
  2. *Level 2: Umweltsensoren & Erschütterung* – Vorsichtige Handhabung, Lichtsensor, Sound & ruhige Hand.
  3. *Level 3: Das Finale / Der Entschärfungscode* – Kombination aus Ausrichtung (Kompass) und kapazitiver Logo-Bestätigung.
* **Klarem visuellem & auditivem Feedback:**
  * Die 5x5 LED-Matrix zeigt den **Countdown permanent sichtbar** als dynamischen Füllstandsbalken / Matrix-Timer an.
  * Das **Ticken** passt sich der Dringlichkeit an (zuerst alle 10s, dann 5s und am Schluss alle 2s).
* **Didaktischem Mehrwert:** Spielerisches Erkunden aller Sensoren des micro:bit ohne Aufbau-Aufwand (Plug & Play).

---

## 🔍 2. Übersicht aller micro:bit Möglichkeiten (Hardware & Features)

Der micro:bit bietet vielfältige Ein- und Ausgabemöglichkeiten – komplett ohne externe Verkabelung:

| Kategorie | Sensor / Feature | Verfügbarkeit | Erkennbare Aktionen / Werte | Einsatzmöglichkeit im Bomben-Rätsel |
| :--- | :--- | :--- | :--- | :--- |
| **Tasten / Touch** | **Taste A & B** | v1 & v2 | Gedrückt, Losgelassen, Gleichzeitig gedrückt (A+B) | **Primäre Deaktivierungs-Codes:**<br>• Sequenz-Eingaben (z.B. A ➔ B ➔ A+B)<br>• Quittierung & Entsicherung. |
| | **Touch-Logo** | v2 | Berührt (Touch), Losgelassen, Lang gedrückt | Kapazitiver Fingerabdruck-Sensor / biometrische Freigabe; Not-Aus-Schalter. |
| **Bewegung & Lage** | **Beschleunigungssensor (Accelerometer)** | v1 & v2 | Gesten: Schütteln, Neigen (Links/Rechts, Vor/Zurück), Bildschirm oben/unten (Face Up/Down) | **Erschütterungssensor:**<br>• *Ruhige Hand:* Schütteln oder ruckartiges Bewegen löst Strikes aus!<br>• Lage-Rätsel: Bombe muss vorsichtig gehalten werden. |
| **Orientierung** | **Kompass (Magnetometer)** | v1 & v2 | Magnetische Himmelsrichtung (0–359°) | **Orientierungs-Rätsel:** Bombe muss exakt nach Norden ausgerichtet werden, um das Magnetventil zu blockieren. |
| **Akustik** | **Mikrofon (Sound Sensor)** | v2 | Lautes Geräusch (Loud Sound), Schallpegel (0–255) | **Schallsensor-Zünder:**<br>• Akustischer Impuls: Gezieltes Klatschen zum Überbrücken eines Relais.<br>• *Lärmverbot:* Bei zu lautem Geschrei tickt die Uhr schneller. |
| | **Integrierter Lautsprecher & Summer** | v2 (Speaker), v1 (via Pin 0/Kopfhörer) | Töne, Melodien, Frequenzen, Ticks | • **Dynamisches Ticken:** Zuerst alle 10s, dann alle 5s, am Schluss alle 2s.<br>• Warntöne / Alarmsirene<br>• Detonationsgeräusch vs. Siegesfanfare. |
| **Optik** | **Lichtsensor** | v1 & v2 (über LED-Matrix gemessen) | Helligkeit / Lichtstärke (0–255) | **Optischer Zünder / Lichtschranke:**<br>• Sensor muss abgedunkelt werden (Hand auflegen), um Laserstrahl zu unterbrechen. |
| | **5x5 LED-Display** | v1 & v2 | 25 rote LEDs mit Helligkeitsstufen | • **Sichtbarer Countdown:** LEDs stellen die verbleibende Restzeit dar (z.B. Pixelraster erlischt schrittweise).<br>• Fehleranzeige (Strike-Symbol `X`).<br>• End-Animationen (Totenkopf `Skull` vs. Häkchen `Yes`). |
| **Umwelt** | **Temperatursensor** | v1 & v2 | Chiptemperatur in °C | Optional: Thermische Sperre durch Handwärme. |

---

## 🧩 3. Detailliertes Rätsel- & Level-Design (Das 3-Phasen-Konzept)

Das Spiel besteht aus **3 Sicherheitsstufen (Levels)**, die nacheinander gelöst werden müssen, bevor der Timer abläuft.

```
       [ START: BOMBE AKTIVIERT ]
                   │
                   ▼
  ┌─────────────────────────────────┐
  │   LEVEL 1: Der Tastencode       │ ➔ Sequenz über Taste A, B & A+B eingeben.
  │   (Keine Drähte nötig!)         │   Jeder Treffer gibt Bonuszeit (+15s)!
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

### 3.1 Level 1: Die Tasten-Sicherheitssequenz (Keine Drähte!)
* **Thema:** Deaktivierung der digitalen Steuereinheit über eine festgelegte Tastenkombination am Board.
* **Sichtbarer Countdown & Status:** Das LED-Display zeigt permanent den Countdown als Füllstand (von 25 LEDs abwärts zählend). Kurze Tastendrücke blenden kurz das Tastenfeedback ein.
* **Aufgabe & Mechanik:**
  * Das Team muss anhand des Handbuchs eine 4-teilige Tastensequenz eingeben:
    1. **Taste A**
    2. **Taste B**
    3. **Taste A+B (beide Tasten gleichzeitig)**
    4. **Taste A**
  * **Belohnungs-Mechanik (Zeit-Bonus):** Jeder korrekt eingegebene Schritt addiert **+15 Sekunden** auf die Restzeit und erzeugt einen positiven Quittungston!
  * **Fehler-Logik:** Eine falsche Taste in der Sequenz setzt den Fortschritt zurück und vergibt einen Strike.
* **Erfolgs-Feedback:** Bestätigungsmelodie, **+20 Sekunden Bonus**, automatischer Wechsel zu Level 2.

---

### 3.2 Level 2: Der Erschütterungs- & Umweltsensor
* **Thema:** Der Zünder reagiert hochsensibel auf Licht und Erschütterungen.
* **Sichtbarer Countdown:** Die LED-Matrix zählt weiter sichtbar herunter.
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
* **25-LED-Raster als Zeitbalken:** Die 5x5 LED-Matrix dient als ständiger visueller Countdown.
* Zu Beginn leuchten alle 25 LEDs. Mit fortschreitender Zeit erlöschen die LEDs nacheinander (jede LED entspricht einem proportionalen Zeitanteil).
* **Zeitzugewinn sichtbar:** Wird ein Schritt gelöst und die Restzeit erhöht sich, **schalten sich erloschene LEDs wieder an**! Das Team sieht sofort, wie wertvolle Zeit zurückgewonnen wird.

### 4.2 Das 3-Stufen-Tickintervall
Das akustische Ticken passt sich dynamisch der verbleibenden Restzeit an:
1. **Entspannte Phase (> 60 Sekunden Restzeit):** Ticken ertönt gemächlich **alle 10 Sekunden**.
2. **Kritische Phase (20 bis 60 Sekunden Restzeit):** Ticken beschleunigt sich auf **alle 5 Sekunden**.
3. **Panik-Phase (< 20 Sekunden Restzeit):** Ticken hetzt **alle 2 Sekunden**.

### 4.3 Schrittweiser Zeit-Bonus
* Ein gelöster Teilschritt in Level 1: **+15 Sekunden**
* Abschluss von Level 1: **+20 Sekunden**
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
* **Anzeige:** LEDs zeigen den Countdown.
* **Aktion:**
  Gib am micro:bit nacheinander folgende Tastenkombination ein:
  1. Drücke **Taste A** (ein heller Pieps bestätigt; Zeitbonus wird gutgeschrieben!)
  2. Drücke **Taste B**
  3. Drücke **Taste A und Taste B gleichzeitig (A+B)**
  4. Drücke nochmals **Taste A**
* *Achtung: Eine falsche Taste gibt einen Strike und setzt die Tastenfolge zurück!*

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

// Fortschritt in Level 1 (Tastensequenz: A -> B -> A+B -> A)
let TastenSchritt = 0

// Zeit-Tracking für Ticken
let LetzterTick = 0

// --- Start & Initialisierung ---
function StartSpiel() {
    AktuellesLevel = 1
    Strikes = 0
    ZeitUebrig = 90
    TastenSchritt = 0
    SpielGesperrt = false
    LetzterTick = control.millis()
    UpdateDisplay()
}

// --- Sichtbarer Countdown auf der 5x5 LED-Matrix ---
function UpdateDisplay() {
    if (SpielGesperrt) return
    basic.clearScreen()

    // 25 LEDs repräsentieren den Countdown
    // Zeit proportional auf 25 LEDs umrechnen (max 120s = 25 LEDs)
    let leuchtendeLeds = Math.clamp(0, 25, Math.ceil((ZeitUebrig / MAX_ZEIT) * 25))

    for (let i = 0; i < leuchtendeLeds; i++) {
        let x = i % 5
        let y = Math.floor(i / 5)
        led.plot(x, y)
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

// --- Hintergrund-Schleife: Timer, Ticken & Countdown-Update ---
control.inBackground(function () {
    while (AktuellesLevel < 4) {
        basic.pause(1000)
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

        UpdateDisplay()

        if (ZeitUebrig <= 0) {
            Detoniere()
            break
        }
    }
})

// --- Level 1: Tastensequenz (A -> B -> A+B -> A) ohne externe Drähte ---
input.onButtonPressed(Button.A, function () {
    if (AktuellesLevel != 1 || SpielGesperrt) return

    if (TastenSchritt == 0) {
        TastenSchritt = 1
        AddiereBonuszeit(15) // Schritt 1 gelöst: +15s!
    } else if (TastenSchritt == 3) {
        TastenSchritt = 0
        AddiereBonuszeit(20) // Level 1 abgeschlossen: +20s!
        AktuellesLevel = 2
        basic.showIcon(IconNames.Yes)
        basic.pause(800)
        UpdateDisplay()
    } else {
        TastenSchritt = 0
        RegistriereFehler()
    }
})

input.onButtonPressed(Button.B, function () {
    if (AktuellesLevel != 1 || SpielGesperrt) return

    if (TastenSchritt == 1) {
        TastenSchritt = 2
        AddiereBonuszeit(15) // Schritt 2 gelöst: +15s!
    } else {
        TastenSchritt = 0
        RegistriereFehler()
    }
})

input.onButtonPressed(Button.AB, function () {
    if (AktuellesLevel != 1 || SpielGesperrt) return

    if (TastenSchritt == 2) {
        TastenSchritt = 3
        AddiereBonuszeit(15) // Schritt 3 gelöst: +15s!
    } else {
        TastenSchritt = 0
        RegistriereFehler()
    }
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
* **Transparenz durch sichtbaren Countdown:** Das 5x5 LED-Raster vermittelt den Zeitdruck unmittelbar und visuell begreifbar.
* **Positive Verstärkung:** Dass gelöste Schritte wertvolle Bonuszeit zurückgeben, belohnt strukturiertes und ruhiges Vorgehen der Gruppe.
