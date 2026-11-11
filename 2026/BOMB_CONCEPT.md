# 💣 Spielkonzept: "Die Zeitbombe" (Defuse the Bomb)
> Ein interaktives Rätselspiel für den BBC micro:bit v2 – mit 5 durchgehenden LED-Linien, blinkendem Countdown und analogem Distanz-Fading für den Zukunftstag / MINT-Workshops.

---

## 🎯 1. Übersicht & Spielidee

### 1.1 Das Szenario
Die Teilnehmenden schlüpfen in die Rolle eines Bombenentschärfungs-Teams (angelehnt an das Koop-Konzept von *„Keep Talking and Nobody Explodes“*).
Eine tickende „Zeitbombe“ (micro:bit v2) zeigt nach dem Start **fünf waagrechte, durchgehende Linien** auf dem 5x5-LED-Display.
- **Zeile 0 (ganz oben):** Der 30-Sekunden-Countdown. Das jeweils letzte aktive Pixel rechts **blinkt rhythmisch**, bevor es erlischt.
- **Zeilen 1 bis 4 (darunter):** Vier aktive Sicherheitsleitungen (Rätsel-Schritte). Sobald sich die Spielenden mit dem richtigen Sensor dem Zielwert nähern, **blenden (faden) die Linien stufenlos aus**, bis sie bei Erreichen des Zielwerts mit einem Quittungston komplett erlöschen!

Das gesamte Spiel funktioniert **völlig autark ohne externe Drähte oder Zubehör** – alle Eingaben erfolgen rein über das kapazitive Touch-Logo („Gesicht“), die Tasten A/B, den Licht-, Schall- und Beschleunigungssensor des micro:bit v2!

### 1.2 Aufbau & Ablauf (Das 2-Level-Konzept)
- **Mehrstufiger Ablauf (2 Phasen / Levels à 30 Sekunden):**
  1. *Level 1: Biometrie & Lichtschranke* – Dreifache sequenzielle Freigabe über das **goldene Gesicht (Touch-Logo)** mit Halte-Fading (für die Linien 1, 2 und 3) sowie Unterbrechen der Lichtschranke bzw. Tasten **A / B** (für Linie 4).
  2. *Level 2: Akustik, Kinetik & Lage* – Kombination aus **Schallsensor** (Linie 1), **Schütteln / Beschleunigung** (Linie 2), **Lichtquelle** (Linie 3) und **Rechtsneigung / Logo** (Linie 4).
- **Klares visuelles & auditives Feedback:**
  * **Sichtbarer Countdown in Zeile 0:** 5 LEDs repräsentieren je 6 Sekunden (gesamt 30s pro Level). Das jeweils rechteste aktive Pixel blinkt im 250-ms-Takt.
  * **Analoges Distanz-Fading (Zeilen 1–4):** Alle vier Rätsel-Linien leuchten beim Start voll (`Helligkeit 255`) und werden proportional zur Annäherung an die Lösung dunkler (`0` = gelöst).
  * **Belohnungs-Sequenzen:** Nach Level 1 erscheint das Häkchen und das **Dollar-Symbol (`$`)** mit Melodie; nach Level 2 erscheint der **Pokal (Trophy)** mit großer Siegesfanfare. Läuft die Zeit ab, erscheint das `X`-Symbol und das aktuelle Level startet neu.
- **Didaktischer Mehrwert:** Spielerisches Erkunden aller analogen und digitalen Sensoren des micro:bit ohne Aufbau-Aufwand (Plug & Play).

---

## 🔍 2. Übersicht aller genutzten micro:bit Features (Hardware & Sensor-Mapping)

| Zeile / Funktion | Level 1 (Biometrie & Tasten) | Level 2 (Umwelt & Bewegung) | Analoge Fading-Logik (Helligkeit 255 ➔ 0) |
| :--- | :--- | :--- | :--- |
| **Zeile 0 (Oben)** | **Countdown-Timer (30s)** | **Countdown-Timer (30s)** | 5 Pixel (je 6s). Links dauerhaft an (`255`), das **letzte aktive Pixel rechts blinkt** (`255` ↔ `20`), bis es verschwindet. |
| **Zeile 1** | **Touch-Logo („Gesicht“) – 1. Mal halten** | **Schallsensor (Mikrofon)** | **L1:** 800 ms gedrückt halten fadet Zeile 1 von `255` auf `0`.<br>**L2:** Schallpegel `0..128` fadet Zeile 1 bis zur Auslösung (`>= 128`). |
| **Zeile 2** | **Touch-Logo („Gesicht“) – 2. Mal halten** | **Beschleunigung / Schütteln** | **L1:** Nach kurzem Loslassen erneut 800 ms halten fadet Zeile 2 aus.<br>**L2:** Beschleunigung (`1000..2000 mg` / `Shake`) fadet Zeile 2 aus. |
| **Zeile 3** | **Touch-Logo („Gesicht“) – 3. Mal halten** | **Lichtsensor (Beleuchten)** | **L1:** Nach kurzem Loslassen zum 3. Mal 800 ms halten fadet Zeile 3 aus.<br>**L2:** Helligkeit erhöhen (`128..220`) fadet Zeile 3 aus. |
| **Zeile 4 (Unten)** | **Lichtsensor (Abdunkeln) ODER Taste A / B** | **Neigung nach rechts (`TiltRight`) ODER Logo** | **L1:** Abdunkeln (`128..20`) fadet Zeile 4 sanft aus; Klick auf **A** oder **B** löscht sofort.<br>**L2:** Neigung X-Achse (`0..700 mg`) fadet Zeile 4 aus; `TiltRight` / Logo löscht sofort. |

---

## 🧩 3. Detailliertes Rätsel- & Level-Design (Das 2-Phasen-Konzept)

Das Spiel besteht aus **2 Sicherheitsstufen (Levels)** mit jeweils 4 Sicherungslinien, die innerhalb von 30 Sekunden pro Level gelöst werden müssen.

```text
       [ START: 5 DURCHGEHENDE LINIEN LEUCHTEN ]
       (Zeile 0 = Countdown, rechtes Pixel blinkt)
                          │
                          ▼
  ┌───────────────────────────────────────────────┐
  │ LEVEL 1 (30s): Biometrie & Lichtschranke      │
  │ • Zeilen 1, 2, 3: 3x Gesicht für 0.8s halten  │
  │ • Zeile 4: Abdunkeln (<= 20) oder Taste A / B │
  └───────────────────────────────────────────────┘
                          │ Alle 4 Linien erloschen!
                          │ ➔ Häkchen + Dollar ($) + Melodie
                          ▼
  ┌───────────────────────────────────────────────┐
  │ LEVEL 2 (30s): Umwelt- & Bewegungssensoren    │
  │ • Zeile 1: Laut klatschen / rufen (Sound>=128)│
  │ • Zeile 2: Kräftig schütteln (Acc >= 2000 mg) │
  │ • Zeile 3: Licht auf Display (Light >= 220)   │
  │ • Zeile 4: Nach rechts neigen (X >= 700 mg)   │
  └───────────────────────────────────────────────┘
                          │
            ┌─────────────┴─────────────┐
            ▼                           ▼
   [ 🏆 POKAL & FANFARE ]      [ ❌ ZEIT ABGELAUFEN ]
   (Alle Linien in L2 gelöst)  (Countdown = 0 ➔ Level-Reset)
```

---

### 3.1 Level 1: Biometrie (Gesicht-Touch) & Lichtschranke / Tasten
- **Thema:** Sequenzielle Deaktivierung der oberen drei Sicherheitsrelais über den biometrischen Fingerabdruck-Scanner (Touch-Logo) und Unterbrechung der unteren Lichtschranke.
- **Sichtbarer Countdown & Status:** Zeile 0 zeigt die 5 Countdown-Pixel (30 Sekunden). Das rechteste aktive Pixel blinkt im 250-ms-Rhythmus.
- **Aufgabe & Mechanik:**
  1. **Zeilen 1, 2 und 3 (Touch-Logo / Gesicht):**
     * Der Finger muss auf das **goldene Gesicht (Logo)** gelegt und für **0,8 Sekunden (800 ms)** gehalten werden. Während des Haltens blendet Zeile 1 sichtbar bis auf `0` aus und erlischt mit einem Ton.
     * Danach muss das Gesicht kurz losgelassen und **erneut für 0,8 Sekunden gehalten** werden, um Zeile 2 auszublenden.
     * Nach einem weiteren kurzen Loslassen schaltet das **dritte Halten (0,8 Sekunden)** Zeile 3 aus.
  2. **Zeile 4 (Lichtsensor oder Tasten A / B):**
     * Das Display wird mit der flachen Hand abgedunkelt (`lightLevel <= 20`), wodurch Zeile 4 sanft ausfadet, **oder** es wird direkt **Taste A** bzw. **Taste B** gedrückt.
- **Erfolgs-Feedback:** Häkchen (`IconNames.Yes`), **Dollar-Zeichen (`$`)**, Siegesmelodie und nach 5 Sekunden Pause der Start von Level `"2"`.  ---  ### 3.2 Level 2: Akustik, Kinetik, Optik & Neigung - **Thema:** Vier unterschiedliche physikalische Umgebungssensoren müssen durch Annäherung an ihren jeweiligen Schwellenwert deaktiviert werden. - **Sichtbarer Countdown:** Zeile 0 startet wieder mit 5 Pixeln (30 Sekunden) und blinkendem rechten Randpixel. - **Aufgabe & Mechanik (Reihenfolge frei wählbar):** 1. **Zeile 1 – Akustik-Sicherung (Mikrofon):** Laut klatschen oder rufen. Die Linie wird mit steigendem Schallpegel dunkler und erlischt ab `soundLevel >= 128`. 2. **Zeile 2 – Kinetik-Sicherung (Beschleunigung):** Den micro:bit kräftig **schütteln** (`Gesture.Shake` bzw. Gesamtbeschleunigung `>= 2000 mg`). 3. **Zeile 3 – Optik-Sicherung (Helligkeit):** Das Display ins helle Licht halten oder mit einer Lampe anleuchten (`lightLevel >= 220`). 4. **Zeile 4 – Lage-Sicherung (Neigung / Touch):** Den micro:bit **nach rechts neigen** (`TiltRight` bzw. X-Beschleunigung `>= 700 mg`, Linie fadet beim Neigen sanft aus) oder das **Touch-Logo** drücken. - **Erfolgs-Feedback:** Häkchen (`IconNames.Yes`), **Pokal-Symbol (Trophy)** und große Siegesfanfare!  ---  ## ⏱️ 4. Feedback- und Timer-System  ### 4.1 Der sichtbare LED-Countdown (Zeile 0) - **30 Sekunden pro Level:** Jedes der 5 Pixel in der obersten Zeile (`y = 0`) steht für 6 Sekunden Spielzeit. - **Blinkendes Grenzpixel:** Alle links liegenden Zeit-Pixel leuchten dauerhaft mit voller Kraft (`255`). Das jeweils rechteste aktive Pixel (zu Beginn `x = 4` oben rechts) **blinkt im 250-ms-Takt** zwischen hell (`255`) und gedimmt (`20`), weil es als Nächstes erlischt. - **Zeitablauf (Timeout):** Erreicht der Countdown 0 Sekunden, erscheint ein `X` (`IconNames.No`), eine absteigende Melodie ertönt, und das aktuelle Level startet automatisch neu.  ### 4.2 Kontinuierliches Distanz-Fading (Zeilen 1 bis 4) - Alle ungelösten Zeilen starten als durchgehende waagrechte Linien (alle 5 LEDs der Zeile leuchten mit `255`). - Sobald ein Sensorwert in Richtung des Zielwerts verändert wird, berechnet die Hauptschleife alle `50 ms` die verbleibende Distanz zum Schwellenwert und reduziert die PWM-Helligkeit (`led.plotBrightness`) der gesamten Linie proportional von `255` bis `0`.  ---  ## 📜 5. Handbuch des Bombenexperten (Vorlage für die Mitspieler)  > Die Experten sitzen mit dem Handbuch bereit. Auf dem micro:bit leuchten zu Beginn **5 durchgehende waagrechte Linien**!  ### ⚠️ Grundregeln 1. **Die oberste Linie (Zeile 0) ist eure Zeit (30 Sekunden):** Das jeweils **letzte Pixel rechts blinkt**, weil es als Nächstes erlischt. Sind alle 5 Pixel oben aus, startet das Level neu! 2. **Die 4 Linien darunter (Zeilen 1 bis 4) sind die Sicherungen:** Wenn ihr auf der richtigen Spur seid, **wird die jeweilige Linie immer dunkler (Fading)**, bis sie mit einem Piepton ganz verschwindet!  ---  ### 1️⃣ Level 1: Die Biometrie- & Tasten-Freigabe - **Sicherungen 1, 2 und 3 (Die oberen drei Rätsel-Linien):** * Legt einen Finger auf das **goldene Gesicht (Touch-Logo)** oben in der Mitte und **haltet es für knapp 1 Sekunde (0,8 s) gedrückt**. * Ihr seht live, wie **Linie 1** immer dunkler wird und mit einem Ton erlischt! * **Lasst das Gesicht kurz los** und haltet es **zum 2. Mal gedrückt**, bis **Linie 2** ausgeblendet ist. * **Lasst erneut kurz los** und haltet es **zum 3. Mal gedrückt**, bis auch **Linie 3** erlischt! - **Sicherung 4 (Die unterste Linie):** * Deckt das Display mit der Hand ab (**Abdunkeln** – die Linie fadet mit zunehmender Dunkelheit aus) **ODER** drückt auf **Taste A** bzw. **Taste B**. - **Level-Erfolg:** Es erscheinen das Häkchen und das **Dollar-Zeichen (`$`)**, danach startet Runde `"2"`.

---

### 2️⃣ Level 2: Die Sensor-Kombination (Runde "2")
Wieder leuchten alle 5 durchgehenden Linien, und oben rechts blinkt der neue 30-Sekunden-Countdown!
- **Linie 1 (Akustik-Sicherung):** Macht ein lautes Geräusch oder klatscht in die Hände – je lauter, desto dunkler wird Linie 1, bis sie verschwindet!
- **Linie 2 (Kinetik-Sicherung):** **Schüttelt** den micro:bit kräftig!
- **Linie 3 (Optik-Sicherung):** Bringt **viel Licht** auf das Display (z. B. zur Deckenlampe oder Taschenlampe drehen).
- **Linie 4 (Lage-Sicherung):** **Neigt den micro:bit nach rechts** (je weiter nach rechts geneigt, desto dunkler wird Linie 4) oder berührt das **Gesicht**.
- **Finale:** Sind alle vier Linien gelöscht, erscheint der **Pokal (Trophy)** und die große Siegesfanfare ertönt!

---

## 💻 6. Technische Software-Architektur (MakeCode TypeScript)

```typescript
/**
 * Globale Variablen
 * Zeile 0 = Countdown (5 LEDs, das jeweils letzte Pixel rechts blinkt)
 * Zeilen 1..3 = In Level 1 gesteuert über Touch auf das Gesicht (Logo) mit Halte-Fading
 * Zeile 4 = In Level 1 gesteuert über Lichtsensor / Tasten A & B
 */
let SpielGesperrt = false
let AktuellesLevel = 0

// Index 0 = Countdown, Indizes 1..4 = die 4 Rätsel-Linien
let ZeilenStatus: boolean[] = [true, true, true, true, true]
let ZeilenHelligkeit: number[] = [255, 255, 255, 255, 255]

// Countdown: 30 Sekunden pro Level (6 Sekunden pro Pixel in Zeile 0)
const LEVEL_DAUER_MS = 30000
let LevelStartZeit = 0

// Variablen für das analoge Fading beim Berühren des Gesichts (Zeilen 1, 2, 3)
const LOGO_FADE_DAUER_MS = 800
let LogoDruckStart = 0
let LogoWarGedrueckt = false
let WarteAufLogoLoslassen = false

function StarteLevel (level: number) {
    SpielGesperrt = true
    AktuellesLevel = level
    ZeilenStatus = [true, true, true, true, true]
    ZeilenHelligkeit = [255, 255, 255, 255, 255]
    LogoWarGedrueckt = false
    WarteAufLogoLoslassen = false
    if (level == 2) {
        basic.showString("2")
    }
    LevelStartZeit = input.runningTime()
    SpielGesperrt = false
    UpdateGraphik()
}

function UpdateGraphik () {
    if (SpielGesperrt) {
        return
    }
    basic.clearScreen()

    // 1. ZEILE 0 (y = 0): Durchgehende Countdown-Linie, rechtestes aktives Pixel blinkt
    let vergangeneZeit = input.runningTime() - LevelStartZeit
    let restZeit = Math.max(0, LEVEL_DAUER_MS - vergangeneZeit)
    let aktivePixelAnzahl = Math.ceil((restZeit / LEVEL_DAUER_MS) * 5)
    let blinkIndex = aktivePixelAnzahl - 1 // Startet bei x = 4 (oben rechts)

    // Blink-Takt: 250ms an (255), 250ms dunkel (20)
    let blinkAn = (Math.idiv(input.runningTime(), 250) % 2) == 0

    for (let x = 0; x <= 4; x++) {
        if (x < blinkIndex) {
            led.plotBrightness(x, 0, 255)
        } else if (x == blinkIndex) {
            led.plotBrightness(x, 0, blinkAn ? 255 : 20)
        }
    }

    // 2. ZEILEN 1..4 (y = 1..4): Vier durchgehende waagrechte Linien
    for (let y = 1; y <= 4; y++) {
        if (ZeilenStatus[y]) {
            for (let x = 0; x <= 4; x++) {
                led.plotBrightness(x, y, ZeilenHelligkeit[y])
            }
        }
    }
}

function ZeileLoeschen (ZeilenNummer: number, BenoetigtesLevel: number) {
    if (SpielGesperrt || AktuellesLevel != BenoetigtesLevel || ZeilenNummer < 1 || ZeilenNummer > 4) {
        return
    }
    if (ZeilenStatus[ZeilenNummer]) {
        ZeilenStatus[ZeilenNummer] = false
        ZeilenHelligkeit[ZeilenNummer] = 0
        music.playTone(523, music.beat(BeatFraction.Sixteenth))
        UpdateGraphik()

        // Prüfen, ob alle 4 Rätsel-Zeilen (Index 1..4) gelöst sind
        if (!ZeilenStatus[1] && !ZeilenStatus[2] && !ZeilenStatus[3] && !ZeilenStatus[4]) {
            if (AktuellesLevel == 1) {
                Level1Geschafft()
            } else if (AktuellesLevel == 2) {
                Level2Geschafft()
            }
        }
    }
}

// Hilfsfunktion: Findet die nächste aktive Zeile aus 1, 2, 3 für den Gesicht-Touch
function NaechsteLogoZeile (): number {
    for (let z = 1; z <= 3; z++) {
        if (ZeilenStatus[z]) {
            return z
        }
    }
    return -1
}

function ZeitAbgelaufen () {
    SpielGesperrt = true
    basic.showIcon(IconNames.No)
    music.playMelody("C5 B A G F E D C ", 200)
    basic.pause(2000)
    StarteLevel(AktuellesLevel)
}

function Level1Geschafft () {
    SpielGesperrt = true
    basic.showIcon(IconNames.Yes)
    basic.pause(2000)
    basic.showLeds(`
        . # # # .
        # . # . .
        . # # # .
        . . # . #
        . # # # .
        `)
    music.playMelody("E G B C5 - - - - ", 300)
    basic.pause(5000)
    StarteLevel(2)
}

function Level2Geschafft () {
    SpielGesperrt = true
    AktuellesLevel = 3
    basic.showIcon(IconNames.Yes)
    basic.pause(1000)
    basic.showLeds(`
        # # # # #
        . # # # .
        . . # . .
        . # # # .
        # # # # #
        `)
    music.playMelody("G C5 E C5 G C5 E C5 ", 180)
}

// --- DISKRETE INPUTS LEVEL 1 (Tasten A & B für Zeile 4) ---
input.onButtonPressed(Button.A, function () {
    ZeileLoeschen(4, 1)
})
input.onButtonPressed(Button.B, function () {
    ZeileLoeschen(4, 1)
})

// --- DISKRETE INPUTS LEVEL 2 (Gesten & Logo) ---
input.onGesture(Gesture.Shake, function () {
    ZeileLoeschen(2, 2)
})
input.onGesture(Gesture.TiltRight, function () {
    ZeileLoeschen(4, 2)
})
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    if (AktuellesLevel == 2) {
        ZeileLoeschen(4, 2)
    }
})

// --- Spielstart ---
StarteLevel(1)

// --- Hauptschleife: Countdown-Blinken & Analoge Distanz-Berechnung ---
basic.forever(function () {
    if (!SpielGesperrt && (AktuellesLevel == 1 || AktuellesLevel == 2)) {
        // 1. Countdown prüfen
        if (input.runningTime() - LevelStartZeit >= LEVEL_DAUER_MS) {
            ZeitAbgelaufen()
            return
        }

        if (AktuellesLevel == 1) {
            // LEVEL 1: Zeilen 1, 2, 3 über Touch auf das Gesicht (Logo)
            let aktiveLogoZeile = NaechsteLogoZeile()
            if (aktiveLogoZeile != -1) {
                if (input.logoIsPressed()) {
                    if (!WarteAufLogoLoslassen) {
                        if (!LogoWarGedrueckt) {
                            LogoWarGedrueckt = true
                            LogoDruckStart = input.runningTime()
                        }
                        let halteDauer = input.runningTime() - LogoDruckStart
                        ZeilenHelligkeit[aktiveLogoZeile] = Math.constrain(
                            Math.floor(((LOGO_FADE_DAUER_MS - halteDauer) / LOGO_FADE_DAUER_MS) * 255),
                            0,
                            255
                        )
                        if (halteDauer >= LOGO_FADE_DAUER_MS) {
                            ZeileLoeschen(aktiveLogoZeile, 1)
                            WarteAufLogoLoslassen = true
                            LogoWarGedrueckt = false
                        }
                    }
                } else {
                    LogoWarGedrueckt = false
                    WarteAufLogoLoslassen = false
                    if (ZeilenStatus[aktiveLogoZeile]) {
                        ZeilenHelligkeit[aktiveLogoZeile] = 255
                    }
                }
            }

            // Zeile 4: Lichtsensor (Ziel <= 20, oder Taste A/B drücken)
            if (ZeilenStatus[4]) {
                let light1 = input.lightLevel()
                ZeilenHelligkeit[4] = Math.constrain(Math.floor(((light1 - 20) / 108) * 255), 0, 255)
                if (light1 <= 20) ZeileLoeschen(4, 1)
            }
        } else if (AktuellesLevel == 2) {
            // LEVEL 2: Analoge Sensoren
            // Zeile 1: Schallsensor (Ziel >= 128)
            if (ZeilenStatus[1]) {
                let sound = input.soundLevel()
                ZeilenHelligkeit[1] = Math.constrain(Math.floor(((128 - sound) / 128) * 255), 0, 255)
                if (sound >= 128) ZeileLoeschen(1, 2)
            }
            // Zeile 2: Beschleunigung / Schütteln (Ziel >= 2000 mg)
            if (ZeilenStatus[2]) {
                let acc = input.acceleration(Dimension.Strength)
                ZeilenHelligkeit[2] = Math.constrain(Math.floor(((2000 - acc) / 1000) * 255), 0, 255)
                if (acc >= 2000) ZeileLoeschen(2, 2)
            }
            // Zeile 3: Lichtstärke erhöhen (Ziel >= 220)
            if (ZeilenStatus[3]) {
                let light2 = input.lightLevel()
                ZeilenHelligkeit[3] = Math.constrain(Math.floor(((220 - light2) / 92) * 255), 0, 255)
                if (light2 >= 220) ZeileLoeschen(3, 2)
            }
            // Zeile 4: Neigung nach rechts / X-Achse (Ziel >= 700 mg oder Logo drücken)
            if (ZeilenStatus[4]) {
                let tiltX = Math.max(0, input.acceleration(Dimension.X))
                ZeilenHelligkeit[4] = Math.constrain(Math.floor(((700 - tiltX) / 700) * 255), 0, 255)
                if (tiltX >= 700) ZeileLoeschen(4, 2)
            }
        }

        UpdateGraphik()
    }
    basic.pause(50)
})
```

---

## 🚀 7. Didaktischer Mehrwert & Workshop-Einsatz

- **Zero-Setup & Plug & Play:** Da keine externen Drähte oder Krokodilklemmen benötigt werden, ist das Spiel sofort einsatzbereit, robust und ausfallsicher.
- **Unmittelbares Sensor-Feedback durch PWM-Fading:** Die Jugendlichen erleben analoge Messwerte (Lichtstärke, Schallpegel, Beschleunigung, Zeitdauer) direkt visuell über die Helligkeitsstufen (`0..255`) der vier waagrechten LED-Linien.
- **Transparenz durch sichtbaren Countdown:** Die oberste LED-Zeile mit dem blinkenden rechten Grenzpixel vermittelt den 30-Sekunden-Zeitdruck pro Level unmittelbar und intuitiv.
- **Frustfreier Workshop-Ablauf:** Durch den Verzicht auf den kalibrierungspflichtigen Kompass und den automatischen Neustart des aktuellen Levels bei Zeitablauf bleibt der Spielfluss jederzeit erhalten.
