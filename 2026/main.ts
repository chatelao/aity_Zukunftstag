/**
 * Globale Variablen
 */
let SpielGesperrt = false
let AktuellesLevel = 0
let ZeilenStatus: boolean[] = [true, true, true, true, true]
let HelligkeitZeile0 = 255
let HelligkeitZeile2 = 255

function UpdateGraphik () {
    basic.clearScreen()
    if (AktuellesLevel == 1) {
        // LEVEL 1: Binaere Fortschrittsanzeige (3, 5, 7, 9)
        if (ZeilenStatus[0]) {
            // 3 = 00011 (P0)
            led.plot(3, 0)
            led.plot(4, 0)
        }
        if (ZeilenStatus[1]) {
            // 5 = 00101 (P1)
            led.plot(2, 1)
            led.plot(4, 1)
        }
        if (ZeilenStatus[2]) {
            // 7 = 00111 (P2)
            led.plot(2, 2)
            led.plot(3, 2)
            led.plot(4, 2)
        }
        if (ZeilenStatus[3]) {
            // 9 = 01001 (Taste A)
            led.plot(1, 3)
            led.plot(4, 3)
        }
        if (ZeilenStatus[4]) {
            // Taste B
            led.plot(0, 4)
            led.plot(1, 4)
            led.plot(2, 4)
        }
    } else if (AktuellesLevel == 2) {
        // LEVEL 2: Hohles Logo (Nur Punkte/Kontur)
        if (ZeilenStatus[0]) {
            // Zeile 0: Schallsensor (fade bis 0 / geloest)
            led.plotBrightness(0, 0, HelligkeitZeile0)
            led.plotBrightness(2, 0, HelligkeitZeile0)
        }
        // Lücke in der Mitte
        if (ZeilenStatus[1]) {
            // Zeile 1: Schütteln
            led.plot(1, 1)
            led.plot(3, 1)
        }
        if (ZeilenStatus[2]) {
            // Zeile 2: Ausrichtung / Orientierung / Licht (fade bis 0 / geloest)
            led.plotBrightness(2, 2, HelligkeitZeile2)
            led.plotBrightness(4, 2, HelligkeitZeile2)
        }
        if (ZeilenStatus[3]) {
            // Zeile 3: Rechts
            led.plot(1, 3)
            led.plot(3, 3)
        }
        if (ZeilenStatus[4]) {
            // Zeile 4: Kopfueber / Logo
            led.plot(0, 4)
            led.plot(2, 4)
        }
    }
}

// --- Kern-Logik ---
function ZeileLoeschen (ZeilenNummer: number, BenioetigtesLevel: number) {
    // Eingabe nur verarbeiten, wenn wir im richtigen Level sind und keine Animation läuft
    if (SpielGesperrt || AktuellesLevel != BenioetigtesLevel) {
        return
    }
    // Wenn die Zeile noch da ist, löschen
    if (ZeilenStatus[ZeilenNummer] == true) {
        ZeilenStatus[ZeilenNummer] = false
        if (ZeilenNummer == 0) {
            HelligkeitZeile0 = 0
        } else if (ZeilenNummer == 2) {
            HelligkeitZeile2 = 0
        }
        // Sound-Feedback
        music.playTone(523, music.beat(BeatFraction.Sixteenth))
        UpdateGraphik()
        // Prüfen, ob ALLE Zeilen gelöscht sind
        if (!(ZeilenStatus.indexOf(true) >= 0)) {
            if (AktuellesLevel == 1) {
                Level1Geschafft()
            } else if (AktuellesLevel == 2) {
                Level2Geschafft()
            }
        }
    }
}

// --- INPUTS LEVEL 1 (Pins & Buttons) ---
input.onPinPressed(TouchPin.P0, function () {
    ZeileLoeschen(0, 1)
})
input.onPinPressed(TouchPin.P1, function () {
    ZeileLoeschen(1, 1)
})
input.onPinPressed(TouchPin.P2, function () {
    ZeileLoeschen(2, 1)
})
input.onButtonPressed(Button.A, function () {
    ZeileLoeschen(3, 1)
})
input.onButtonPressed(Button.B, function () {
    ZeileLoeschen(4, 1)
})

function Level1Geschafft () {
    SpielGesperrt = true
    // Gutzeichen
    basic.showIcon(IconNames.Yes)
    basic.pause(2000)
    // Das Dollarzeichen ($)
    basic.showLeds(`
        . # # # .
        # . # . .
        . # # # .
        . . # . #
        . # # # .
        `)
    music.playMelody("E G B C5 - - - - ", 300)
    // 5 Sekunden warten vor Runde 2
    basic.pause(5000)
    // Reset für Level 2
    AktuellesLevel = 2
    ZeilenStatus = [
        true,
        true,
        true,
        true,
        true
    ]
    HelligkeitZeile0 = 255
    HelligkeitZeile2 = 255
    // Alle Zeilen wieder an
    SpielGesperrt = false
    // Start-Animation für Level 2
    basic.showString("2")
    UpdateGraphik()
}

// --- INPUTS LEVEL 2 (Sensoren & Gesten) ---
input.onGesture(Gesture.Shake, function () {
    ZeileLoeschen(1, 2)
})
input.onSound(DetectedSound.Loud, function () {
    ZeileLoeschen(0, 2)
})
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    ZeileLoeschen(4, 2)
})

function Level2Geschafft () {
    SpielGesperrt = true
    AktuellesLevel = 3
    // Spiel vorbei
    // Gutzeichen
    basic.showIcon(IconNames.Yes)
    basic.pause(1000)
    // Der POKAL (Trophy)
    basic.showLeds(`
        # # # # #
        . # # # .
        . . # . .
        . # # # .
        # # # # #
        `)
    // Große Siegesfanfare
    music.playMelody("G C5 E C5 G C5 E C5 ", 180)
}

// 1 = Erstes Spiel (Solid Logo), 2 = Zweites Spiel (Hohles Logo), 3 = Ende
AktuellesLevel = 1
UpdateGraphik()

// Periodische Ueberpruefung und kontinuierliches Helligkeits-Fading fuer analoge Raetsel
basic.forever(function () {
    if (AktuellesLevel == 2 && !SpielGesperrt) {
        let updateNoetig = false

        // 1. Analoger Schallsensor (Zeile 0)
        if (ZeilenStatus[0]) {
            let sound = input.soundLevel()
            // Schwellenwert fuer lauten Ton ist ca. 128
            let neueHelligkeit0 = Math.clamp(0, 255, Math.floor(255 - (sound / 128) * 255))
            if (neueHelligkeit0 < HelligkeitZeile0) {
                HelligkeitZeile0 = neueHelligkeit0
                updateNoetig = true
            }
            if (sound >= 128 || HelligkeitZeile0 <= 0) {
                ZeileLoeschen(0, 2)
            }
        }

        // 2. Analoge Orientierung / Kompass & Lichtsensor (Zeile 2)
        if (ZeilenStatus[2]) {
            let heading = input.compassHeading()
            let diffKompass = Math.min(heading, 360 - heading)
            // Je naeher an 0 Grad (Nord), desto dunkler
            let helligkeitKompass = Math.clamp(0, 255, Math.floor((diffKompass / 90) * 255))

            let light = input.lightLevel()
            // Je dunkler (Licht abdecken), desto dunkler
            let helligkeitLicht = Math.clamp(0, 255, Math.floor((light / 100) * 255))

            // Kombination aus beiden analogen Bedingungen (minimaler Helligkeitswert)
            let zielHelligkeit2 = Math.min(helligkeitKompass, helligkeitLicht)
            if (zielHelligkeit2 != HelligkeitZeile2) {
                HelligkeitZeile2 = zielHelligkeit2
                updateNoetig = true
            }

            if (diffKompass < 10 || light < 10 || HelligkeitZeile2 <= 0) {
                ZeileLoeschen(2, 2)
            }
        }

        if (updateNoetig) {
            UpdateGraphik()
        }
    }
    basic.pause(50)
})
