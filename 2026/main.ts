function UpdateGraphik () {
    if (SpielGesperrt) {
        return
    }
    // 1. ZEILE 0 (y = 0): Durchgehende Countdown-Linie, rechtestes aktives Pixel blinkt
    vergangeneZeit = input.runningTime() - LevelStartZeit
    restZeit = Math.max(0, LEVEL_DAUER_MS - vergangeneZeit)
    aktivePixelAnzahl = Math.ceil(restZeit / LEVEL_DAUER_MS * 5)
    // Startet bei x = 4 (oben rechts)
    blinkIndex = aktivePixelAnzahl - 1
    // Blink-Takt: 250ms an (255), 250ms dunkel (20)
    blinkAn = Math.idiv(input.runningTime(), 250) % 2 == 0
    for (let x = 0; x <= 4; x++) {
        if (x < blinkIndex) {
            led.plotBrightness(x, 0, 255)
        } else if (x == blinkIndex) {
            led.plotBrightness(x, 0, blinkAn ? 255 : 20)
        } else {
            led.plotBrightness(x, 0, 0)
        }
    }
    for (let y = 1; y <= 4; y++) {
        let helligkeit = ZeilenStatus[y] ? ZeilenHelligkeit[y] : 0
        for (let x2 = 0; x2 <= 4; x2++) {
            led.plotBrightness(x2, y, helligkeit)
        }
    }
}
input.onGesture(Gesture.TiltRight, function () {
    ZeileLoeschen(4, 2)
})
// --- DISKRETE INPUTS LEVEL 1 (Zeile 2 = A, Zeile 3 = B, Zeile 4 = A+B) ---
input.onButtonPressed(Button.A, function () {
    ZeileLoeschen(2, 1)
})
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
function ZeileLoeschen (ZeilenNummer: number, BenoetigtesLevel: number) {
    if (SpielGesperrt || AktuellesLevel != BenoetigtesLevel || ZeilenNummer < 1 || ZeilenNummer > 4) {
        return
    }
    if (ZeilenStatus[ZeilenNummer]) {
        ZeilenStatus[ZeilenNummer] = false
        ZeilenHelligkeit[ZeilenNummer] = 0
        UpdateGraphik()
        music.playTone(523, music.beat(BeatFraction.Sixteenth))
        // Prüfen, ob alle 4 Rätsel-Zeilen (Index 1..4) gelöst sind
        if (!(ZeilenStatus[1]) && !(ZeilenStatus[2]) && !(ZeilenStatus[3]) && !(ZeilenStatus[4])) {
            if (AktuellesLevel == 1) {
                Level1Geschafft()
            } else if (AktuellesLevel == 2) {
                Level2Geschafft()
            }
        }
    }
}
function StarteLevel (level: number) {
    SpielGesperrt = true
    AktuellesLevel = level
    ZeilenStatus = [
    true,
    true,
    true,
    true,
    true
    ]
    ZeilenHelligkeit = [
    255,
    255,
    255,
    255,
    255
    ]
    LogoWarGedrueckt = false
    basic.clearScreen()
    if (level == 2) {
        basic.showString("2")
    }
    LevelStartZeit = input.runningTime()
    SpielGesperrt = false
    UpdateGraphik()
}
// --- DISKRETE INPUTS LEVEL 2 (Gesten für Schütteln & Rechtsneigung) ---
input.onGesture(Gesture.Shake, function () {
    ZeileLoeschen(2, 2)
})
function ZeitAbgelaufen () {
    SpielGesperrt = true
    basic.showIcon(IconNames.No)
    music.playMelody("C5 B A G F E D C ", 200)
    basic.pause(2000)
    StarteLevel(AktuellesLevel)
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
input.onButtonPressed(Button.AB, function () {
    ZeileLoeschen(4, 1)
})
input.onButtonPressed(Button.B, function () {
    ZeileLoeschen(3, 1)
})
/**
 * Globale Variablen
 * 
 * Zeile 0 = Countdown (5 LEDs, das jeweils letzte Pixel rechts blinkt)
 * 
 * Level 1: Zeile 1 = Logo (200ms) | Zeile 2 = Taste A | Zeile 3 = Taste B | Zeile 4 = Tasten A+B
 * 
 * Level 2: Zeile 1 = Schall (>=128) | Zeile 2 = Schütteln (>=2000mg) | Zeile 3 = Abdunkeln (<=20) | Zeile 4 = Kippen rechts (>=700mg)
 */
let tiltX = 0
let light2 = 0
let acc = 0
let sound = 0
let halteDauer = 0
let LogoDruckStart = 0
let LogoWarGedrueckt = false
let AktuellesLevel = 0
let blinkAn = false
let blinkIndex = 0
let aktivePixelAnzahl = 0
let restZeit = 0
let LevelStartZeit = 0
let vergangeneZeit = 0
let SpielGesperrt = false
let LEVEL_DAUER_MS = 0
let ZeilenHelligkeit: number[] = []
let ZeilenStatus: boolean[] = []
// Index 0 = Countdown, Indizes 1..4 = die 4 Rätsel-Linien
ZeilenStatus = [
true,
true,
true,
true,
true
]
ZeilenHelligkeit = [
255,
255,
255,
255,
255
]
// Countdown: 30 Sekunden pro Level (6 Sekunden pro Pixel in Zeile 0)
LEVEL_DAUER_MS = 30000
// Variablen für das analoge Fading beim Berühren des Gesichts (Zeile 1 in Level 1)
let LOGO_FADE_DAUER_MS = 200
// --- Spielstart ---
StarteLevel(1)
// --- Hauptschleife: Countdown-Blinken & Analoge Distanz-Berechnung ---
basic.forever(function () {
    if (!(SpielGesperrt) && (AktuellesLevel == 1 || AktuellesLevel == 2)) {
        // 1. Countdown prüfen
        if (input.runningTime() - LevelStartZeit >= LEVEL_DAUER_MS) {
            ZeitAbgelaufen()
            return
        }
        if (AktuellesLevel == 1) {
            // LEVEL 1: Zeile 1 über Touch auf das Gesicht (Logo) für 200ms
            if (ZeilenStatus[1]) {
                if (input.logoIsPressed()) {
                    if (!(LogoWarGedrueckt)) {
                        LogoWarGedrueckt = true
                        LogoDruckStart = input.runningTime()
                    }
                    halteDauer = input.runningTime() - LogoDruckStart
                    ZeilenHelligkeit[1] = Math.constrain(Math.floor((LOGO_FADE_DAUER_MS - halteDauer) / LOGO_FADE_DAUER_MS * 255), 0, 255)
                    if (halteDauer >= LOGO_FADE_DAUER_MS) {
                        ZeileLoeschen(1, 1)
                        LogoWarGedrueckt = false
                    }
                } else {
                    LogoWarGedrueckt = false
                    ZeilenHelligkeit[1] = 255
                }
            }
        } else if (AktuellesLevel == 2) {
            // LEVEL 2: Analoge Sensoren
            // Zeile 1: Schallsensor (Start 0 -> Ziel >= 128)
            if (ZeilenStatus[1]) {
                sound = input.soundLevel()
                ZeilenHelligkeit[1] = Math.constrain(Math.floor((128 - sound) / 128 * 255), 0, 255)
                if (sound >= 128) {
                    ZeileLoeschen(1, 2)
                }
            }
            // Zeile 2: Beschleunigung / Schütteln (Start ~1000 mg -> Ziel >= 2000 mg)
            if (ZeilenStatus[2]) {
                acc = input.acceleration(Dimension.Strength)
                ZeilenHelligkeit[2] = Math.constrain(Math.floor((2000 - acc) / 1000 * 255), 0, 255)
                if (acc >= 2000) {
                    ZeileLoeschen(2, 2)
                }
            }
            // Zeile 3: Abdunkeln / Lichtsensor (Simulator startet bei 128 -> Ziel <= 20)
            if (ZeilenStatus[3]) {
                light2 = input.lightLevel()
                ZeilenHelligkeit[3] = Math.constrain(Math.floor((light2 - 20) / 108 * 255), 0, 255)
                if (light2 <= 20) {
                    ZeileLoeschen(3, 2)
                }
            }
            // Zeile 4: Neigung nach rechts / X-Achse (Start 0 -> Ziel >= 700 mg)
            if (ZeilenStatus[4]) {
                tiltX = Math.max(0, input.acceleration(Dimension.X))
                ZeilenHelligkeit[4] = Math.constrain(Math.floor((700 - tiltX) / 700 * 255), 0, 255)
                if (tiltX >= 700) {
                    ZeileLoeschen(4, 2)
                }
            }
        }
        UpdateGraphik()
    }
    basic.pause(50)
})
