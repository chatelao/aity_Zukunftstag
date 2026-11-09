# 💣 Die Lösung: "Die Zeitbombe" (Defuse the Bomb)

> Das Handbuch des Bombenexperten und der "Schummelzettel" zur erfolgreichen Entschärfung der micro:bit Zeitbombe.

---

## ⚠️ Sicherheitsregeln für das Entschärfungs-Team
1. **Rollenverteilung:** Die Experten sitzen mit diesem Handbuch abgewandt vom Gerät. Nur die entschärfende Person bedient den micro:bit!
2. **Keine Kabel nötig:** Das gesamte System arbeitet autark ohne externe Drähte oder Steckbrücken.
3. **Akustisches Dringlichkeits-Ticken:**
   * **> 60 Sekunden Restzeit:** Ticken ertönt alle 10 Sekunden.
   * **20 bis 60 Sekunden Restzeit:** Ticken beschleunigt sich auf alle 5 Sekunden.
   * **< 20 Sekunden Restzeit:** Ticken hetzt alle 2 Sekunden.
4. **Zeit-Boni belohnen Teamwork:** Richtige Schritte schenken euch wertvolle Bonuszeit (+15s bis +25s)!
5. **Strikes & Detonation:**
   * Maximal 2 Strikes werden toleriert (jeder Strike kostet 15 Sekunden Zeitstrafe).
   * Bei **3 Strikes** oder Ablauf des Timers (0 Sekunden) erfolgt die Detonation (**BOOM!**).

---

## 1️⃣ Level 1: Die Tasten-Sicherheitssequenz
* **Anzeige:** 5x5 LED-Matrix zeigt den Countdown als Füllstand (von 25 LEDs abwärts).
* **Aufgabe:** Am micro:bit muss folgende 4-teilige Tastenfolge eingegeben werden:
  1. **Taste A** drücken *(+15s Bonuszeit)*
  2. **Taste B** drücken *(+15s Bonuszeit)*
  3. **Taste A+B** gleichzeitig drücken *(+15s Bonuszeit)*
  4. **Taste A** drücken *(+20s Bonuszeit)*

*Erfolgs-Feedback:* Häkchen (`IconNames.Yes`), Melodie, automatische Weiterschaltung zu Level 2.
*Achtung:* Eine falsche Taste gibt einen Strike und setzt den Fortschritt auf Schritt 0 zurück!

---

## 2️⃣ Level 2: Der Erschütterungs- & Schallsensor
* **Anzeige:** Countdown läuft sichtbar weiter.
* **Aufgabe:**
  1. Den micro:bit absolut ruhig halten – **NICHT schütteln** *(Schütteln erzeugt sofort einen Strike!)*.
  2. Die LED-Matrix vollständig mit der Handfläche lichtdicht abdecken (`Lichtstärke < 15`).
  3. Während es abgedunkelt ist: **Einmal laut in die Hände klatschen**.

*Erfolgs-Feedback:* Häkchen (`IconNames.Yes`), **+25s Bonuszeit**, Übergang zu Level 3.

---

## 3️⃣ Level 3: Das Finale (Orientierung & Biometrie)
* **Anzeige:** Countdown nähert sich dem Ende.
* **Aufgabe:**
  1. Den micro:bit flach auf den Tisch legen und exakt nach **Norden** ausrichten (Magnetkurs zwischen 345° und 15°).
  2. Sobald die Nord-Richtung stimmt: Das goldene **Touch-Logo** für mindestens **3 Sekunden ununterbrochen berührt halten**.

---

## 🏆 Finale: Erfolg vs. Detonation

### 🏆 Entschärft (DEFUSED)
* Großes Häkchen (`IconNames.Yes`), Siegesfanfare und Lauftext `"DEFUSED!"`.
* Der Countdown stoppt, die Bombe ist entschärft!

### 💥 Detonation (BOOM!)
* Ausgelöst bei 3 Strikes oder wenn die Zeit abläuft.
* Totenkopf-Symbol (`IconNames.Skull`), Explosions-Ton und Lauftext `"BOOM!"`.
