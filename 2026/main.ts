/**
 * Globale Variablen
 * Zeile 0 = Countdown
 * Zeilen 1..4 = Rätsel 3 (00011), 5 (00101), 7 (00111), 9 (01001)
 */
let SpielGesperrt = false
let AktuellesLevel = 0

// Index 0 wird für den Countdown reserviert, Indizes 1..4 sind die 4 Rätsel (3, 5, 7, 9)
let ZeilenStatus: boolean[] = [true, true, true, true, true]
let ZeilenHelligkeit: number[] = [255, 255, 255, 255, 255]

// Countdown-Parameter (z.B. 30 Sekunden pro Level)
const LEVEL_DAUER_MS = 30000
let LevelStartZeit = 0

function StarteLevel (level: number) {
    SpielGesperrt = true
    AktuellesLevel = level
    ZeilenStatus = [true, true, true, true, true]
    ZeilenHelligkeit = [255, 255, 255, 255, 255]
    if (level == 2) {
        basic.showString("2")
    }
    LevelStartZeit = input.runningTime()
    SpielGesperrt = false
    UpdateGraphik()
}

function ZeichneZeilenMuster (y: number, muster: number, helligkeit: number) {
    // Zeichnet ein 5-Bit-Binärmuster (z.B. 3, 5, 7, 9) in Zeile y mit gegebener Helligkeit
    for (let x = 0; x <= 4; x++) {
        let bitPos = 4 - x
        if ((muster & (1 << bitPos)) != 0) {
            led.plotBrightness(x, y, helligkeit)
        }
    }
}

function UpdateGraphik () {
    if (SpielGesperrt) {
        return
    }
    basic.clearScreen()

    // 1. ZEILE 0 (y = 0): Countdown-Anzeige (5 LEDs entsprechen 100% Zeit)
    let vergangeneZeit = input.runningTime() - LevelStartZeit
    let restFaktor = Math.constrain(1 - vergangeneZeit / LEVEL_DAUER_MS, 0, 1)
    let exakteLeds = restFaktor * 5
    for (let x = 0; x <= 4; x++) {
        let ledAnteil = Math.constrain(exakteLeds - x, 0, 1)
        led.plotBrightness(x, 0, Math.floor(ledAnteil * 255))
    }

    // 2. ZEILEN 1..4 (y = 1..4): Die 4 Rätsel mit den Binärmustern 3, 5, 7, 9
    // y=1 -> 3 (00011), y=2 -> 5 (00101), y=3 -> 7 (00111), y=4 -> 9 (01001)
    const muster = [0, 3, 5, 7, 9]
    for (let y = 1; y <= 4; y++) {
        if (ZeilenStatus[y]) {
            ZeichneZeilenMuster(y, muster[y], ZeilenHelligkeit[y])
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

function ZeitAbgelaufen () {
    SpielGesperrt = true
    basic.showIcon(IconNames.Skull)
    music.playMelody("C5 B A G F E D C ", 200)
    basic.pause(2000)
    // Aktuelles Level neu starten
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

// --- DISKRETE FALLBACK-INPUTS LEVEL 1 (Buttons für Zeile 4 / Wert 9) ---
input.onButtonPressed(Button.A, function () {
    ZeileLoeschen(4, 1)
})
input.onButtonPressed(Button.B, function () {
    ZeileLoeschen(4, 1)
})

// --- Spielstart ---
StarteLevel(1)

// --- Hauptschleife: Countdown & Analoge Distanz-Berechnung ---
basic.forever(function () {
    if (!SpielGesperrt && (AktuellesLevel == 1 || AktuellesLevel == 2)) {
        // 1. Countdown prüfen
        if (input.runningTime() - LevelStartZeit >= LEVEL_DAUER_MS) {
            ZeitAbgelaufen()
            return
        }

        if (AktuellesLevel == 1) {
            // LEVEL 1: Analoge Widerstandsmessung an P0, P1, P2 (Ruhewert ~1023, Berührung sinkt Richtung 0)
            // Zeile 1 (Muster 3): Pin P0 (Ziel < 400)
            if (ZeilenStatus[1]) {
                let p0 = pins.analogReadPin(AnalogPin.P0)
                ZeilenHelligkeit[1] = Math.constrain(Math.floor(((p0 - 400) / 600) * 255), 0, 255)
                if (p0 <= 400) ZeileLoeschen(1, 1)
            }
            // Zeile 2 (Muster 5): Pin P1 (Ziel < 400)
            if (ZeilenStatus[2]) {
                let p1 = pins.analogReadPin(AnalogPin.P1)
                ZeilenHelligkeit[2] = Math.constrain(Math.floor(((p1 - 400) / 600) * 255), 0, 255)
                if (p1 <= 400) ZeileLoeschen(2, 1)
            }
            // Zeile 3 (Muster 7): Pin P2 (Ziel < 400)
            if (ZeilenStatus[3]) {
                let p2 = pins.analogReadPin(AnalogPin.P2)
                ZeilenHelligkeit[3] = Math.constrain(Math.floor(((p2 - 400) / 600) * 255), 0, 255)
                if (p2 <= 400) ZeileLoeschen(3, 1)
            }
            // Zeile 4 (Muster 9): Lichtsensor / Hand annähern vor Tastendruck A/B (Ziel < 20)
            if (ZeilenStatus[4]) {
                let light1 = input.lightLevel()
                ZeilenHelligkeit[4] = Math.constrain(Math.floor(((light1 - 20) / 100) * 255), 0, 255)
                if (light1 <= 20) ZeileLoeschen(4, 1)
            }
        } else if (AktuellesLevel == 2) {
            // LEVEL 2: Analoge Umgebungssensoren mit Distanz-Fading für alle 4 Zeilen (3, 5, 7, 9)
            // Zeile 1 (Muster 3): Schallsensor (Ziel >= 128)
            if (ZeilenStatus[1]) {
                let sound = input.soundLevel()
                ZeilenHelligkeit[1] = Math.constrain(Math.floor(((128 - sound) / 128) * 255), 0, 255)
                if (sound >= 128) ZeileLoeschen(1, 2)
            }
            // Zeile 2 (Muster 5): Gesamtbeschleunigung / Schüttel-Annäherung (Ruhe ~1000 mg, Ziel >= 2000 mg)
            if (ZeilenStatus[2]) {
                let acc = input.acceleration(Dimension.Strength)
                ZeilenHelligkeit[2] = Math.constrain(Math.floor(((2000 - acc) / 1000) * 255), 0, 255)
                if (acc >= 2000) ZeileLoeschen(2, 2)
            }
            // Zeile 3 (Muster 7): Lichtstärke abdunkeln (Ziel <= 15)
            if (ZeilenStatus[3]) {
                let light2 = input.lightLevel()
                ZeilenHelligkeit[3] = Math.constrain(Math.floor(((light2 - 15) / 100) * 255), 0, 255)
                if (light2 <= 15) ZeileLoeschen(3, 2)
            }
            // Zeile 4 (Muster 9): Neigung nach rechts / X-Beschleunigung (Ziel >= 700 mg)
            if (ZeilenStatus[4]) {
                let tiltX = input.acceleration(Dimension.X)
                ZeilenHelligkeit[4] = Math.constrain(Math.floor(((700 - tiltX) / 700) * 255), 0, 255)
                if (tiltX >= 700) ZeileLoeschen(4, 2)
            }
        }

        UpdateGraphik()
    }
    basic.pause(50)
})
