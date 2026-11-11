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
                        // Fading proportional zur Haltedauer bis LOGO_FADE_DAUER_MS (800ms)
                        ZeilenHelligkeit[aktiveLogoZeile] = Math.constrain(
                            Math.floor(((LOGO_FADE_DAUER_MS - halteDauer) / LOGO_FADE_DAUER_MS) * 255),
                            0,
                            255
                        )
                        if (halteDauer >= LOGO_FADE_DAUER_MS) {
                            ZeileLoeschen(aktiveLogoZeile, 1)
                            // Erzwingt kurzes Loslassen vor der nächsten Linie (1 -> 2 -> 3)
                            WarteAufLogoLoslassen = true
                            LogoWarGedrueckt = false
                        }
                    }
                } else {
                    // Gesicht losgelassen -> Falls noch nicht gelöst, Helligkeit wieder auf 255 und bereit für nächste Zeile
                    LogoWarGedrueckt = false
                    WarteAufLogoLoslassen = false
                    if (ZeilenStatus[aktiveLogoZeile]) {
                        ZeilenHelligkeit[aktiveLogoZeile] = 255
                    }
                }
            }

            // Zeile 4: Lichtsensor (Simulator startet bei 128 -> Ziel <= 20, oder Taste A/B drücken)
            if (ZeilenStatus[4]) {
                let light1 = input.lightLevel()
                ZeilenHelligkeit[4] = Math.constrain(Math.floor(((light1 - 20) / 108) * 255), 0, 255)
                if (light1 <= 20) ZeileLoeschen(4, 1)
            }
        } else if (AktuellesLevel == 2) {
            // LEVEL 2: Analoge Sensoren
            // Zeile 1: Schallsensor (Start 0 -> Ziel >= 128)
            if (ZeilenStatus[1]) {
                let sound = input.soundLevel()
                ZeilenHelligkeit[1] = Math.constrain(Math.floor(((128 - sound) / 128) * 255), 0, 255)
                if (sound >= 128) ZeileLoeschen(1, 2)
            }
            // Zeile 2: Beschleunigung / Schütteln (Start ~1000 mg -> Ziel >= 2000 mg)
            if (ZeilenStatus[2]) {
                let acc = input.acceleration(Dimension.Strength)
                ZeilenHelligkeit[2] = Math.constrain(Math.floor(((2000 - acc) / 1000) * 255), 0, 255)
                if (acc >= 2000) ZeileLoeschen(2, 2)
            }
            // Zeile 3: Lichtstärke erhöhen (Start 128 -> Ziel >= 220)
            if (ZeilenStatus[3]) {
                let light2 = input.lightLevel()
                ZeilenHelligkeit[3] = Math.constrain(Math.floor(((220 - light2) / 92) * 255), 0, 255)
                if (light2 >= 220) ZeileLoeschen(3, 2)
            }
            // Zeile 4: Neigung nach rechts / X-Achse (Start 0 -> Ziel >= 700 mg oder Logo drücken)
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
