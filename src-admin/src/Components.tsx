// @ts-nocheck
import React from 'react';

var DEMAND_INFO_TRANSLATIONS = {
    en: {
        funcTitle:   'How it works',
        funcText:    'Demand control adjusts the air conditioner based on outdoor temperature (weather-compensated control). ' +
                     'A higher demand value means more heating output. The control logic runs inside the adapter. ' +
                     'The function is designed and tested for use with the Faikout AutoControl function active (thermostat mode disabled). ' +
                     'Other operating modes may work in principle but are insufficiently tested for the adapter demand control.',
        curveTitle:  'Base curve',
        curveText:   'Maps outdoor temperature to a base demand value. Points are linearly interpolated; outside the defined range the edge value is held. ' +
                     'Min. and max. demand additionally limit the output range. The base curve must be determined and adjusted individually per room.',
        boostTitle:  'Boost',
        boostText:   'Increases demand step by step when room temperature falls below the setpoint (autot). ' +
                     'Each stage defines a deviation in Kelvin and the corresponding increase in percentage points.',
        taperTitle:  'Taper',
        taperText:   'Reduces demand when room temperature exceeds the setpoint. ' +
                     'The reduction grows linearly up to the configured maximum (max. taper %) when the guard threshold is reached.',
        guardTitle:  'Guard',
        guardText:   'Switches the heatback mode when the room is significantly too warm. ' +
                     'ON threshold: room >= autot + autor + 0.1 K. OFF threshold: room <= autot. ' +
                     'In guard mode a higher heatback value is sent to put the unit into an enhanced standby and prevent further overheating. ' +
                     'Ideally the unit should already be running at minimum modulation (e.g. via taper) before guard activates.',
        holdTitle:   'Demand changes (hold times)',
        holdText:    'After a demand change the next change in the same direction is delayed until the configured hold time has elapsed. ' +
                     'Decrease (default: 0 s) and increase (default: 300 s) are configurable separately. ' +
                     'Calculation is event-triggered, at most once per 60 seconds and at least every 180 seconds.',
        sensorTitle: 'Sensors',
        sensorText:  'Outdoor temperature: state ID providing outdoor temperature in °C (default: {device}.outside). ' +
                     'Room temperature: state ID providing room temperature in °C (default: {device}.env). ' +
                     'If left empty the device default state is used. ' +
                     'In multi-split groups all devices share the same outdoor sensor. ' +
                     'Changing the outdoor sensor for one device automatically updates all other devices in the group.',
        msTitle:     'Multi-split',
        msText:      'Multiple indoor units on one outdoor unit can be grouped in the Devices tab (groups A-E). ' +
                     'Demand control calculates independently per indoor unit with its own room temperature, curve and boost/taper. ' +
                     'The floor for the sent demand is the highest minimum demand of all devices in the group. ' +
                     'This prevents the outdoor unit from being throttled too much while another indoor unit still needs heating output.',
        ovTitle:     'Manual override',
        ovText:      'Override bypasses the base curve, boost and taper calculation and sends a fixed demand value directly. ' +
                     'Set state {device}.demand_ctrl.override_active to true, then {device}.demand_ctrl.override_value is used as demand. ' +
                     'Guard remains active during override. ' +
                     'The Schedule tab provides actions "Demand manual ON" (with configurable value 0-100%) and "Demand manual OFF" ' +
                     'to activate or deactivate the override on a schedule.',
        noDevice:    'No device activated - enable checkbox in Devices tab',
    },
    de: {
        funcTitle:   'Funktionsprinzip',
        funcText:    'Die Bedarfsregelung steuert die Klimaanlage anhand der Außentemperatur (Witterungsführung). ' +
                     'Ein höherer Demand-Wert bedeutet mehr Heizleistung. Die Regelung läuft im Adapter. ' +
                     'Die Funktion ist ausgelegt und getestet für den Betrieb mit aktiver AutoControl-Funktion des Faikout (Thermostatmodus deaktiviert). ' +
                     'Andere Betriebsverfahren können grundsätzlich funktionieren, sind jedoch für die Bedarfsregelung im Adapter unzureichend getestet.',
        curveTitle:  'Basiskennlinie',
        curveText:   'Ordnet der Außentemperatur einen Basis-Demand-Wert zu. Stützpunkte werden linear interpoliert; außerhalb der Stützpunkte wird der Randwert gehalten. ' +
                     'Min. und Max. Bedarf begrenzen den Ausgabebereich zusätzlich. Die Stützpunkte bzw. Basiskennlinie ist individuell für den Raum zu bestimmen und anzupassen.',
        boostTitle:  'Boost',
        boostText:   'Erhöht den Demand stufenweise wenn die Raumtemperatur unter den Sollwert (autot) fällt. ' +
                     'Jede Stufe definiert eine Abweichung in Kelvin und den zugehörigen Aufschlag in Prozentpunkten.',
        taperTitle:  'Taper',
        taperText:   'Reduziert den Demand wenn die Raumtemperatur den Sollwert überschreitet. ' +
                     'Die Absenkung wächst linear bis zum konfigurierten Maximum (Max. Taper %) bei Erreichen der Guard-Schwelle.',
        guardTitle:  'Guard',
        guardText:   'Schaltet den Heatback-Modus um wenn der Raum deutlich zu warm ist. ' +
                     'Schwelle EIN: Raum >= autot + autor + 0,1 K. Schwelle AUS: Raum <= autot. ' +
                     'Im Guard-Modus wird ein höherer Heatback-Wert gesendet um die Anlage in den verstärkten Ruhemodus zu versetzen und weiteres Überhitzen zu verhindern. ' +
                     'Idealerweise sollte die Anlage vorher in ihrer minimalen Modulationsfähigkeit gelaufen sein, z.B. durch den Taper.',
        holdTitle:   'Bedarfsänderung (Haltezeiten)',
        holdText:    'Nach einer Demand-Änderung wird die nächste Änderung in dieselbe Richtung erst nach Ablauf der konfigurierten Haltezeit durchgeführt. ' +
                     'Absenkung (Standard: 0 s) und Anhebung (Standard: 300 s) sind getrennt einstellbar. ' +
                     'Die Berechnung erfolgt event-getriggert, maximal einmal pro 60 Sekunden und spätestens alle 180 Sekunden.',
        sensorTitle: 'Sensoren',
        sensorText:  'Außentemperatur: Datenpunkt der die Außentemperatur in °C liefert (Standard: {Gerät}.outside). ' +
                     'Raumtemperatur: Datenpunkt der die Raumtemperatur in °C liefert (Standard: {Gerät}.env). ' +
                     'Bleibt das Feld leer, wird der Standard-Datenpunkt des jeweiligen Geräts verwendet. ' +
                     'Bei Multisplit-Gruppen teilen sich alle Geräte der Gruppe denselben Außensensor. ' +
                     'Wird der Außensensor bei einem Gerät geändert, wird die Auswahl automatisch auf alle anderen Geräte der Gruppe übertragen.',
        msTitle:     'Multisplit',
        msText:      'Mehrere Innengeräte an einem Außengerät lassen sich im Geräte-Tab zu einer Gruppe (A-E) zusammenfassen. ' +
                     'Die Bedarfsregelung rechnet für jedes Innengerät unabhängig mit eigener Raumtemperatur, eigener Kennlinie und eigenem Boost/Taper. ' +
                     'Als Untergrenze für den gesendeten Demand gilt der höchste Mindest-Demand aller Geräte in der Gruppe. ' +
                     'Dadurch wird verhindert, dass das Außengerät zu stark gedrosselt wird, solange ein anderes Innengerät noch Heizleistung braucht.',
        ovTitle:     'Manueller Override',
        ovText:      'Der Override ermöglicht es, die Berechnung der Basiskennlinie, Boost und Taper zu umgehen und einen festen Demand-Wert direkt zu senden. ' +
                     'Datenpunkt {Gerät}.demand_ctrl.override_active auf true setzen, dann wird {Gerät}.demand_ctrl.override_value direkt als Demand verwendet. ' +
                     'Guard bleibt dabei weiterhin aktiv. ' +
                     'Im Zeitplan-Tab stehen die Aktionen "Demand manuell Ein" (mit konfigurierbarem Wert 0-100 %) und "Demand manuell Aus" zur Verfügung.',
        noDevice:    'Kein Gerät aktiviert - Checkbox im Geräte-Tab setzen',
    }
};

var HUM_INFO_TRANSLATIONS = {
    en: {
        whatTitle:   'What is Humidity Control?',
        whatText:    'Humidity control protects against mould by monitoring the dew point margin. ' +
                     'If the margin between room temperature and dew point falls below a configured threshold the unit is switched to drying mode (DRY) automatically.',
        sensorTitle: 'Sensors',
        sensorText:  'A BLE sensor on the Faikout device provides room temperature and humidity directly. ' +
                     'Alternatively external states (e.g. Zigbee sensor) can be configured. ' +
                     'If left empty the default BLE state of the device is used ({device}.ble.temp / {device}.ble.hum).',
        dryTitle:    'DRY mode',
        dryText:     'When triggered the unit runs in D-mode (dehumidification) with automatic fan speed. ' +
                     'After DRY operation a configurable fan run-on follows to dry the heat exchanger. ' +
                     'Then the control returns to monitoring mode.',
        thrTitle:    'Thresholds',
        thrText:     'Delta DP-ON: DRY starts when dew point margin (room temp - dew point) <= this value, or humidity >= max. humidity. ' +
                     'Delta DP-OFF: DRY stops when dew point margin >= this value and humidity < max. humidity. ' +
                     'Typical values: delta DP-ON = 4 K, delta DP-OFF = 7 K.',
        windowTitle: 'Time window',
        windowText:  'DRY operation only within the configured time window. ' +
                     'A running DRY cycle outside the window is ended with run-on.',
        motorTitle:  'Motor protection',
        motorText:   'Maximum DRY runtime limits continuous operation. ' +
                     'After reaching the maximum runtime a run-on follows, then a forced pause. ' +
                     'DRY operation is not re-enabled until the pause has elapsed.',
        freshTitle:  'Freshness',
        freshText:   'Sensor data must be current within the configured time window. ' +
                     'Stale data stops DRY operation (with run-on) and disables the automation ' +
                     'until the user re-enables it manually.',
        noDevice:    'No device activated - enable checkbox in Devices tab',
    },
    de: {
        whatTitle:   'Was ist Feuchte-Regelung?',
        whatText:    'Die Feuchte-Regelung schützt vor Schimmelbildung durch Überwachung des Taupunktabstands. ' +
                     'Unterschreitet der Abstand zwischen Raumtemperatur und Taupunkt einen konfigurierten Schwellwert, ' +
                     'wird die Anlage automatisch in den Trocknungsmodus (DRY) geschaltet.',
        sensorTitle: 'Sensoren',
        sensorText:  'Ein BLE-Sensor am Faikout-Gerät liefert Raumtemperatur und Luftfeuchte direkt. ' +
                     'Alternativ können externe Datenpunkte (z.B. Zigbee-Sensor) konfiguriert werden. ' +
                     'Bleibt das Feld leer, wird der Standard-BLE-Datenpunkt des jeweiligen Geräts verwendet ({Gerät}.ble.temp / {Gerät}.ble.hum).',
        dryTitle:    'DRY-Modus',
        dryText:     'Bei Auslösung läuft die Anlage im D-Modus (Trocknen) mit automatischer Lüftergeschwindigkeit. ' +
                     'Nach dem DRY-Betrieb folgt ein konfigurierbarer Lüfter-Nachlauf, um den Wärmetauscher zu trocknen. ' +
                     'Danach kehrt die Regelung in den Überwachungsmodus zurück.',
        thrTitle:    'Schwellen',
        thrText:     'Delta TP-Ein: DRY startet wenn Taupunktabstand (Raumtemp - Taupunkt) <= diesem Wert, oder Feuchte >= Max. Feuchte. ' +
                     'Delta TP-Aus: DRY stoppt wenn Taupunktabstand >= diesem Wert und Feuchte < Max. Feuchte. ' +
                     'Typische Werte: Delta TP-Ein = 4 K, Delta TP-Aus = 7 K.',
        windowTitle: 'Zeitfenster',
        windowText:  'DRY-Betrieb nur innerhalb des konfigurierten Zeitfensters. ' +
                     'Außerhalb des Fensters wird ein laufender DRY-Betrieb mit Nachlauf beendet.',
        motorTitle:  'Motorschutz',
        motorText:   'Maximale DRY-Laufzeit begrenzt den Dauerbetrieb. ' +
                     'Nach Erreichen der Maximalzeit folgt ein Nachlauf und anschließend eine Zwangspause. ' +
                     'Erst nach Ablauf der Pause wird der DRY-Betrieb wieder freigegeben.',
        freshTitle:  'Freshness',
        freshText:   'Sensordaten müssen innerhalb des konfigurierten Zeitfensters aktuell sein. ' +
                     'Veraltete Daten führen zum Stopp des DRY-Betriebs (mit Nachlauf) und zur Deaktivierung der Automatik ' +
                     'bis der Benutzer sie manuell wieder aktiviert.',
        noDevice:    'Kein Gerät aktiviert - Checkbox im Geräte-Tab setzen',
    }
};

// Module-level language cache – populated once via socket on first render
var _detectedLang: string | null = null;
var _langWaiters: Array<(l: string) => void> = [];

function _detectLangFromSocket(socket: unknown): void {
    if (_detectedLang !== null) return;
    try {
        var s = socket as Record<string, unknown>;
        var p = typeof s.getObject === 'function' ? (s.getObject as (id: string) => Promise<Record<string, unknown>>)('system.config') : null;
        if (p && typeof p.then === 'function') {
            p.then(function (obj: Record<string, unknown>) {
                var common = obj && (obj.common as Record<string, unknown>);
                var l = (common && typeof common.language === 'string' ? common.language : '') || 'en';
                _detectedLang = l.startsWith('de') ? 'de' : 'en';
                _langWaiters.forEach(function (cb) { try { cb(_detectedLang as string); } catch (e) {} });
                _langWaiters = [];
            }).catch(function () { _detectedLang = 'en'; });
        }
    } catch (e) { /* socket not ready */ }
}

function getLang(props: unknown): string {
    if (_detectedLang) return _detectedLang;
    var p = props as Record<string, unknown>;
    if (p && p.socket) _detectLangFromSocket(p.socket);
    var sysConfig = p && (p.systemConfig as Record<string, unknown>);
    var common = sysConfig && (sysConfig.common as Record<string, unknown>);
    var lang = (common && typeof common.language === 'string' ? common.language : '')
        || (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).systemLang as string)
        || 'en';
    return (typeof lang === 'string' && lang.startsWith('de')) ? 'de' : 'en';
}

var CHART_TR = {
    en: { minPoints: 'At least 2 support points required for preview', legendBase: 'Base curve', legendBoost: 'Boost', legendEffective: 'Effective' },
    de: { minPoints: 'Mindestens 2 Stützpunkte für Vorschau erforderlich', legendBase: 'Basiskennlinie', legendBoost: 'Boost', legendEffective: 'Effektiv' }
};

var TAPER_TR = {
    en: { waiting: 'Waiting for device values (autot, autor)\u2026', chartLabel: 'Room temperature \u2192 taper reduction (%)' },
    de: { waiting: 'Warte auf Gerätewerte (autot, autor)\u2026', chartLabel: 'Raumtemperatur \u2192 Taper-Reduktion (%)' }
};

var GUARD_TR = {
    en: {
        noDevice:   'Select a device to show guard status.',
        setpoint:   'Setpoint (autot)',
        hysteresis: 'Hysteresis (autor)',
        threshOn:   'Guard threshold ON',
        threshOff:  'Guard threshold OFF',
        roomTemp:   'Room temperature',
        active:     'ACTIVE',
        inactive:   'INACTIVE',
        label:      'Guard'
    },
    de: {
        noDevice:   'Gerät auswählen um Guard-Status anzuzeigen.',
        setpoint:   'Sollwert (autot)',
        hysteresis: 'Hysterese (autor)',
        threshOn:   'Guard-Schwelle-Ein',
        threshOff:  'Guard-Schwelle-Aus',
        roomTemp:   'Raumtemperatur',
        active:     'AKTIV',
        inactive:   'INAKTIV',
        label:      'Guard'
    }
};

var DEMAND_DETAIL_TR = {
    en: {
        enableCheckbox:  'Enable demand control (heating mode only)',
        msGroup:         'Multi-split \u2013 Group ',
        singleSplit:     'Single-Split',
        limitsHeading:   'Demand limits',
        minDemand:       'Min. demand (%)',
        maxDemand:       'Max. demand (%)',
        changesHeading:  'Demand changes',
        holdDecrease:    'Hold time decrease (s)',
        holdIncrease:    'Hold time increase (s)',
        sensorsHeading:  'Sensors',
        outdoorLabel:    'Outdoor temperature (empty = ',
        enterToCheck:    'Enter to check',
        groupSync:       'Group "{g}" \u2013 synced across all devices in this group',
        roomLabel:       'Room temperature (empty = ',
        outdoorTempCol:  'Outdoor temp (\u00b0C)',
        demandCol:       'Demand (%)',
        addPoint:        '+ Support point',
        deviationCol:    'Deviation >= (K)',
        boostCol:        'Boost (+%)',
        addStage:        '+ Stage',
        logHeading:      'Log output',
        logLevel:        'Log level',
        logOff:          'Off (system messages only)',
        logBasic:        'Basic (per step, min. every 3 min.)',
        logExtended:     'Extended (per step with base/boost/taper/guard, min. every 3 min.)',
        curveHeading:    'Base curve \u2013 weather compensation (outdoor temp \u2192 demand)',
        boostHeading:    'Boost',
        boostEnable:     'Enable boost (room below setpoint)',
        taperHeading:    'Taper',
        taperEnable:     'Enable taper',
        taperDesc:       'Room above setpoint \u2192 reduce demand linearly. Maximum at guard threshold (autot + hysteresis + 0.1 \u00b0C).',
        maxTaper:        'Max. taper (%)',
        guardHeading:    'Guard (overheat protection)',
        guardEnable:     'Enable guard',
        guardDesc:       'Guard ON: room >= setpoint + hysteresis + 0.1\u00b0C \u2192 heatback switches. Guard OFF: room <= setpoint \u2192 heatback normal.',
        hbNormal:        'Heatback normal (\u00b0C)',
        hbGuard:         'Heatback guard (\u00b0C)',
        noDevice:        'No device activated \u2013 enable checkbox in Devices tab'
    },
    de: {
        enableCheckbox:  'Bedarfsregelung aktivieren (nur Heizmodus)',
        msGroup:         'Multisplit \u2013 Gruppe ',
        singleSplit:     'Single-Split',
        limitsHeading:   'Bedarfsgrenzen',
        minDemand:       'Min. Bedarf (%)',
        maxDemand:       'Max. Bedarf (%)',
        changesHeading:  'Bedarfs\u00e4nderung',
        holdDecrease:    'Haltezeit Absenkung (s)',
        holdIncrease:    'Haltezeit Anhebung (s)',
        sensorsHeading:  'Sensoren',
        outdoorLabel:    'Au\u00dfentemperatur (leer = ',
        enterToCheck:    'Enter zum Pr\u00fcfen',
        groupSync:       'Gruppe "{g}" \u2013 wird f\u00fcr alle Ger\u00e4te dieser Gruppe synchronisiert',
        roomLabel:       'Raumtemperatur (leer = ',
        outdoorTempCol:  'Au\u00dfentemp (\u00b0C)',
        demandCol:       'Bedarf (%)',
        addPoint:        '+ St\u00fctzpunkt',
        deviationCol:    'Abweichung >= (K)',
        boostCol:        'Boost (+%)',
        addStage:        '+ Stufe',
        logHeading:      'Log-Ausgabe',
        logLevel:        'Log-Level',
        logOff:          'Aus (nur Systemmeldungen)',
        logBasic:        'Basis (je Schritt, mind. alle 3 Min.)',
        logExtended:     'Erweitert (je Schritt mit Basis/Boost/Taper/Guard, mind. alle 3 Min.)',
        curveHeading:    'Basiskennlinie \u2013 Witterungsf\u00fchrung (Au\u00dfentemperatur \u2192 Bedarf)',
        boostHeading:    'Boost',
        boostEnable:     'Boost aktivieren (Raum unter Sollwert)',
        taperHeading:    'Taper',
        taperEnable:     'Taper aktivieren',
        taperDesc:       'Raum \u00fcber Sollwert \u2192 Bedarf linear reduzieren. Maximum bei Guard-Schwelle (autot + Hysterese + 0,1 \u00b0C).',
        maxTaper:        'Max. Taper (%)',
        guardHeading:    'Guard (\u00dcberhitzschutz)',
        guardEnable:     'Guard aktivieren',
        guardDesc:       'Guard EIN: Raum >= Sollwert + Hysterese + 0,1\u00b0C \u2192 heatback wechselt. Guard AUS: Raum <= Sollwert \u2192 heatback normal.',
        hbNormal:        'Heatback normal (\u00b0C)',
        hbGuard:         'Heatback Guard (\u00b0C)',
        noDevice:        'Kein Ger\u00e4t aktiviert \u2013 Checkbox im Ger\u00e4te-Tab setzen'
    }
};

var ENV_TR = {
    en: {
        deviceCol:    'Device',
        sensorCol:    'Sensor state',
        intervalCol:  'Interval',
        devicePh:     '\u2013 Device \u2013',
        sensorPh:     'e.g. zigbee.0.00158d0001.temperature',
        enterToCheck: 'Enter to check',
        addEntry:     '+ Add entry',
        hint:         'The Faikout device expects a new value within 300 seconds \u2013 at longer intervals the external sensor is discarded. Directly paired BLE sensors must not be forwarded additionally.'
    },
    de: {
        deviceCol:    'Ger\u00e4t',
        sensorCol:    'Sensor-Datenpunkt',
        intervalCol:  'Intervall',
        devicePh:     '\u2013 Ger\u00e4t \u2013',
        sensorPh:     'z.B. zigbee.0.00158d0001.temperature',
        enterToCheck: 'Enter zum Pr\u00fcfen',
        addEntry:     '+ Eintrag hinzuf\u00fcgen',
        hint:         'Der Faikout-Sensor erwartet innerhalb von 300 Sekunden einen neuen Wert \u2013 bei l\u00e4ngeren Intervallen wird der externe Sensor verworfen. Direkt gekoppelte BLE-Sensoren sind nicht zus\u00e4tzlich an das Faikout zu \u00fcbermitteln.'
    }
};

var SCHED_TR = {
    en: {
        devicePh:    '\u2013 Device \u2013',
        days:        ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        on:          'On',
        off:         'Off',
        pause:       'Pause:',
        addAction:   '+ Action',
        addTask:     '+ Add task',
        modesTitle:  'Modes',
        modeNewPh:   'New mode name...',
        modeActive:  'active',
        modeInactive:'inactive',
        modeAddBtn:  'Add',
        modePh:      '\u2013 Mode \u2013',
        fieldLabels: {
            power:                'Power',
            fan:                  'Fan',
            econo:                'ECONO',
            swingh:               'SwingH',
            swingv:               'SwingV',
            comfort:              'Comfort',
            powerful:             'Powerful',
            autot:                'Setpoint',
            demand_override_on:   'Demand manual ON',
            demand_override_off:  'Demand manual OFF'
        }
    },
    de: {
        devicePh:    '\u2013 Ger\u00e4t \u2013',
        days:        ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
        on:          'An',
        off:         'Aus',
        pause:       'Pause:',
        addAction:   '+ Aktion',
        addTask:     '+ Aufgabe hinzuf\u00fcgen',
        modesTitle:  'Modi',
        modeNewPh:   'Neuer Modusname...',
        modeActive:  'aktiv',
        modeInactive:'inaktiv',
        modeAddBtn:  'Hinzuf\u00fcgen',
        modePh:      '\u2013 Modus \u2013',
        fieldLabels: {
            power:                'Power',
            fan:                  'L\u00fcfter',
            econo:                'ECONO',
            swingh:               'SwingH',
            swingv:               'SwingV',
            comfort:              'Comfort',
            powerful:             'Powerful',
            autot:                'Sollwert',
            demand_override_on:   'Demand manuell Ein',
            demand_override_off:  'Demand manuell Aus'
        }
    }
};

var HUM_DETAIL_TR = {
    en: {
        autoLabel:      'Auto',
        modeLabel:      'Mode',
        dpMarginLabel:  'Dew point margin',
        dpLabel:        'Dew point',
        sensorsHeading: 'Sensors',
        tempSensor:     'Temperature sensor',
        tempCard:       'Temperature',
        humSensor:      'Humidity sensor',
        humCard:        'Humidity',
        thrHeading:     'Thresholds',
        tpOn:           '\u0394 DP-ON (\u00b0C)',
        tpOff:          '\u0394 DP-OFF (\u00b0C)',
        maxHum:         'Max. rel. humidity (%)',
        windowHeading:  'Time window',
        windowFrom:     'Active from',
        windowTo:       'Active until',
        runtimeHeading: 'Runtimes',
        maxRuntime:     'Max. DRY runtime (min)',
        runOn:          'Run-on (min)',
        forcedPause:    'Forced pause (min)',
        freshTimeout:   'Freshness timeout (min)',
        noDevice:       'No device activated \u2013 enable checkbox in Devices tab',
        emptyHint:      'empty = ',
        modeMap:        { 'AUS': 'OFF', 'ÜBERWACHUNG': 'MONITORING', 'DRY': 'DRY', 'NACHLAUF': 'RUNDOWN', 'PAUSE': 'PAUSE', 'FRESHNESS!': 'FRESHNESS!' }
    },
    de: {
        autoLabel:      'Automatik',
        modeLabel:      'Modus',
        dpMarginLabel:  'Taupunktabstand',
        dpLabel:        'Taupunkt',
        sensorsHeading: 'Sensoren',
        tempSensor:     'Temperatur-Sensor',
        tempCard:       'Temperatur',
        humSensor:      'Feuchte-Sensor',
        humCard:        'Feuchte',
        thrHeading:     'Schwellen',
        tpOn:           '\u0394 TP-Ein (\u00b0C)',
        tpOff:          '\u0394 TP-Aus (\u00b0C)',
        maxHum:         'Max. rel. Feuchte (%)',
        windowHeading:  'Zeitfenster',
        windowFrom:     'Betrieb ab',
        windowTo:       'Betrieb bis',
        runtimeHeading: 'Laufzeiten',
        maxRuntime:     'Max. DRY-Laufzeit (min)',
        runOn:          'Nachlauf (min)',
        forcedPause:    'Zwangspause (min)',
        freshTimeout:   'Freshness-Timeout (min)',
        noDevice:       'Kein Ger\u00e4t aktiviert \u2013 Checkbox im Ger\u00e4te-Tab setzen',
        emptyHint:      'leer = ',
        modeMap:        { 'AUS': 'AUS', 'ÜBERWACHUNG': 'ÜBERWACHUNG', 'DRY': 'DRY', 'NACHLAUF': 'NACHLAUF', 'PAUSE': 'PAUSE', 'FRESHNESS!': 'FRESHNESS!' }
    }
};

function DemandChart(props) {
    var trC = CHART_TR[props.lang || (props.lang || (typeof window !== 'undefined' && window.systemLang === 'de' ? 'de' : 'en'))];
    var data = props.data || {};
    var workPoint = props.workPoint || null; // { temp: number, demand: number } | null
    var curve = Array.isArray(data.demandCurve) ? data.demandCurve : [];
    var boostEnabled = !!data.demandBoostEnabled;
    var boostStages = Array.isArray(data.demandBoostStages) ? data.demandBoostStages : [];
    var minDemand = data.demandMinDemand != null ? Number(data.demandMinDemand) : 0;
    var maxDemand = data.demandMaxDemand != null ? Number(data.demandMaxDemand) : 100;

    var sorted = curve
        .map(function (p) { return { temp: Number(p.temp), demand: Number(p.demand) }; })
        .filter(function (p) { return !isNaN(p.temp) && !isNaN(p.demand); })
        .sort(function (a, b) { return a.temp - b.temp; });

    if (sorted.length < 2) {
        return React.createElement('div', {
            style: { padding: '8px 0', color: '#888', fontStyle: 'italic', fontSize: '12px' }
        }, CHART_TR[props.lang || (typeof window !== 'undefined' && window.systemLang === 'de' ? 'de' : 'en')].minPoints);
    }

    var W = 420, H = 180;
    var pad = { top: 12, right: 20, bottom: 32, left: 40 };
    var cW = W - pad.left - pad.right;
    var cH = H - pad.top - pad.bottom;

    var EXT = 5; // K extension beyond outermost support points
    var tempMin = sorted[0].temp - EXT;
    var tempMax = sorted[sorted.length - 1].temp + EXT;
    var tRange = tempMax - tempMin || 1;

    var YTOP = 115; // chart top represents 115%, giving legend space above 100%
    function toX(t) { return pad.left + ((t - tempMin) / tRange) * cW; }
    function toY(d) { return pad.top + (1 - Math.max(0, Math.min(YTOP, d)) / YTOP) * cH; }
    function clamp(v) { return Math.min(maxDemand, Math.max(minDemand, v)); }

    var elements = [];

    // Forbidden zones (gray bands outside min/max)
    var yMax = toY(maxDemand);
    var yMin = toY(minDemand);
    if (maxDemand < 100) {
        elements.push(React.createElement('rect', {
            key: 'fzmax',
            x: pad.left, y: pad.top, width: cW, height: yMax - pad.top,
            fill: 'rgba(0,0,0,0.06)', stroke: 'none'
        }));
    }
    if (minDemand > 0) {
        elements.push(React.createElement('rect', {
            key: 'fzmin',
            x: pad.left, y: yMin, width: cW, height: (pad.top + cH) - yMin,
            fill: 'rgba(0,0,0,0.06)', stroke: 'none'
        }));
    }

    // Grid lines
    [0, 25, 50, 75, 100].forEach(function (y) {
        elements.push(React.createElement('line', {
            key: 'gy' + y,
            x1: pad.left, y1: toY(y), x2: pad.left + cW, y2: toY(y),
            stroke: '#e8e8e8', strokeWidth: 1
        }));
        elements.push(React.createElement('text', {
            key: 'yl' + y,
            x: pad.left - 5, y: toY(y) + 4,
            textAnchor: 'end', fontSize: 10, fill: '#777'
        }, y + '%'));
    });

    // Min/Max limit lines
    if (maxDemand < 100) {
        elements.push(React.createElement('line', {
            key: 'lmax', x1: pad.left, y1: yMax, x2: pad.left + cW, y2: yMax,
            stroke: '#e53935', strokeWidth: 1.5, strokeDasharray: '6 3'
        }));
        elements.push(React.createElement('text', {
            key: 'tmax', x: pad.left + cW + 2, y: yMax + 4,
            fontSize: 9, fill: '#e53935', textAnchor: 'start'
        }, maxDemand + '%'));
    }
    if (minDemand > 0) {
        elements.push(React.createElement('line', {
            key: 'lmin', x1: pad.left, y1: yMin, x2: pad.left + cW, y2: yMin,
            stroke: '#e53935', strokeWidth: 1.5, strokeDasharray: '6 3'
        }));
        elements.push(React.createElement('text', {
            key: 'tmin', x: pad.left + cW + 2, y: yMin + 4,
            fontSize: 9, fill: '#e53935', textAnchor: 'start'
        }, minDemand + '%'));
    }

    // Extrapolation lines (flat extension beyond first/last support point)
    var xFirst = toX(sorted[0].temp);
    var xLast  = toX(sorted[sorted.length - 1].temp);
    var yFirst = toY(sorted[0].demand);
    var yLast  = toY(sorted[sorted.length - 1].demand);
    elements.push(React.createElement('line', {
        key: 'extL',
        x1: pad.left, y1: yFirst, x2: xFirst, y2: yFirst,
        stroke: '#1976d2', strokeWidth: 1.5, strokeDasharray: '4 4', opacity: 0.5
    }));
    elements.push(React.createElement('line', {
        key: 'extR',
        x1: xLast, y1: yLast, x2: pad.left + cW, y2: yLast,
        stroke: '#1976d2', strokeWidth: 1.5, strokeDasharray: '4 4', opacity: 0.5
    }));

    // Boost preview lines (clamped to maxDemand)
    if (boostEnabled && boostStages.length > 0) {
        var sortedBoost = boostStages
            .map(function (s) { return { deviation: Number(s.deviation), boost: Number(s.boost) }; })
            .filter(function (s) { return !isNaN(s.deviation) && !isNaN(s.boost); })
            .sort(function (a, b) { return a.deviation - b.deviation; });

        sortedBoost.forEach(function (stage, i) {
            var yB0 = toY(Math.min(maxDemand, sorted[0].demand + stage.boost));
            var yBn = toY(Math.min(maxDemand, sorted[sorted.length - 1].demand + stage.boost));
            var midPts = sorted.map(function (p) {
                return toX(p.temp) + ',' + toY(Math.min(maxDemand, p.demand + stage.boost));
            }).join(' L ');
            var d = 'M ' + pad.left + ',' + yB0 +
                    ' L ' + toX(sorted[0].temp) + ',' + yB0 +
                    ' L ' + midPts +
                    ' L ' + (pad.left + cW) + ',' + yBn;
            elements.push(React.createElement('path', {
                key: 'boost' + i,
                d: d,
                stroke: '#ff9800', strokeWidth: 1.5, strokeDasharray: '5 3', fill: 'none', opacity: 0.8
            }));
        });
    }

    // Fill under base curve
    var fillPts = sorted.map(function (p) { return toX(p.temp) + ',' + toY(p.demand); }).join(' L ');
    var fillPath = 'M ' + fillPts +
        ' L ' + toX(sorted[sorted.length - 1].temp) + ',' + (pad.top + cH) +
        ' L ' + toX(sorted[0].temp) + ',' + (pad.top + cH) + ' Z';
    elements.push(React.createElement('path', {
        key: 'fill', d: fillPath, fill: 'rgba(25,118,210,0.08)', stroke: 'none'
    }));

    // Base curve (support points as drawn)
    var linePts = sorted.map(function (p) { return toX(p.temp) + ',' + toY(p.demand); }).join(' L ');
    elements.push(React.createElement('path', {
        key: 'base', d: 'M ' + linePts,
        stroke: '#1976d2', strokeWidth: 2.5, fill: 'none'
    }));

    // Effective clamped curve – only drawn if any point is outside [min, max]
    var hasClamp = sorted.some(function (p) { return p.demand < minDemand || p.demand > maxDemand; });
    if (hasClamp) {
        var clampedPts = sorted.map(function (p) { return toX(p.temp) + ',' + toY(clamp(p.demand)); }).join(' L ');
        elements.push(React.createElement('path', {
            key: 'clamped', d: 'M ' + clampedPts,
            stroke: '#43a047', strokeWidth: 2, strokeDasharray: '4 2', fill: 'none'
        }));
    }

    // Support point dots
    sorted.forEach(function (p, i) {
        elements.push(React.createElement('circle', {
            key: 'pt' + i,
            cx: toX(p.temp), cy: toY(p.demand),
            r: 4, fill: '#1976d2', stroke: '#fff', strokeWidth: 1.5
        }));
    });

    // Working point marker (current operating point from live device)
    if (workPoint !== null && !isNaN(workPoint.temp) && !isNaN(workPoint.demand)) {
        var wpX = toX(workPoint.temp);
        var wpY = toY(workPoint.demand);
        var CR = 6; // crosshair arm length
        // Crosshair lines
        elements.push(React.createElement('line', { key: 'wpH', x1: wpX - CR, y1: wpY, x2: wpX + CR, y2: wpY, stroke: '#e53935', strokeWidth: 1.5 }));
        elements.push(React.createElement('line', { key: 'wpV', x1: wpX, y1: wpY - CR, x2: wpX, y2: wpY + CR, stroke: '#e53935', strokeWidth: 1.5 }));
        // Center dot
        elements.push(React.createElement('circle', { key: 'wpDot', cx: wpX, cy: wpY, r: 3.5, fill: '#e53935', stroke: '#fff', strokeWidth: 1 }));
    }

    // Axes
    elements.push(React.createElement('line', {
        key: 'xa', x1: pad.left, y1: pad.top + cH, x2: pad.left + cW, y2: pad.top + cH,
        stroke: '#555', strokeWidth: 1
    }));
    elements.push(React.createElement('line', {
        key: 'ya', x1: pad.left, y1: pad.top, x2: pad.left, y2: pad.top + cH,
        stroke: '#555', strokeWidth: 1
    }));

    // X-axis labels: extension endpoints + support points
    [sorted[0].temp - EXT, sorted[sorted.length - 1].temp + EXT].forEach(function (t, i) {
        elements.push(React.createElement('text', {
            key: 'xext' + i,
            x: toX(t), y: pad.top + cH + 16,
            textAnchor: 'middle', fontSize: 10, fill: '#aaa'
        }, t + '°C'));
    });
    sorted.forEach(function (p, i) {
        elements.push(React.createElement('text', {
            key: 'xl' + i,
            x: toX(p.temp), y: pad.top + cH + 16,
            textAnchor: 'middle', fontSize: 10, fill: '#777'
        }, p.temp + '°C'));
    });

    // Legend
    var legendItems = [
        React.createElement('line', { key: 'll', x1: 0, y1: 6, x2: 18, y2: 6, stroke: '#1976d2', strokeWidth: 2.5 }),
        React.createElement('text', { key: 'lt', x: 22, y: 10, fontSize: 10, fill: '#555' }, trC.legendBase)
    ];
    if (boostEnabled) {
        legendItems.push(
            React.createElement('line', { key: 'lb', x1: 110, y1: 6, x2: 128, y2: 6, stroke: '#ff9800', strokeWidth: 1.5, strokeDasharray: '5 3' }),
            React.createElement('text', { key: 'lbt', x: 132, y: 10, fontSize: 10, fill: '#555' }, trC.legendBoost)
        );
    }
    if (hasClamp) {
        var lx = boostEnabled ? 185 : 110;
        legendItems.push(
            React.createElement('line', { key: 'lc', x1: lx, y1: 6, x2: lx + 18, y2: 6, stroke: '#43a047', strokeWidth: 2, strokeDasharray: '4 2' }),
            React.createElement('text', { key: 'lct', x: lx + 22, y: 10, fontSize: 10, fill: '#555' }, trC.legendEffective)
        );
    }

    return React.createElement('div', { style: { margin: '4px 0 8px 0' } },
        React.createElement('svg', {
            width: W, height: H,
            viewBox: '0 0 ' + W + ' ' + H,
            style: { maxWidth: '100%', display: 'block' }
        },
            elements,
            React.createElement('g', { transform: 'translate(' + pad.left + ',' + (pad.top - 2) + ')' }, legendItems)
        )
    );
}

// Pure chart – no socket, all values passed as props
function TaperChart(props) {
    var trT = TAPER_TR[props.lang || (typeof window !== 'undefined' && window.systemLang === 'de' ? 'de' : 'en')];
    var autot      = props.autot;      // number | null
    var autor      = props.autor;      // number | null
    var room       = props.room;       // number | null
    var taperMaxPct = props.taperMax != null ? Number(props.taperMax) : 15;

    if (autot === null || autor === null) {
        return React.createElement('div', {
            style: { fontSize: '12px', color: '#888', fontStyle: 'italic', padding: '4px 0' }
        }, TAPER_TR[props.lang || (typeof window !== 'undefined' && window.systemLang === 'de' ? 'de' : 'en')].waiting);
    }

    var guardOn = autot + autor + 0.1;

    // X range: 1.5 K margin; extend to include room marker if outside
    var xLeft  = autot - 1.5;
    var xRight = guardOn + 1.5;
    if (room !== null) {
        xLeft  = Math.min(xLeft,  room - 0.5);
        xRight = Math.max(xRight, room + 0.5);
    }

    var W = 220, H = 155;
    var pad = { top: 26, right: 16, bottom: 30, left: 42 };
    var cW = W - pad.left - pad.right;
    var cH = H - pad.top - pad.bottom;
    var xRange = xRight - xLeft || 1;
    var yTop = Math.max(taperMaxPct, 5);

    function toX(t) { return pad.left + ((t - xLeft) / xRange) * cW; }
    function toY(r) { return pad.top + (1 - r / yTop) * cH; }

    var elems = [];

    // Fill under active taper zone (autot … xRight)
    var fillD = 'M ' + toX(autot)  + ',' + toY(0) +
                ' L ' + toX(guardOn) + ',' + toY(taperMaxPct) +
                ' L ' + toX(xRight)  + ',' + toY(taperMaxPct) +
                ' L ' + toX(xRight)  + ',' + toY(0) + ' Z';
    elems.push(React.createElement('path', { key: 'fill', d: fillD, fill: 'rgba(255,152,0,0.1)', stroke: 'none' }));

    // Y grid lines
    var yTicks = [0];
    for (var yt = 5; yt < taperMaxPct; yt += 5) yTicks.push(yt);
    if (yTicks.indexOf(taperMaxPct) < 0) yTicks.push(taperMaxPct);
    yTicks.forEach(function (y) {
        elems.push(React.createElement('line', {
            key: 'gy' + y, x1: pad.left, y1: toY(y), x2: pad.left + cW, y2: toY(y),
            stroke: '#e8e8e8', strokeWidth: 1
        }));
        elems.push(React.createElement('text', {
            key: 'yl' + y, x: pad.left - 5, y: toY(y) + 4,
            textAnchor: 'end', fontSize: 10, fill: '#777'
        }, y + '%'));
    });

    // autot vertical marker – label anchored left (text extends leftward from line)
    elems.push(React.createElement('line', {
        key: 'vautot', x1: toX(autot), y1: pad.top - 12, x2: toX(autot), y2: pad.top + cH,
        stroke: '#1976d2', strokeWidth: 1, strokeDasharray: '4 3'
    }));
    elems.push(React.createElement('text', {
        key: 'tlautot', x: toX(autot) - 3, y: pad.top - 14,
        textAnchor: 'end', fontSize: 10, fill: '#1976d2'
    }, 'autot\u00a0' + autot.toFixed(1) + '\u00b0C'));

    // Guard-Ein marker – label anchored right (text extends rightward from line)
    elems.push(React.createElement('line', {
        key: 'vguard', x1: toX(guardOn), y1: pad.top - 12, x2: toX(guardOn), y2: pad.top + cH,
        stroke: '#d32f2f', strokeWidth: 1, strokeDasharray: '4 3'
    }));
    elems.push(React.createElement('text', {
        key: 'tlguard', x: toX(guardOn) + 3, y: pad.top - 14,
        textAnchor: 'start', fontSize: 10, fill: '#d32f2f'
    }, 'Guard\u00a0' + guardOn.toFixed(1) + '\u00b0C'));

    // Room temp marker
    if (room !== null) {
        elems.push(React.createElement('line', {
            key: 'vroom', x1: toX(room), y1: pad.top, x2: toX(room), y2: pad.top + cH,
            stroke: '#388e3c', strokeWidth: 1.5
        }));
        elems.push(React.createElement('text', {
            key: 'tlroom', x: toX(room), y: pad.top + cH + 24,
            textAnchor: 'middle', fontSize: 10, fill: '#388e3c'
        }, room.toFixed(1) + '\u00b0C'));
    }

    // Taper curve: flat 0 left of autot, rising to guardOn, flat at taperMaxPct
    var tapD = 'M ' + toX(xLeft)   + ',' + toY(0) +
               ' L ' + toX(autot)   + ',' + toY(0) +
               ' L ' + toX(guardOn) + ',' + toY(taperMaxPct) +
               ' L ' + toX(xRight)  + ',' + toY(taperMaxPct);
    elems.push(React.createElement('path', {
        key: 'taper', d: tapD, stroke: '#ff9800', strokeWidth: 2.5, fill: 'none'
    }));

    // Axes
    elems.push(React.createElement('line', {
        key: 'xa', x1: pad.left, y1: pad.top + cH, x2: pad.left + cW, y2: pad.top + cH,
        stroke: '#555', strokeWidth: 1
    }));
    elems.push(React.createElement('line', {
        key: 'ya', x1: pad.left, y1: pad.top, x2: pad.left, y2: pad.top + cH,
        stroke: '#555', strokeWidth: 1
    }));

    // X-axis outer edge labels (light gray)
    [[xLeft, 'start'], [xRight, 'end']].forEach(function (pair, i) {
        elems.push(React.createElement('text', {
            key: 'xext' + i, x: toX(pair[0]), y: pad.top + cH + 16,
            textAnchor: i === 0 ? 'start' : 'end', fontSize: 10, fill: '#bbb'
        }, (pair[0]).toFixed(1) + '\u00b0C'));
    });

    return React.createElement('div', { style: { margin: '8px 0 4px 0' } },
        React.createElement('div', { style: { fontSize: '10px', color: '#888', marginBottom: '2px' } },
            trT.chartLabel
        ),
        React.createElement('svg', {
            width: W, height: H,
            viewBox: '0 0 ' + W + ' ' + H,
            style: { maxWidth: '100%', display: 'block' }
        }, elems)
    );
}

// Pure display – vals passed in from DemandTabs
function GuardStatus(props) {
    var vals = props.vals || {};
    var deviceName = props.deviceName || '';
    var trG = GUARD_TR[props.lang || (typeof window !== 'undefined' && window.systemLang === 'de' ? 'de' : 'en')];

    if (!deviceName) {
        return React.createElement('div', {
            style: { fontSize: '12px', color: '#888', fontStyle: 'italic', padding: '4px 0' }
        }, trG.noDevice);
    }

    var autot       = vals.autot       != null ? vals.autot       : null;
    var autor       = vals.autor       != null ? vals.autor       : null;
    var room        = vals.room        != null ? vals.room        : null;
    var guardActive = vals.guardActive != null ? vals.guardActive : null;

    var thresholdOn  = (autot !== null && autor !== null) ? (autot + autor + 0.1) : null;
    var thresholdOff = autot;
    var guardKnown   = guardActive !== null;

    function fmt(v) { return v !== null ? v.toFixed(1) + ' °C' : '–'; }

    var guardColor = guardKnown ? (guardActive ? '#d32f2f' : '#388e3c') : '#888';
    var guardLabel = guardKnown ? (guardActive ? trG.active : trG.inactive) : '–';

    var rows = [
        [trG.setpoint,   fmt(autot)],
        [trG.hysteresis, autor !== null ? autor.toFixed(1) + ' K' : '–'],
        [trG.threshOn,   fmt(thresholdOn)],
        [trG.threshOff,  fmt(thresholdOff)],
        [trG.roomTemp,   fmt(room)]
    ];

    return React.createElement('div', {
        style: { fontSize: '12px', margin: '4px 0 8px 0', display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }
    },
        React.createElement('table', { style: { borderCollapse: 'collapse', lineHeight: '1.7' } },
            React.createElement('tbody', null,
                rows.map(function (row, i) {
                    return React.createElement('tr', { key: i },
                        React.createElement('td', { style: { color: '#888', paddingRight: '12px', whiteSpace: 'nowrap' } }, row[0]),
                        React.createElement('td', { style: { fontWeight: '500', fontVariantNumeric: 'tabular-nums' } }, row[1])
                    );
                })
            )
        ),
        React.createElement('div', {
            style: {
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '6px 14px', borderRadius: '6px', border: '1px solid ' + guardColor,
                color: guardColor, fontWeight: 'bold', fontSize: '13px', minWidth: '80px', lineHeight: '1.5'
            }
        },
            React.createElement('span', { style: { fontSize: '10px', color: '#888', fontWeight: 'normal' } }, trG.label),
            React.createElement('span', null, guardLabel)
        )
    );
}

function DemandTabs(props) {
    var h        = React.createElement;
    var useState = React.useState;
    var useEffect = React.useEffect;
    var useRef   = React.useRef;

    var tickR = useState(0); var tick = tickR[0]; void tick;
    var setTick = tickR[1];
    useEffect(function () {
        if (_detectedLang) return;
        _langWaiters.push(function () { setTick(function (n) { return n + 1; }); });
        if (props.socket) _detectLangFromSocket(props.socket);
    }, []);

    // Full native config for device list; demand settings in props.data (config.demandTabs)
    var fullConfig   = (props.originalData && typeof props.originalData === 'object') ? props.originalData : {};
    var demandConfig = (props.data && typeof props.data === 'object') ? props.data : {};
    var onChange     = props.onChange;

    var allDevices    = Array.isArray(fullConfig.devices) ? fullConfig.devices : [];
    var demandDevices = allDevices.filter(function (d) { return !!d.useDemand; });

    // --- Hooks (must be unconditional) ---
    var tabR      = useState(-1); // -1 = info tab
    var activeTab = tabR[0], setActiveTab = tabR[1];
    var idx       = Math.min(Math.max(activeTab, 0), Math.max(demandDevices.length - 1, 0));

    // Pre-compute devKey before hooks so it can be used as effect dep
    var _device  = demandDevices.length > 0 ? demandDevices[idx] : null;
    var _devName = _device ? _device.name : '';
    var _devKey  = _devName.replace(/[^a-zA-Z0-9_-]/g, '_');

    // Live device vals – shared by GuardStatus, TaperChart and DemandChart working point
    var gvR  = useState({ autot: null, autor: null, room: null, guardActive: null, demand: null, outdoor: null });
    var gv   = gvR[0], setGv = gvR[1];
    var cbsRef = useRef({});

    useEffect(function () {
        // Reset on device switch
        setGv({ autot: null, autor: null, room: null, guardActive: null, demand: null, outdoor: null });
        if (!props.socket || !_devKey) return;

        var alive = true;
        function applyState(key, raw, isBool) {
            if (!alive || !raw || raw.val == null) return;
            var v = isBool ? !!raw.val : Number(raw.val);
            if (!isBool && isNaN(v)) return;
            setGv(function (prev) { var n = Object.assign({}, prev); n[key] = v; return n; });
        }

        // IDs may be customised; read from saved config (demandConfig[_devName])
        var devCfgNow = demandConfig[_devName] || {};
        var roomIdNow    = devCfgNow['demandRoomTempId']    || ('faikout-ac.0.' + _devKey + '.env');
        var outdoorIdNow = devCfgNow['demandOutdoorTempId'] || ('faikout-ac.0.' + _devKey + '.outside');

        var entries = [
            { id: 'faikout-ac.0.' + _devKey + '.autot',                   key: 'autot',       bool: false },
            { id: 'faikout-ac.0.' + _devKey + '.autor',                   key: 'autor',       bool: false },
            { id: 'faikout-ac.0.' + _devKey + '.demand_ctrl.guard_active', key: 'guardActive', bool: true  },
            { id: 'faikout-ac.0.' + _devKey + '.demand_ctrl.demand_calc',  key: 'demand',      bool: false },
            { id: outdoorIdNow,                                             key: 'outdoor',     bool: false },
            { id: roomIdNow,                                                key: 'room',        bool: false }
        ];

        var cbs = {};
        entries.forEach(function (e) {
            if (!e.id) return;
            var k = e.key, b = e.bool;
            var p = props.socket.getState(e.id);
            if (p && typeof p.then === 'function') p.then(function (s) { applyState(k, s, b); }).catch(function () {});
            var cb = function (_id, s) { applyState(k, s, b); };
            cbs[e.id] = cb;
            try { props.socket.subscribeState(e.id, cb); } catch (ex) {}
        });
        cbsRef.current = cbs;

        return function () {
            alive = false;
            var saved = cbsRef.current;
            Object.keys(saved).forEach(function (id) {
                try { props.socket.unsubscribeState(id, saved[id]); } catch (ex) {}
            });
            cbsRef.current = {};
        };
    }, [_devKey]);

    // Sensor ID preview values (fetched on Enter/blur to confirm the ID is valid)
    var pvOutR = useState(null); var pvOut = pvOutR[0]; var setPvOut = pvOutR[1];
    var pvRoomR = useState(null); var pvRoom = pvRoomR[0]; var setPvRoom = pvRoomR[1];
    // --- End hooks ---

    if (demandDevices.length === 0) {
        return h('div', { style: { fontSize: '13px' } },
            h('div', { style: { display: 'flex', flexWrap: 'wrap', borderBottom: '2px solid #e0e0e0', marginBottom: '16px' } },
                h('button', { style: { padding: '7px 18px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '13px',
                    borderBottom: '2px solid #1976d2', color: '#1976d2', fontWeight: 'bold', marginBottom: '-2px' } }, 'Info'),
                h('span', { style: { padding: '7px 18px', fontSize: '12px', color: '#aaa', alignSelf: 'center' } }, DEMAND_INFO_TRANSLATIONS[getLang(props)].noDevice)
            ),
            renderInfoTab()
        );
    }

    var device  = demandDevices[idx];
    var devName = device.name;
    var devKey  = devName.replace(/[^a-zA-Z0-9_-]/g, '_');

    function update(field, value) {
        var devCfg = Object.assign({}, demandConfig[devName] || {});
        devCfg[field] = value;
        var newConfig = Object.assign({}, demandConfig, { [devName]: devCfg });
        // Multi-split: sync outdoor sensor ID to all devices in the same group
        if (field === 'demandOutdoorTempId' && device.group) {
            allDevices.forEach(function (d) {
                if (d.group === device.group && d.name !== devName && d.useDemand) {
                    var peerCfg = Object.assign({}, newConfig[d.name] || {});
                    peerCfg['demandOutdoorTempId'] = value;
                    newConfig[d.name] = peerCfg;
                }
            });
        }
        onChange(newConfig);
    }

    var DEFAULT_CURVE = [{ temp: -5, demand: 80 }, { temp: 0, demand: 75 }, { temp: 5, demand: 65 }, { temp: 10, demand: 55 }, { temp: 15, demand: 30 }];
    var DEFAULT_BOOST = [{ deviation: 0.3, boost: 5 }, { deviation: 0.6, boost: 10 }];

    function g(f, def) {
        var devCfg = demandConfig[devName] || {};
        var v = devCfg[f];
        return (v !== undefined && v !== null) ? v : def;
    }

    var tr = DEMAND_DETAIL_TR[getLang(props)];

    var enabled        = g('demandEnabled', false);
    var logLevel       = g('demandLogLevel', 'basic');
    var outdoorId      = g('demandOutdoorTempId', '');
    var roomId         = g('demandRoomTempId', '');
    var curve          = g('demandCurve', DEFAULT_CURVE);
    var minDemand      = g('demandMinDemand', 30);
    var maxDemand      = g('demandMaxDemand', 95);
    var delayReduce    = g('demandDelayReduce', 0);
    var delayIncrease  = g('demandDelayIncrease', 300);
    var boostEnabled   = g('demandBoostEnabled', true);
    var boostStages    = g('demandBoostStages', DEFAULT_BOOST);
    var taperEnabled   = g('demandTaperEnabled', true);
    var taperMax       = g('demandTaperMax', 15);
    var guardEnabled   = g('demandGuardEnabled', true);
    var hbNormal       = g('demandHeatbackNormal', 3);
    var hbGuard        = g('demandHeatbackGuard', 6);

    var defaultOutdoor = 'faikout-ac.0.' + devKey + '.outside';
    var defaultRoom    = 'faikout-ac.0.' + devKey + '.env';

    var S = {
        label:   { fontSize: '11px', color: '#888', marginBottom: '2px', display: 'block' },
        input:   { border: '1px solid #ccc', borderRadius: '4px', padding: '3px 7px', fontSize: '13px', boxSizing: 'border-box' },
        heading: { fontSize: '13px', fontWeight: 'bold', margin: '16px 0 8px', borderBottom: '1px solid #eee', paddingBottom: '4px' },
        row:     { display: 'flex', gap: '16px', marginBottom: '8px', flexWrap: 'wrap', alignItems: 'flex-end' },
        btn:     { border: '1px solid #1976d2', background: 'transparent', color: '#1976d2', borderRadius: '4px', padding: '2px 10px', cursor: 'pointer', fontSize: '12px' },
        btnDel:  { border: '1px solid #f44336', background: 'transparent', color: '#f44336', borderRadius: '4px', padding: '1px 7px', cursor: 'pointer', fontSize: '12px' },
    };

    function field(label, inp) {
        return h('div', { style: { display: 'flex', flexDirection: 'column' } },
            h('label', { style: S.label }, label), inp);
    }

    function numInput(val, f, w, opts) {
        opts = opts || {};
        return h('input', { type: 'number', value: val, min: opts.min, max: opts.max,
            style: Object.assign({}, S.input, { width: w || '80px' }),
            onChange: function (e) { update(f, Number(e.target.value)); } });
    }

    function checkLabel(checked, f, label) {
        return h('label', { style: { display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px' } },
            h('input', { type: 'checkbox', checked: checked, onChange: function (e) { update(f, e.target.checked); } }), label);
    }

    function cellInput(val, type, onChange, w, opts?) {
        return h('input', Object.assign({ type: type || 'number', value: val,
            style: { width: w || '70px', padding: '2px 5px', border: '1px solid #ccc', borderRadius: '3px', fontSize: '12px' },
            onChange: onChange }, opts || {}));
    }

    function renderInfoTab() {
        var tr = DEMAND_INFO_TRANSLATIONS[getLang(props)];
        var sec = function (title, text) {
            return h('div', { style: { marginBottom: '14px' } },
                h('div', { style: { fontWeight: 'bold', fontSize: '22px', fontFamily: 'xkcd Script, cursive', marginBottom: '4px' } }, title),
                h('div', { style: { lineHeight: '1.6' } }, text)
            );
        };
        return h('div', { style: { maxWidth: '680px', padding: '4px 0', fontSize: '15px' } },
            sec(tr.funcTitle,   tr.funcText),
            sec(tr.curveTitle,  tr.curveText),
            sec(tr.boostTitle,  tr.boostText),
            sec(tr.taperTitle,  tr.taperText),
            sec(tr.guardTitle,  tr.guardText),
            sec(tr.holdTitle,   tr.holdText),
            sec(tr.sensorTitle, tr.sensorText),
            sec(tr.msTitle,     tr.msText),
            sec(tr.ovTitle,     tr.ovText)
        );
    }

    // Tab bar
    var tabBar = h('div', { style: { display: 'flex', flexWrap: 'wrap', borderBottom: '2px solid #e0e0e0', marginBottom: '16px' } },
        h('button', {
            key: '__info', onClick: function () { setActiveTab(-1); },
            style: { padding: '7px 18px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '13px',
                borderBottom: activeTab === -1 ? '2px solid #1976d2' : '2px solid transparent',
                color: activeTab === -1 ? '#1976d2' : '#555', fontWeight: activeTab === -1 ? 'bold' : 'normal', marginBottom: '-2px' }
        }, 'Info'),
        demandDevices.map(function (d, i) {
            var active = activeTab === i;
            var globalIdx = allDevices.indexOf(d);
            var label = (globalIdx >= 0 ? (globalIdx + 1) + '. ' : '') + d.name;
            return h('button', {
                key: d.name, onClick: function () { setActiveTab(i); },
                style: { padding: '7px 18px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '13px',
                    borderBottom: active ? '2px solid #1976d2' : '2px solid transparent',
                    color: active ? '#1976d2' : '#555', fontWeight: active ? 'bold' : 'normal', marginBottom: '-2px' }
            }, label);
        })
    );

    if (activeTab === -1) return h('div', { style: { fontSize: '13px' } }, tabBar, renderInfoTab());

    var groupBadge = device.group
        ? h('span', { style: { marginLeft: '12px', fontSize: '11px', color: '#1976d2', background: '#e3f2fd', borderRadius: '4px', padding: '2px 8px' } }, tr.msGroup + device.group)
        : h('span', { style: { marginLeft: '12px', fontSize: '11px', color: '#888', background: '#f5f5f5', borderRadius: '4px', padding: '2px 8px' } }, tr.singleSplit);

    var enableRow = h('div', { style: { marginBottom: '16px', display: 'inline-flex', alignItems: 'center',
        border: '1px solid ' + (device.group ? '#1976d2' : '#ccc'),
        borderRadius: '6px', padding: '8px 14px', gap: '0' } },
        checkLabel(enabled, 'demandEnabled', tr.enableCheckbox),
        groupBadge);

    if (!enabled) return h('div', { style: { fontSize: '13px' } }, tabBar, enableRow);

    // left col row 1: Bedarfsgrenzen + Bedarfsänderung + Sensoren (inline helper)
    var leftRow1 = h('div', { style: { display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'flex-start' } },
        h('div', null,
            h('div', { style: S.heading }, tr.limitsHeading),
            field(tr.minDemand, numInput(minDemand, 'demandMinDemand', '75px', { min: 0, max: 100 })),
            h('div', { style: { marginTop: '6px' } },
                field(tr.maxDemand, numInput(maxDemand, 'demandMaxDemand', '75px', { min: 0, max: 100 }))
            )
        ),
        h('div', null,
            h('div', { style: S.heading }, tr.changesHeading),
            field(tr.holdDecrease, numInput(delayReduce, 'demandDelayReduce', '75px', { min: 0 })),
            h('div', { style: { marginTop: '6px' } },
                field(tr.holdIncrease, numInput(delayIncrease, 'demandDelayIncrease', '75px', { min: 0 }))
            )
        ),
        h('div', null,
            h('div', { style: S.heading }, tr.sensorsHeading),
            field(tr.outdoorLabel + defaultOutdoor + ')',
                h('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px' } },
                h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                    h('input', { type: 'text', value: outdoorId, placeholder: defaultOutdoor,
                        style: Object.assign({}, S.input, { width: '220px' }),
                        onChange: function (e) { update('demandOutdoorTempId', e.target.value); },
                        onBlur: function (e) {
                            var id = (e.target.value || defaultOutdoor).trim();
                            if (props.socket && id) props.socket.getState(id).then(function (s) { setPvOut(s && s.val != null ? Number(s.val) : null); }).catch(function () { setPvOut(null); });
                        },
                        onKeyDown: function (e) { if (e.key === 'Enter') e.target.blur(); }
                    }),
                    pvOut !== null
                        ? h('span', { style: { fontSize: '12px', color: '#1976d2', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' } }, pvOut.toFixed(1) + ' °C')
                        : h('span', { style: { fontSize: '11px', color: '#aaa' } }, tr.enterToCheck)
                ),
                device.group
                    ? h('span', { style: { fontSize: '11px', color: '#888' } }, tr.groupSync.replace('{g}', device.group))
                    : null
                )
            ),
            h('div', { style: { marginTop: '6px' } },
                field(tr.roomLabel + defaultRoom + ')',
                    h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                        h('input', { type: 'text', value: roomId, placeholder: defaultRoom,
                            style: Object.assign({}, S.input, { width: '220px' }),
                            onChange: function (e) { update('demandRoomTempId', e.target.value); },
                            onBlur: function (e) {
                                var id = (e.target.value || defaultRoom).trim();
                                if (props.socket && id) props.socket.getState(id).then(function (s) { setPvRoom(s && s.val != null ? Number(s.val) : null); }).catch(function () { setPvRoom(null); });
                            },
                            onKeyDown: function (e) { if (e.key === 'Enter') e.target.blur(); }
                        }),
                        pvRoom !== null
                            ? h('span', { style: { fontSize: '12px', color: '#1976d2', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' } }, pvRoom.toFixed(1) + ' °C')
                            : h('span', { style: { fontSize: '11px', color: '#aaa' } }, tr.enterToCheck)
                    )
                )
            )
        )
    );

    // Curve table
    function curveTable() {
        var rows = curve.map(function (row, ri) {
            return h('tr', { key: ri },
                h('td', { style: { paddingRight: '8px', paddingBottom: '4px' } },
                    cellInput(row.temp, 'number', function (e) {
                        update('demandCurve', curve.map(function (r, i) { return i === ri ? Object.assign({}, r, { temp: Number(e.target.value) }) : r; }));
                    }, '75px')
                ),
                h('td', { style: { paddingRight: '8px', paddingBottom: '4px' } },
                    cellInput(row.demand, 'number', function (e) {
                        var v = Math.min(maxDemand, Math.max(minDemand, Number(e.target.value)));
                        update('demandCurve', curve.map(function (r, i) { return i === ri ? Object.assign({}, r, { demand: v }) : r; }));
                    }, '65px', { min: minDemand, max: maxDemand })
                ),
                h('td', { style: { paddingBottom: '4px' } },
                    h('button', { style: S.btnDel, onClick: function () { update('demandCurve', curve.filter(function (_, i) { return i !== ri; })); } }, '−'))
            );
        });
        return h('div', null,
            h('table', { style: { borderCollapse: 'collapse' } },
                h('thead', null, h('tr', null,
                    h('th', { style: { textAlign: 'left', fontSize: '11px', color: '#888', paddingRight: '12px' } }, tr.outdoorTempCol),
                    h('th', { style: { textAlign: 'left', fontSize: '11px', color: '#888', paddingRight: '12px' } }, tr.demandCol),
                    h('th', null)
                )),
                h('tbody', null, rows)
            ),
            h('button', { style: Object.assign({}, S.btn, { marginTop: '6px' }),
                onClick: function () { update('demandCurve', curve.concat([{ temp: 20, demand: 20 }])); } }, tr.addPoint)
        );
    }

    // Boost table
    function boostTable() {
        return h('div', { style: { marginTop: '8px' } },
            h('table', { style: { borderCollapse: 'collapse' } },
                h('thead', null, h('tr', null,
                    h('th', { style: { textAlign: 'left', fontSize: '11px', color: '#888', paddingRight: '12px' } }, tr.deviationCol),
                    h('th', { style: { textAlign: 'left', fontSize: '11px', color: '#888', paddingRight: '12px' } }, tr.boostCol),
                    h('th', null)
                )),
                h('tbody', null, boostStages.map(function (row, ri) {
                    return h('tr', { key: ri },
                        h('td', { style: { paddingRight: '8px', paddingBottom: '4px' } },
                            cellInput(row.deviation, 'number', function (e) {
                                update('demandBoostStages', boostStages.map(function (r, i) { return i === ri ? Object.assign({}, r, { deviation: Number(e.target.value) }) : r; }));
                            }, '75px')
                        ),
                        h('td', { style: { paddingRight: '8px', paddingBottom: '4px' } },
                            cellInput(row.boost, 'number', function (e) {
                                update('demandBoostStages', boostStages.map(function (r, i) { return i === ri ? Object.assign({}, r, { boost: Number(e.target.value) }) : r; }));
                            }, '65px')
                        ),
                        h('td', { style: { paddingBottom: '4px' } },
                            h('button', { style: S.btnDel, onClick: function () { update('demandBoostStages', boostStages.filter(function (_, i) { return i !== ri; })); } }, '−'))
                    );
                }))
            ),
            h('button', { style: Object.assign({}, S.btn, { marginTop: '6px' }),
                onClick: function () { update('demandBoostStages', boostStages.concat([{ deviation: 1.0, boost: 15 }])); } }, tr.addStage)
        );
    }

    // 2-column grid, 3 rows:
    // Row 1: leftRow1 (Bedarfsgrenzen+Bedarfsänderung+Sensoren) | Log-Ausgabe
    // Row 2: Basiskennlinie | Boost
    // Row 3: Taper | Guard
    var twoColGrid = h('div', { style: { display: 'grid', gridTemplateColumns: 'auto auto', gap: '24px 32px', alignItems: 'start' } },
        leftRow1,
        h('div', null,
            h('div', { style: S.heading }, tr.logHeading),
            field(tr.logLevel,
                h('select', { value: logLevel, style: Object.assign({}, S.input, { minWidth: '240px' }),
                    onChange: function (e) { update('demandLogLevel', e.target.value); } },
                    h('option', { value: 'off' }, tr.logOff),
                    h('option', { value: 'basic' }, tr.logBasic),
                    h('option', { value: 'extended' }, tr.logExtended)
                )
            )
        ),
        h('div', null,
            h('div', { style: S.heading }, tr.curveHeading),
            h('div', { style: { display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' } },
                curveTable(),
                h(DemandChart, { data: { demandCurve: curve, demandBoostEnabled: boostEnabled, demandBoostStages: boostStages, demandMinDemand: minDemand, demandMaxDemand: maxDemand }, workPoint: (gv.outdoor !== null && gv.demand !== null) ? { temp: gv.outdoor, demand: gv.demand } : null, lang: getLang(props) })
            )
        ),
        h('div', null,
            h('div', { style: S.heading }, tr.boostHeading),
            checkLabel(boostEnabled, 'demandBoostEnabled', tr.boostEnable),
            boostEnabled ? boostTable() : null
        ),
        h('div', null,
            h('div', { style: S.heading }, tr.taperHeading),
            checkLabel(taperEnabled, 'demandTaperEnabled', tr.taperEnable),
            h('div', { style: { fontSize: '12px', color: '#888', margin: '4px 0 8px' } },
                tr.taperDesc
            ),
            taperEnabled ? h('div', { style: { display: 'flex', gap: '16px', alignItems: 'center', marginTop: '8px', flexWrap: 'wrap' } },
                field(tr.maxTaper, numInput(taperMax, 'demandTaperMax', '75px', { min: 0, max: 100 })),
                h(TaperChart, { autot: gv.autot, autor: gv.autor, room: gv.room, taperMax: taperMax, lang: getLang(props) })
            ) : null
        ),
        h('div', null,
            h('div', { style: S.heading }, tr.guardHeading),
            checkLabel(guardEnabled, 'demandGuardEnabled', tr.guardEnable),
            guardEnabled ? h('div', null,
                h('div', { style: { fontSize: '12px', color: '#888', margin: '6px 0 10px' } },
                    tr.guardDesc),
                h(GuardStatus, { vals: gv, deviceName: devName, lang: getLang(props) }),
                h('div', { style: Object.assign({}, S.row, { marginTop: '8px' }) },
                    field(tr.hbNormal, numInput(hbNormal, 'demandHeatbackNormal', '75px', { min: 0 })),
                    field(tr.hbGuard,  numInput(hbGuard,  'demandHeatbackGuard',  '75px', { min: 0 }))
                )
            ) : null
        )
    );

    return h('div', { style: { fontSize: '13px' } },
        tabBar, enableRow, twoColGrid);
}

function EnvSensorConfig(props) {
    var h         = React.createElement;
    var useState  = React.useState;
    var useEffect = React.useEffect;
    var tickR = useState(0); var tick = tickR[0]; void tick;
    var setTick = tickR[1];
    useEffect(function () {
        if (_detectedLang) return;
        _langWaiters.push(function () { setTick(function (n) { return n + 1; }); });
        if (props.socket) _detectLangFromSocket(props.socket);
    }, []);
    var tr = ENV_TR[getLang(props)];

    var fullConfig = (props.originalData && typeof props.originalData === 'object') ? props.originalData : {};
    var data       = (props.data && typeof props.data === 'object') ? props.data : {};
    var entries    = Array.isArray(data.envSensors) ? data.envSensors : [];
    var devices    = Array.isArray(fullConfig.devices) ? fullConfig.devices.map(function (d) { return d.name || ''; }).filter(Boolean) : [];

    // Preview values per row index { 0: 20.5, 1: null, ... }
    var pvR = useState({}); var pv = pvR[0]; var setPv = pvR[1];

    // On mount fetch previews for already-configured entries
    useEffect(function () {
        if (!props.socket) return;
        entries.forEach(function (e, i) {
            var id = (e.sensorStateId || '').trim();
            if (!id) return;
            props.socket.getState(id).then(function (s) {
                if (s && s.val != null) setPv(function (prev) { var n = Object.assign({}, prev); n[i] = Number(s.val); return n; });
            }).catch(function () {});
        });
    }, []);

    function save(newEntries) {
        props.onChange(Object.assign({}, data, { envSensors: newEntries }));
    }

    function fetchPreview(id, i) {
        if (!props.socket || !id) return;
        props.socket.getState(id).then(function (s) {
            setPv(function (prev) { var n = Object.assign({}, prev); n[i] = (s && s.val != null) ? Number(s.val) : null; return n; });
        }).catch(function () { setPv(function (prev) { var n = Object.assign({}, prev); n[i] = null; return n; }); });
    }

    var S = {
        input: { border: '1px solid #ccc', borderRadius: '4px', padding: '3px 7px', fontSize: '13px', boxSizing: 'border-box' },
        btn:   { border: '1px solid #1976d2', background: 'transparent', color: '#1976d2', borderRadius: '4px', padding: '3px 10px', cursor: 'pointer', fontSize: '12px' },
        btnDel:{ border: '1px solid #f44336', background: 'transparent', color: '#f44336', borderRadius: '4px', padding: '2px 7px', cursor: 'pointer', fontSize: '12px' },
    };

    var rows = entries.map(function (entry, i) {
        return h('tr', { key: i, style: { verticalAlign: 'middle' } },
            // Device selector
            h('td', { style: { paddingRight: '10px', paddingBottom: '6px' } },
                h('select', { value: entry.deviceName || '', style: Object.assign({}, S.input, { minWidth: '120px' }),
                    onChange: function (e) { save(entries.map(function (r, j) { return j === i ? Object.assign({}, r, { deviceName: e.target.value }) : r; })); } },
                    h('option', { value: '' }, tr.devicePh),
                    devices.map(function (name) { return h('option', { key: name, value: name }, name); })
                )
            ),
            // Sensor state ID + preview
            h('td', { style: { paddingRight: '10px', paddingBottom: '6px' } },
                h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
                    h('input', { type: 'text', value: entry.sensorStateId || '', placeholder: tr.sensorPh,
                        style: Object.assign({}, S.input, { width: '280px' }),
                        onChange: function (e) { save(entries.map(function (r, j) { return j === i ? Object.assign({}, r, { sensorStateId: e.target.value }) : r; })); },
                        onBlur: function (e) { fetchPreview(e.target.value.trim(), i); },
                        onKeyDown: function (e) { if (e.key === 'Enter') e.target.blur(); }
                    }),
                    pv[i] != null
                        ? h('span', { style: { fontSize: '12px', color: '#1976d2', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' } }, pv[i].toFixed(1) + ' °C')
                        : h('span', { style: { fontSize: '11px', color: '#aaa' } }, tr.enterToCheck)
                )
            ),
            // Interval
            h('td', { style: { paddingRight: '10px', paddingBottom: '6px' } },
                h('div', { style: { display: 'flex', alignItems: 'center', gap: '4px' } },
                    h('input', { type: 'number', value: entry.intervalSec != null ? entry.intervalSec : 30, min: 10,
                        style: Object.assign({}, S.input, { width: '70px' }),
                        onChange: function (e) { save(entries.map(function (r, j) { return j === i ? Object.assign({}, r, { intervalSec: Number(e.target.value) }) : r; })); }
                    }),
                    h('span', { style: { fontSize: '12px', color: '#888' } }, 's')
                )
            ),
            // Delete
            h('td', { style: { paddingBottom: '6px' } },
                h('button', { style: S.btnDel, onClick: function () {
                    var newEntries = entries.filter(function (_, j) { return j !== i; });
                    var newPv = {};
                    newEntries.forEach(function (_, j) { if (pv[j >= i ? j + 1 : j] != null) newPv[j] = pv[j >= i ? j + 1 : j]; });
                    setPv(newPv);
                    save(newEntries);
                } }, '×')
            )
        );
    });

    return h('div', { style: { fontSize: '13px', maxWidth: '720px' } },
        h('table', { style: { borderCollapse: 'collapse', marginBottom: '8px' } },
            h('thead', null,
                h('tr', null,
                    h('th', { style: { textAlign: 'left', fontSize: '11px', color: '#888', paddingRight: '10px', paddingBottom: '6px', fontWeight: 'normal' } }, tr.deviceCol),
                    h('th', { style: { textAlign: 'left', fontSize: '11px', color: '#888', paddingRight: '10px', paddingBottom: '6px', fontWeight: 'normal' } }, tr.sensorCol),
                    h('th', { style: { textAlign: 'left', fontSize: '11px', color: '#888', paddingRight: '10px', paddingBottom: '6px', fontWeight: 'normal' } }, tr.intervalCol),
                    h('th', null)
                )
            ),
            h('tbody', null, rows)
        ),
        h('button', { style: S.btn, onClick: function () { save(entries.concat([{ deviceName: devices[0] || '', sensorStateId: '', intervalSec: 30 }])); } },
            tr.addEntry),
        h('div', { style: { marginTop: '12px', fontSize: '12px', color: '#888' } },
            tr.hint)
    );
}

function ScheduleConfig(props) {
    var h         = React.createElement;
    var useState  = React.useState;
    var useEffect = React.useEffect;
    var tickR = useState(0); var tick = tickR[0]; void tick;
    var setTick = tickR[1];
    useEffect(function () {
        if (_detectedLang) return;
        _langWaiters.push(function () { setTick(function (n) { return n + 1; }); });
        if (props.socket) _detectLangFromSocket(props.socket);
    }, []);
    var tr = SCHED_TR[getLang(props)];

    var fullConfig = (props.originalData && typeof props.originalData === 'object') ? props.originalData : {};
    var data       = (props.data && typeof props.data === 'object') ? props.data : {};
    var devices    = Array.isArray(fullConfig.devices) ? fullConfig.devices.map(function (d) { return d.name || ''; }).filter(Boolean) : [];

    var sceneModes = Array.isArray(data.sceneModes) ? data.sceneModes : [];

    var newModeR   = useState('');
    var newModeName = newModeR[0], setNewModeName = newModeR[1];

    function saveModes(newModes) {
        props.onChange(Object.assign({}, data, { sceneModes: newModes }));
    }
    function addMode() {
        var n = newModeName.trim();
        if (!n || sceneModes.some(function (m) { return m.name === n; })) return;
        saveModes(sceneModes.concat([{ name: n, active: true }]));
        setNewModeName('');
    }
    function toggleMode(idx) {
        saveModes(sceneModes.map(function (m, i) { return i === idx ? Object.assign({}, m, { active: !m.active }) : m; }));
    }
    function removeMode(idx) {
        saveModes(sceneModes.filter(function (_, i) { return i !== idx; }));
    }

    function normalizeEntry(e) {
        if (!Array.isArray(e.actions)) {
            var acts = e.field ? [{ field: e.field, value: e.value != null ? e.value : true }] : [];
            return { enabled: !!e.enabled, deviceName: e.deviceName || '', days: Array.isArray(e.days) ? e.days : [], time: e.time || '07:00', scene: e.scene || '', actions: acts };
        }
        return Object.assign({ scene: '' }, e);
    }
    var entries = Array.isArray(data.schedule) ? data.schedule.map(normalizeEntry) : [];

    var FAN_OPTIONS = [
        { val: 'A', label: 'Auto' }, { val: '1', label: '1' }, { val: '2', label: '2' },
        { val: '3', label: '3' },   { val: '4', label: '4' }, { val: '5', label: '5' },
        { val: 'Q', label: 'Quiet' }
    ];
    var SCHED_FIELDS = [
        { key: 'power',               label: tr.fieldLabels.power,               type: 'bool'   },
        { key: 'fan',                 label: tr.fieldLabels.fan,                 type: 'fan'    },
        { key: 'econo',               label: tr.fieldLabels.econo,               type: 'bool'   },
        { key: 'swingh',              label: tr.fieldLabels.swingh,              type: 'bool'   },
        { key: 'swingv',              label: tr.fieldLabels.swingv,              type: 'bool'   },
        { key: 'comfort',             label: tr.fieldLabels.comfort,             type: 'bool'   },
        { key: 'powerful',            label: tr.fieldLabels.powerful,            type: 'bool'   },
        { key: 'autot',               label: tr.fieldLabels.autot,               type: 'number' },
        { key: 'demand_override_on',  label: tr.fieldLabels.demand_override_on,  type: 'demand' },
        { key: 'demand_override_off', label: tr.fieldLabels.demand_override_off, type: 'void'   }
    ];
    var DAYS = tr.days;

    function save(newEntries) {
        props.onChange(Object.assign({}, data, { schedule: newEntries, sceneModes: sceneModes }));
    }
    function updTask(i, patch) {
        save(entries.map(function (r, j) { return j === i ? Object.assign({}, r, patch) : r; }));
    }
    function enforceExclusions(actions) {
        var hasComfortOn    = actions.some(function (a) { return a.field === 'comfort' && a.value; });
        var hasSwingOn      = actions.some(function (a) { return (a.field === 'swingh' || a.field === 'swingv') && a.value; });
        var hasOverrideOn   = actions.some(function (a) { return a.field === 'demand_override_on'; });
        var hasOverrideOff  = actions.some(function (a) { return a.field === 'demand_override_off'; });
        var result = actions;
        if (hasComfortOn)   result = result.filter(function (a) { return a.field !== 'swingh' && a.field !== 'swingv'; });
        if (hasSwingOn)     result = result.filter(function (a) { return a.field !== 'comfort'; });
        // demand override on/off are mutually exclusive; last added wins (keep all except the other)
        if (hasOverrideOn && hasOverrideOff) {
            var lastIdx = actions.reduce(function (li, a, i) { return (a.field === 'demand_override_on' || a.field === 'demand_override_off') ? i : li; }, -1);
            var lastField = actions[lastIdx].field;
            var remove = lastField === 'demand_override_on' ? 'demand_override_off' : 'demand_override_on';
            result = result.filter(function (a) { return a.field !== remove; });
        }
        return result;
    }
    function updAction(i, ai, patch) {
        var newActions = entries[i].actions.map(function (a, j) { return j === ai ? Object.assign({}, a, patch) : a; });
        updTask(i, { actions: enforceExclusions(newActions) });
    }
    function delAction(i, ai) {
        updTask(i, { actions: entries[i].actions.filter(function (_, j) { return j !== ai; }) });
    }
    function addAction(i) {
        updTask(i, { actions: (entries[i].actions || []).concat([{ field: 'power', value: true }]) });
    }

    var S = {
        input:  { border: '1px solid #ccc', borderRadius: '4px', padding: '3px 6px', fontSize: '12px', boxSizing: 'border-box', background: 'transparent', color: 'inherit' },
        btn:    { border: '1px solid #1976d2', background: 'transparent', color: '#1976d2', borderRadius: '4px', padding: '3px 10px', cursor: 'pointer', fontSize: '12px' },
        btnDel: { border: '1px solid #f44336', background: 'transparent', color: '#f44336', borderRadius: '4px', padding: '2px 7px', cursor: 'pointer', fontSize: '12px' },
        btnSm:  { border: '1px solid #1976d2', background: 'transparent', color: '#1976d2', borderRadius: '4px', padding: '2px 6px', cursor: 'pointer', fontSize: '11px' },
    };

    var taskBlocks = entries.map(function (e, i) {
        var days = Array.isArray(e.days) ? e.days : [];
        var actions = Array.isArray(e.actions) ? e.actions : [];

        var dayBtns = DAYS.map(function (d, di) {
            var active = days.indexOf(di) >= 0;
            return h('button', { key: di, type: 'button',
                style: { padding: '1px 5px', fontSize: '11px', cursor: 'pointer', borderRadius: '3px', border: '1px solid #ccc',
                    background: active ? '#1976d2' : 'transparent', color: active ? '#fff' : 'inherit', marginRight: '2px' },
                onClick: function () {
                    var nd = active ? days.filter(function (x) { return x !== di; }) : days.concat([di]).sort(function (a, b) { return a - b; });
                    updTask(i, { days: nd });
                } }, d);
        });

        var hasPowerOff = actions.some(function (a) { return a.field === 'power' && !a.value; });

        var actionRows = actions.map(function (a, ai) {
            var fieldDef = SCHED_FIELDS.find(function (f) { return f.key === a.field; }) || SCHED_FIELDS[0];
            var delayVal = a.delay != null ? a.delay : 0;
            var valueInput = fieldDef.type === 'void'
                ? h('span', { style: { fontSize: '12px', color: '#888', width: '65px', display: 'inline-block' } }, '–')
                : fieldDef.type === 'fan'
                ? h('select', { value: a.value != null ? a.value : 'A', style: Object.assign({}, S.input, { width: '75px' }),
                    onChange: function (ev) { updAction(i, ai, { value: ev.target.value }); } },
                    FAN_OPTIONS.map(function (o) { return h('option', { key: o.val, value: o.val }, o.label); }))
                : fieldDef.type === 'demand'
                ? h('input', { type: 'number', value: a.value != null ? a.value : 50, step: '1', min: '30', max: '100',
                    style: Object.assign({}, S.input, { width: '65px' }),
                    onChange: function (ev) { updAction(i, ai, { value: Math.max(30, Math.min(100, Number(ev.target.value))) }); } })
                : fieldDef.type === 'number'
                ? h('input', { type: 'number', value: a.value != null ? a.value : 20, step: '0.1',
                    style: Object.assign({}, S.input, { width: '65px' }),
                    onChange: function (ev) { updAction(i, ai, { value: Number(ev.target.value) }); } })
                : h('select', { value: a.value ? '1' : '0',
                    style: Object.assign({}, S.input, { width: '65px' }),
                    onChange: function (ev) {
                        var newVal = ev.target.value === '1';
                        if (a.field === 'power' && !newVal) {
                            updTask(i, { actions: [{ field: 'power', value: false }] });
                        } else {
                            updAction(i, ai, { value: newVal });
                        }
                    } },
                    h('option', { value: '1' }, tr.on),
                    h('option', { value: '0' }, tr.off));

            return h('div', { key: ai, style: { display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', paddingLeft: '28px' } },
                h('select', { value: a.field || 'power', style: Object.assign({}, S.input, { minWidth: '90px' }),
                    onChange: function (ev) {
                        var fd = SCHED_FIELDS.find(function (f) { return f.key === ev.target.value; });
                        var defVal = fd && fd.type === 'number' ? 20 : fd && fd.type === 'demand' ? 50 : fd && fd.type === 'fan' ? 'A' : fd && fd.type === 'void' ? null : true;
                        updAction(i, ai, { field: ev.target.value, value: defVal });
                    } },
                    SCHED_FIELDS.map(function (f) { return h('option', { key: f.key, value: f.key }, f.label); })),
                valueInput,
                h('span', { style: { fontSize: '11px', color: '#888', whiteSpace: 'nowrap' } }, tr.pause),
                h('input', { type: 'number', value: delayVal, min: '0', max: '300', step: '1',
                    style: Object.assign({}, S.input, { width: '46px' }),
                    onChange: function (ev) { updAction(i, ai, { delay: Math.max(0, Math.round(Number(ev.target.value))) }); } }),
                h('span', { style: { fontSize: '11px', color: '#888' } }, 's'),
                h('button', { type: 'button', style: S.btnDel,
                    onClick: function () { delAction(i, ai); } }, '×')
            );
        });

        return h('div', { key: i, style: { marginBottom: '10px', borderLeft: '2px solid #1976d2', paddingLeft: '8px' } },
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' } },
                h('input', { type: 'checkbox', checked: !!e.enabled,
                    onChange: function (ev) { updTask(i, { enabled: ev.target.checked }); } }),
                h('select', { value: e.deviceName || '', style: Object.assign({}, S.input, { minWidth: '90px' }),
                    onChange: function (ev) { updTask(i, { deviceName: ev.target.value }); } },
                    h('option', { value: '' }, tr.devicePh),
                    devices.map(function (n) { return h('option', { key: n, value: n }, n); })),
                h('select', { value: e.scene || '', style: Object.assign({}, S.input, { minWidth: '90px' }),
                    onChange: function (ev) { updTask(i, { scene: ev.target.value }); } },
                    h('option', { value: '' }, tr.modePh),
                    sceneModes.map(function (m) { return h('option', { key: m.name, value: m.name }, m.name); })),
                h('div', { style: { display: 'flex', flexWrap: 'nowrap' } }, dayBtns),
                h('input', { type: 'time', value: e.time || '07:00', style: Object.assign({}, S.input, { width: '90px' }),
                    onChange: function (ev) { updTask(i, { time: ev.target.value }); } }),
                !hasPowerOff && h('button', { type: 'button', style: S.btnSm,
                    onClick: function () { addAction(i); } }, tr.addAction),
                h('button', { type: 'button', style: S.btnDel,
                    onClick: function () { save(entries.filter(function (_, j) { return j !== i; })); } }, '×')
            ),
            actionRows
        );
    });

    var modeRows = sceneModes.map(function (m, idx) {
        var isActive = !!m.active;
        return h('div', { key: m.name, style: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' } },
            h('span', { style: { minWidth: '120px', fontSize: '13px' } }, m.name),
            h('button', { type: 'button', style: {
                    padding: '2px 10px', fontSize: '11px', cursor: 'pointer', borderRadius: '3px',
                    border: '1px solid ' + (isActive ? '#4caf50' : '#ccc'),
                    background: isActive ? '#4caf50' : 'transparent',
                    color: isActive ? '#fff' : 'inherit'
                },
                onClick: function () { toggleMode(idx); } },
                isActive ? tr.modeActive : tr.modeInactive),
            h('button', { type: 'button', style: S.btnDel, onClick: function () { removeMode(idx); } }, '\u00d7')
        );
    });

    var modesSection = h('div', { style: { marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid #ccc' } },
        h('div', { style: { fontWeight: 'bold', fontSize: '12px', marginBottom: '6px', color: '#888' } }, tr.modesTitle),
        modeRows,
        h('div', { style: { display: 'flex', gap: '6px', marginTop: '4px' } },
            h('input', { type: 'text', value: newModeName, placeholder: tr.modeNewPh,
                style: Object.assign({}, S.input, { minWidth: '150px' }),
                onChange: function (ev) { setNewModeName(ev.target.value); },
                onKeyDown: function (ev) { if (ev.key === 'Enter') { addMode(); } } }),
            h('button', { type: 'button', style: S.btn, onClick: addMode }, tr.modeAddBtn)
        )
    );

    return h('div', { style: { fontSize: '13px' } },
        modesSection,
        taskBlocks,
        h('button', { style: Object.assign({}, S.btn, { marginTop: '4px' }), onClick: function () {
            var defaultScene = sceneModes.length > 0 ? sceneModes[0].name : '';
            save(entries.concat([{ enabled: true, deviceName: devices[0] || '', days: [1,2,3,4,5], time: '07:00', scene: defaultScene, actions: [{ field: 'power', value: true }] }]));
        } }, tr.addTask)
    );
}

function HumidityTabs(props) {
    var h        = React.createElement;
    var useState = React.useState;
    var useEffect = React.useEffect;
    var useRef   = React.useRef;

    var tickR = useState(0); var tick = tickR[0]; void tick;
    var setTick = tickR[1];
    useEffect(function () {
        if (_detectedLang) return;
        _langWaiters.push(function () { setTick(function (n) { return n + 1; }); });
        if (props.socket) _detectLangFromSocket(props.socket);
    }, []);

    var fullConfig = (props.originalData && typeof props.originalData === 'object') ? props.originalData : {};
    var humConfig  = (props.data && typeof props.data === 'object') ? props.data : {};
    var onChange   = props.onChange;

    var allDevices  = Array.isArray(fullConfig.devices) ? fullConfig.devices : [];
    var humDevices  = allDevices.filter(function (d) { return !!d.useHumidity; });

    var tabR      = useState(-1);
    var activeTab = tabR[0], setActiveTab = tabR[1];
    var idx       = Math.min(Math.max(activeTab, 0), Math.max(humDevices.length - 1, 0));

    var _device  = humDevices.length > 0 ? humDevices[idx] : null;
    var _devName = _device ? _device.name : '';
    var _devKey  = _devName.replace(/[^a-zA-Z0-9_-]/g, '_');

    // Live status values per device
    var lvR  = useState({ auto: false, modeText: 'AUS', dewPoint: null, dewDiff: null });
    var lv   = lvR[0], setLv = lvR[1];
    var cbsRef = useRef({});

    useEffect(function () {
        setLv({ auto: false, modeText: 'AUS', dewPoint: null, dewDiff: null });
        if (!props.socket || !_devKey) return;

        var alive = true;
        function applyState(key, raw, isBool) {
            if (!alive || !raw || raw.val == null) return;
            var v = isBool ? !!raw.val : (typeof raw.val === 'string' ? raw.val : Number(raw.val));
            if (!isBool && key !== 'modeText' && isNaN(v)) return;
            setLv(function (prev) { var n = Object.assign({}, prev); n[key] = v; return n; });
        }

        var entries = [
            { id: 'faikout-ac.0.' + _devKey + '.humidity_ctrl.auto',           key: 'auto',      bool: true  },
            { id: 'faikout-ac.0.' + _devKey + '.humidity_ctrl.mode_text',       key: 'modeText',  bool: false },
            { id: 'faikout-ac.0.' + _devKey + '.humidity_ctrl.dew_point',       key: 'dewPoint',  bool: false },
            { id: 'faikout-ac.0.' + _devKey + '.humidity_ctrl.dew_point_diff',  key: 'dewDiff',   bool: false }
        ];

        var cbs = {};
        entries.forEach(function (e) {
            var k = e.key, b = e.bool;
            var p = props.socket.getState(e.id);
            if (p && typeof p.then === 'function') p.then(function (s) { applyState(k, s, b); }).catch(function () {});
            var cb = function (_id, s) { applyState(k, s, b); };
            cbs[e.id] = cb;
            try { props.socket.subscribeState(e.id, cb); } catch (ex) {}
        });
        cbsRef.current = cbs;

        return function () {
            alive = false;
            var saved = cbsRef.current;
            Object.keys(saved).forEach(function (id) {
                try { props.socket.unsubscribeState(id, saved[id]); } catch (ex) {}
            });
            cbsRef.current = {};
        };
    }, [_devKey]);

    // Sensor preview values – live subscription
    var pvTempR = useState(null); var pvTemp = pvTempR[0]; var setPvTemp = pvTempR[1];
    var pvHumR  = useState(null); var pvHum  = pvHumR[0];  var setPvHum  = pvHumR[1];

    useEffect(function () {
        if (!props.socket || !_devKey) return;
        var alive = true;
        var tId = (tempStateId || defaultTemp || '').trim();
        var hId = (humStateId  || defaultHum  || '').trim();
        if (!tId || !hId) return;

        var cbT = function (_id, s) { if (alive) setPvTemp(s && s.val != null ? Number(s.val) : null); };
        var cbH = function (_id, s) { if (alive) setPvHum( s && s.val != null ? Number(s.val) : null); };

        var pt = props.socket.getState(tId);
        if (pt && typeof pt.then === 'function') pt.then(function (s) { if (alive) setPvTemp(s && s.val != null ? Number(s.val) : null); }).catch(function () { if (alive) setPvTemp(null); });
        var ph = props.socket.getState(hId);
        if (ph && typeof ph.then === 'function') ph.then(function (s) { if (alive) setPvHum( s && s.val != null ? Number(s.val) : null); }).catch(function () { if (alive) setPvHum(null); });

        try { props.socket.subscribeState(tId, cbT); } catch (e) {}
        try { props.socket.subscribeState(hId, cbH); } catch (e) {}

        return function () {
            alive = false;
            try { props.socket.unsubscribeState(tId, cbT); } catch (e) {}
            try { props.socket.unsubscribeState(hId, cbH); } catch (e) {}
        };
    }, [devKey]);

    function fetchSensor(id, setter) {
        if (!props.socket || !id) { setter(null); return; }
        var p = props.socket.getState(id.trim());
        if (p && typeof p.then === 'function') p.then(function (s) { setter(s && s.val != null ? Number(s.val) : null); }).catch(function () { setter(null); });
    }

    var S = {
        label:   { fontSize: '11px', color: '#888', marginBottom: '2px', display: 'block' },
        input:   { border: '1px solid #ccc', borderRadius: '4px', padding: '3px 7px', fontSize: '13px', boxSizing: 'border-box' },
        heading: { fontSize: '13px', fontWeight: 'bold', margin: '16px 0 8px', borderBottom: '1px solid #eee', paddingBottom: '4px' },
        row:     { display: 'flex', gap: '16px', marginBottom: '8px', flexWrap: 'wrap', alignItems: 'flex-end' },
    };

    function field(label, inp) {
        return h('div', { style: { display: 'flex', flexDirection: 'column' } },
            h('label', { style: S.label }, label), inp);
    }

    function numInput(val, f, w, opts) {
        opts = opts || {};
        return h('input', { type: 'number', value: val, min: opts.min, max: opts.max, step: opts.step,
            style: Object.assign({}, S.input, { width: w || '80px' }),
            onChange: function (e) { update(f, Number(e.target.value)); } });
    }

    function renderInfoTab() {
        var tr = HUM_INFO_TRANSLATIONS[getLang(props)];
        var sec = function (title, text) {
            return h('div', { style: { marginBottom: '14px' } },
                h('div', { style: { fontWeight: 'bold', fontSize: '22px', fontFamily: 'xkcd Script, cursive', marginBottom: '4px' } }, title),
                h('div', { style: { lineHeight: '1.6' } }, text)
            );
        };
        return h('div', { style: { maxWidth: '680px', padding: '4px 0', fontSize: '15px' } },
            sec(tr.whatTitle,   tr.whatText),
            sec(tr.sensorTitle, tr.sensorText),
            sec(tr.dryTitle,    tr.dryText),
            sec(tr.thrTitle,    tr.thrText),
            sec(tr.windowTitle, tr.windowText),
            sec(tr.motorTitle,  tr.motorText),
            sec(tr.freshTitle,  tr.freshText)
        );
    }

    if (humDevices.length === 0) {
        return h('div', { style: { fontSize: '13px' } },
            h('div', { style: { display: 'flex', flexWrap: 'wrap', borderBottom: '2px solid #e0e0e0', marginBottom: '16px' } },
                h('button', { style: { padding: '7px 18px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '13px',
                    borderBottom: '2px solid #1976d2', color: '#1976d2', fontWeight: 'bold', marginBottom: '-2px' } }, 'Info'),
                h('span', { style: { padding: '7px 18px', fontSize: '12px', color: '#aaa', alignSelf: 'center' } }, HUM_INFO_TRANSLATIONS[getLang(props)].noDevice)
            ),
            renderInfoTab()
        );
    }

    var device  = humDevices[idx];
    var devName = device.name;
    var devKey  = devName.replace(/[^a-zA-Z0-9_-]/g, '_');
    var humCfg  = (humConfig.humCfg || {})[devName] || {};

    function update(field, value) {
        var allHumCfg = Object.assign({}, humConfig.humCfg || {});
        var devCfg = Object.assign({}, allHumCfg[devName] || {});
        devCfg[field] = value;
        allHumCfg[devName] = devCfg;
        onChange(Object.assign({}, humConfig, { humCfg: allHumCfg }));
    }

    function g(f, def) {
        var v = humCfg[f];
        return (v !== undefined && v !== null) ? v : def;
    }

    var tr = HUM_DETAIL_TR[getLang(props)];

    var tempStateId  = g('humTempStateId', '');
    var humStateId   = g('humHumStateId',  '');
    var tpHoch       = g('humTpHoch',       4.0);
    var tpTief       = g('humTpTief',       7.0);
    var maxFeuchte   = g('humMaxFeuchte',   75);
    var startZeit    = g('humStartZeit',    '07:00');
    var endZeit      = g('humEndZeit',      '22:00');
    var maxLaufzeit  = g('humMaxLaufzeit',  240);
    var nachlaufMin  = g('humNachlaufMin',  15);
    var pauseMin     = g('humPauseMin',     30);
    var freshMin     = g('humFreshMin',     20);

    var defaultTemp = 'faikout-ac.0.' + devKey + '.ble.temp';
    var defaultHum  = 'faikout-ac.0.' + devKey + '.ble.hum';

    // Tab bar
    var tabBar = h('div', { style: { display: 'flex', flexWrap: 'wrap', borderBottom: '2px solid #e0e0e0', marginBottom: '16px' } },
        h('button', {
            key: '__info', onClick: function () { setActiveTab(-1); },
            style: { padding: '7px 18px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '13px',
                borderBottom: activeTab === -1 ? '2px solid #1976d2' : '2px solid transparent',
                color: activeTab === -1 ? '#1976d2' : '#555', fontWeight: activeTab === -1 ? 'bold' : 'normal', marginBottom: '-2px' }
        }, 'Info'),
        humDevices.map(function (d, i) {
            var active = activeTab === i;
            var globalIdx = allDevices.indexOf(d);
            var label = (globalIdx >= 0 ? (globalIdx + 1) + '. ' : '') + d.name;
            return h('button', {
                key: d.name, onClick: function () { setActiveTab(i); },
                style: { padding: '7px 18px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '13px',
                    borderBottom: active ? '2px solid #1976d2' : '2px solid transparent',
                    color: active ? '#1976d2' : '#555', fontWeight: active ? 'bold' : 'normal', marginBottom: '-2px' }
            }, label);
        })
    );

    if (activeTab === -1) return h('div', { style: { fontSize: '13px' } }, tabBar, renderInfoTab());

    // Status row
    var modeColor = { 'DRY': '#1976d2', 'NACHLAUF': '#ff9800', 'PAUSE': '#f44336', 'FRESHNESS!': '#d32f2f', 'ÜBERWACHUNG': '#388e3c', 'AUS': '#888' };
    var modeText    = lv.modeText || 'AUS';
    var modeDisplay = (tr.modeMap && tr.modeMap[modeText]) || modeText;
    var mColor      = modeColor[modeText] || '#888';

    // Δ color: red ≤ tpHoch, orange between, green ≥ tpTief
    var tpH = Number(g('humTpHoch', 4.0)), tpT = Number(g('humTpTief', 7.0));
    var diff = lv.dewDiff !== null ? Number(lv.dewDiff) : null;
    var diffColor = diff === null ? '#888' : diff <= tpH ? '#d32f2f' : diff < tpT ? '#f57c00' : '#388e3c';

    var cardStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '6px 0', borderRadius: '6px', width: '130px', height: '60px', lineHeight: '1.3', boxSizing: 'border-box' };

    var statusRow = h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' } },
        h('label', { style: { display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px' } },
            h('input', { type: 'checkbox', checked: !!lv.auto, onChange: function (e) {
                if (props.socket) {
                    try { props.socket.setState('faikout-ac.0.' + devKey + '.humidity_ctrl.auto', { val: e.target.checked, ack: false }); } catch (ex) {}
                }
            } }),
            tr.autoLabel
        ),
        h('div', { style: Object.assign({}, cardStyle, { border: '1px solid ' + mColor }) },
            h('span', { style: { fontSize: '14px', fontWeight: 'bold', color: mColor } }, modeDisplay),
            h('span', { style: { fontSize: '10px', color: '#888', marginTop: '2px' } }, tr.modeLabel)
        ),
        diff !== null ? h('div', { style: Object.assign({}, cardStyle, { border: '1px solid ' + diffColor }) },
            h('span', { style: { fontSize: '20px', fontWeight: 'bold', color: diffColor, fontVariantNumeric: 'tabular-nums' } }, diff.toFixed(1) + ' K'),
            h('span', { style: { fontSize: '10px', color: '#888', marginTop: '2px' } }, tr.dpMarginLabel)
        ) : null,
        lv.dewPoint !== null ? h('div', { style: Object.assign({}, cardStyle, { border: '1px solid #1976d2' }) },
            h('span', { style: { fontSize: '20px', fontWeight: 'bold', color: '#1976d2', fontVariantNumeric: 'tabular-nums' } }, Number(lv.dewPoint).toFixed(1) + ' °C'),
            h('span', { style: { fontSize: '10px', color: '#888', marginTop: '2px' } }, tr.dpLabel)
        ) : null
    );

    function sensorCard(val, unit, label) {
        var ok = val !== null && !isNaN(val);
        var color = ok ? '#1976d2' : '#bbb';
        return h('div', { style: Object.assign({}, cardStyle, { border: '1px solid ' + color }) },
            h('span', { style: { fontSize: '18px', fontWeight: 'bold', color: color, fontVariantNumeric: 'tabular-nums' } }, ok ? val.toFixed(1) + '\u00a0' + unit : 'n.a.'),
            h('span', { style: { fontSize: '10px', color: '#888', marginTop: '2px' } }, label)
        );
    }

    // Sensoren section
    var sensorSection = h('div', null,
        h('div', { style: S.heading }, tr.sensorsHeading),
        h('div', { style: S.row },
            field(tr.tempSensor,
                h('div', { style: { display: 'flex', flexDirection: 'column', gap: '2px' } },
                    h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                        h('input', { type: 'text', value: tempStateId, placeholder: defaultTemp,
                            style: Object.assign({}, S.input, { width: '280px' }),
                            onChange: function (e) { update('humTempStateId', e.target.value); },
                            onKeyDown: function (e) { if (e.key === 'Enter') fetchSensor(e.target.value || defaultTemp, setPvTemp); }
                        }),
                        sensorCard(pvTemp, '°C', tr.tempCard)
                    ),
                    h('div', { style: { fontSize: '11px', color: '#aaa' } }, '(' + tr.emptyHint + defaultTemp + ')')
                )
            )
        ),
        h('div', { style: S.row },
            field(tr.humSensor,
                h('div', { style: { display: 'flex', flexDirection: 'column', gap: '2px' } },
                    h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                        h('input', { type: 'text', value: humStateId, placeholder: defaultHum,
                            style: Object.assign({}, S.input, { width: '280px' }),
                            onChange: function (e) { update('humHumStateId', e.target.value); },
                            onKeyDown: function (e) { if (e.key === 'Enter') fetchSensor(e.target.value || defaultHum, setPvHum); }
                        }),
                        sensorCard(pvHum, '%', tr.humCard)
                    ),
                    h('div', { style: { fontSize: '11px', color: '#aaa' } }, '(' + tr.emptyHint + defaultHum + ')')
                )
            )
        )
    );

    // Schwellen section
    var schwellenSection = h('div', null,
        h('div', { style: S.heading }, tr.thrHeading),
        h('div', { style: S.row },
            field(tr.tpOn, numInput(tpHoch, 'humTpHoch', '75px', { step: 0.1 })),
            field(tr.tpOff, numInput(tpTief, 'humTpTief', '75px', { step: 0.1 })),
            field(tr.maxHum, numInput(maxFeuchte, 'humMaxFeuchte', '75px', { min: 1, max: 100, step: 1 }))
        )
    );

    // Zeitfenster section
    var zeitSection = h('div', null,
        h('div', { style: S.heading }, tr.windowHeading),
        h('div', { style: S.row },
            field(tr.windowFrom,
                h('input', { type: 'time', value: startZeit,
                    style: Object.assign({}, S.input, { width: '110px' }),
                    onChange: function (e) { update('humStartZeit', e.target.value); } })
            ),
            field(tr.windowTo,
                h('input', { type: 'time', value: endZeit,
                    style: Object.assign({}, S.input, { width: '110px' }),
                    onChange: function (e) { update('humEndZeit', e.target.value); } })
            )
        )
    );

    // Laufzeiten section
    var laufzeitSection = h('div', null,
        h('div', { style: S.heading }, tr.runtimeHeading),
        h('div', { style: S.row },
            field(tr.maxRuntime, numInput(maxLaufzeit, 'humMaxLaufzeit', '75px', { min: 1, step: 1 })),
            field(tr.runOn, numInput(nachlaufMin, 'humNachlaufMin', '75px', { min: 1, step: 1 })),
            field(tr.forcedPause, numInput(pauseMin, 'humPauseMin', '75px', { min: 1, step: 1 })),
            field(tr.freshTimeout, numInput(freshMin, 'humFreshMin', '75px', { min: 15, step: 1 }))
        )
    );

    return h('div', { style: { fontSize: '13px' } },
        tabBar, statusRow, sensorSection, schwellenSection, zeitSection, laufzeitSection);
}

export default { DemandTabs, DemandChart, GuardStatus, EnvSensorConfig, ScheduleConfig, HumidityTabs };
