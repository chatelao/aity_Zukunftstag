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
