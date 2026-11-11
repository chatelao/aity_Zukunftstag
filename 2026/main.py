"""
Globale Variablen
"""
# Speichert, welche der 5 Zeilen sichtbar sind (True = an, False = gelöscht)
ZeilenStatus = [True, True, True, True, True]

# 1 = Erstes Spiel (Solid Logo), 2 = Zweites Spiel (Hohles Logo), 3 = Ende
AktuellesLevel = 1
SpielGesperrt = False # Verhindert Eingaben während Animationen
HelligkeitZeile0 = 255
HelligkeitZeile2 = 255

# --- Kern-Logik ---

def ZeileLoeschen(ZeilenNummer: number, BenioetigtesLevel: number):
    global AktuellesLevel, SpielGesperrt, HelligkeitZeile0, HelligkeitZeile2

    # Eingabe nur verarbeiten, wenn wir im richtigen Level sind und keine Animation läuft
    if SpielGesperrt or AktuellesLevel != BenioetigtesLevel:
        return

    # Wenn die Zeile noch da ist, löschen
    if ZeilenStatus[ZeilenNummer] == True:
        ZeilenStatus[ZeilenNummer] = False
        if ZeilenNummer == 0:
            HelligkeitZeile0 = 0
        elif ZeilenNummer == 2:
            HelligkeitZeile2 = 0

        # Sound-Feedback
        music.play_tone(Note.C5, music.beat(BeatFraction.SIXTEENTH))

        UpdateGraphik()

        # Prüfen, ob ALLE Zeilen gelöscht sind
        if not (True in ZeilenStatus):
            if AktuellesLevel == 1:
                Level1Geschafft()
            elif AktuellesLevel == 2:
                Level2Geschafft()

def UpdateGraphik():
    basic.clear_screen()

    if AktuellesLevel == 1:
        # LEVEL 1: Binaere Fortschrittsanzeige (3, 5, 7, 9)
        if ZeilenStatus[0]: # 3 = 00011 (P0)
            led.plot(3, 0); led.plot(4, 0)
        if ZeilenStatus[1]: # 5 = 00101 (P1)
            led.plot(2, 1); led.plot(4, 1)
        if ZeilenStatus[2]: # 7 = 00111 (P2)
            led.plot(2, 2); led.plot(3, 2); led.plot(4, 2)
        if ZeilenStatus[3]: # 9 = 01001 (Taste A)
            led.plot(1, 3); led.plot(4, 3)
        if ZeilenStatus[4]: # Taste B
            led.plot(0, 4); led.plot(1, 4); led.plot(2, 4)

    elif AktuellesLevel == 2:
        # LEVEL 2: Hohles Logo (Nur Punkte/Kontur)
        if ZeilenStatus[0]: # Schallsensor (fade bis 0 / gelöst)
            led.plot_brightness(0, 0, HelligkeitZeile0)
            led.plot_brightness(2, 0, HelligkeitZeile0)
        if ZeilenStatus[1]: # Schütteln
            led.plot(1, 1); led.plot(3, 1)
        if ZeilenStatus[2]: # Ausrichtung / Orientierung / Licht (fade bis 0 / gelöst)
            led.plot_brightness(2, 2, HelligkeitZeile2)
            led.plot_brightness(4, 2, HelligkeitZeile2)
        if ZeilenStatus[3]: # Rechts
            led.plot(1, 3); led.plot(3, 3)
        if ZeilenStatus[4]: # Kopfueber / Logo
            led.plot(0, 4); led.plot(2, 4)

def Level1Geschafft():
    global SpielGesperrt, AktuellesLevel, ZeilenStatus, HelligkeitZeile0, HelligkeitZeile2
    SpielGesperrt = True

    # Gutzeichen
    basic.show_icon(IconNames.YES)
    basic.pause(2000)

    # Das Dollarzeichen ($)
    basic.show_leds("""
        . # # # .
        # . # . .
        . # # # .
        . . # . #
        . # # # .
        """)
    music.play_melody("E G B C5 - - - -", 300)

    # 5 Sekunden warten vor Runde 2
    basic.pause(5000)

    # Reset für Level 2
    AktuellesLevel = 2
    ZeilenStatus = [True, True, True, True, True] # Alle Zeilen wieder an
    HelligkeitZeile0 = 255
    HelligkeitZeile2 = 255
    SpielGesperrt = False

    # Start-Animation für Level 2
    basic.show_string("2")
    UpdateGraphik()

def Level2Geschafft():
    global SpielGesperrt, AktuellesLevel
    SpielGesperrt = True
    AktuellesLevel = 3 # Spiel vorbei

    # Gutzeichen
    basic.show_icon(IconNames.YES)
    basic.pause(1000)

    # Der POKAL (Trophy)
    basic.show_leds("""
        # # # # #
        . # # # .
        . . # . .
        . # # # .
        # # # # #
        """)
    # Große Siegesfanfare
    music.play_melody("G C5 E C5 G C5 E C5", 180)

# --- INPUTS LEVEL 1 (Pins & Buttons) ---

def on_pin_pressed_p0():
    ZeileLoeschen(0, 1) # Nur wirksam in Level 1
input.on_pin_pressed(TouchPin.P0, on_pin_pressed_p0)

def on_pin_pressed_p1():
    ZeileLoeschen(1, 1)
input.on_pin_pressed(TouchPin.P1, on_pin_pressed_p1)

def on_pin_pressed_p2():
    ZeileLoeschen(2, 1)
input.on_pin_pressed(TouchPin.P2, on_pin_pressed_p2)

def on_button_pressed_a():
    ZeileLoeschen(3, 1)
input.on_button_pressed(Button.A, on_button_pressed_a)

def on_button_pressed_b():
    ZeileLoeschen(4, 1)
input.on_button_pressed(Button.B, on_button_pressed_b)


# --- INPUTS LEVEL 2 (Sensoren & Gesten) ---

# 1. Zeile: Schallsensor
def on_sound_loud():
    ZeileLoeschen(0, 2)
input.on_sound(DetectedSound.LOUD, on_sound_loud)

# 2. Zeile: Schütteln
def on_gesture_shake():
    ZeileLoeschen(1, 2) # Nur wirksam in Level 2
input.on_gesture(Gesture.SHAKE, on_gesture_shake)

# 4. Zeile: Nach Rechts neigen
def on_gesture_tilt_right():
    ZeileLoeschen(3, 2)
input.on_gesture(Gesture.TILT_RIGHT, on_gesture_tilt_right)

# 5. Zeile: Logo / Kopfstand
def on_logo_event_pressed():
    ZeileLoeschen(4, 2)
input.on_logo_event(TouchButtonEvent.PRESSED, on_logo_event_pressed)

# --- Start ---
UpdateGraphik()

# Periodische Überprüfung und kontinuierliches Helligkeits-Fading für analoge Rätsel
def on_forever():
    global HelligkeitZeile0, HelligkeitZeile2
    if AktuellesLevel == 2 and not SpielGesperrt:
        update_noetig = False

        # 1. Analoger Schallsensor (Zeile 0)
        if ZeilenStatus[0]:
            sound = input.sound_level()
            neue_helligkeit0 = Math.constrain(Math.floor(255 - (sound / 128) * 255), 0, 255)
            if neue_helligkeit0 < HelligkeitZeile0:
                HelligkeitZeile0 = neue_helligkeit0
                update_noetig = True
            if sound >= 128 or HelligkeitZeile0 <= 0:
                ZeileLoeschen(0, 2)

        # 2. Analoge Orientierung / Kompass & Lichtsensor (Zeile 2)
        if ZeilenStatus[2]:
            heading = input.compass_heading()
            diff_kompass = min(heading, 360 - heading)
            helligkeit_kompass = Math.constrain(Math.floor((diff_kompass / 90) * 255), 0, 255)

            light = input.light_level()
            helligkeit_licht = Math.constrain(Math.floor((light / 100) * 255), 0, 255)

            ziel_helligkeit2 = min(helligkeit_kompass, helligkeit_licht)
            if ziel_helligkeit2 != HelligkeitZeile2:
                HelligkeitZeile2 = ziel_helligkeit2
                update_noetig = True

            if diff_kompass < 10 or light < 10 or HelligkeitZeile2 <= 0:
                ZeileLoeschen(2, 2)

        if update_noetig:
            UpdateGraphik()
    basic.pause(50)

basic.forever(on_forever)
