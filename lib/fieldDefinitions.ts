// Field definitions for Faikout ioBroker adapter
// Ported from faikout_alias_generator_en.js v0.4
// No eval()-strings: readConv/writeConv are NOT stored here.
// Conversion logic is implemented directly in stateManager.ts / main.ts.

export interface FieldDef {
    label: { en: string; de: string };
    type: 'boolean' | 'number' | 'string';
    unit?: string;
    writeTopic?: string;   // 'control' | 'mode' | 'fan' | 'econo' | 'powerful' | 'comfort' |
                           // 'streamer' | 'led' | 'quiet' | 'humidify' | 'demand' |
                           // 'autoe' | 'autop' | 'restart' |
                           // 'setting:autot' | 'setting:autor' | 'setting'
    writeOnly?: boolean;
    bleKey?: boolean;
    role?: string;
    states?: Record<string, string>;
    min?: number;
    max?: number;
}

// ----------------------------------------------------------------
// Main status fields (45 entries, ported from FIELDS in generator)
// ----------------------------------------------------------------
export const FIELDS: Record<string, FieldDef> = {
    power: {
        label: { en: 'Power on/off', de: 'Ein/Aus' },
        type: 'boolean',
        writeTopic: 'control',
        role: 'switch.power',
    },
    swingv: {
        label: { en: 'Vertical swing', de: 'Vertikales Schwingen' },
        type: 'boolean',
        writeTopic: 'control',
        role: 'switch',
    },
    swingh: {
        label: { en: 'Horizontal swing', de: 'Horizontales Schwingen' },
        type: 'boolean',
        writeTopic: 'control',
        role: 'switch',
    },
    mode: {
        label: { en: 'Operating mode (H/C/F/D/A)', de: 'Betriebsmodus (H/C/F/D/A)' },
        type: 'string',
        writeTopic: 'mode',
        role: 'value.mode',
        states: { H: 'Heat', C: 'Cool', A: 'Auto', D: 'Dry', F: 'Fan' },
    },
    fan: {
        label: { en: 'Fan mode (e.g. 1-5/A/Q)', de: 'Lüftermodus (z.B. 1-5/A/Q)' },
        type: 'string',
        writeTopic: 'fan',
        role: 'value.speed',
        states: { A: 'Auto', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', Q: 'Quiet' },
    },
    econo: {
        label: { en: 'Economy mode', de: 'Eco-Modus' },
        type: 'boolean',
        writeTopic: 'econo',
        role: 'switch',
    },
    powerful: {
        label: { en: 'Powerful mode', de: 'Powerful-Modus' },
        type: 'boolean',
        writeTopic: 'powerful',
        role: 'switch',
    },
    demand: {
        label: { en: 'Demand/compressor load', de: 'Bedarf/Kompressorleistung' },
        type: 'number',
        unit: '%',
        writeTopic: 'demand',
        role: 'level',
        min: 0,
        max: 100,
    },
    autot: {
        label: { en: 'Target temperature (Faikout)', de: 'Solltemperatur (Faikout)' },
        type: 'number',
        unit: '°C',
        writeTopic: 'setting:autot',
        role: 'level.temperature',
    },
    autor: {
        label: { en: 'Hysteresis (Faikout)', de: 'Hysterese (Faikout)' },
        type: 'number',
        unit: '°C',
        writeTopic: 'setting:autor',
        role: 'level.temperature',
    },
    outside: {
        label: { en: 'Outdoor temperature', de: 'Außentemperatur' },
        type: 'number',
        unit: '°C',
        role: 'value.temperature',
    },
    home: {
        label: { en: 'Indoor temperature', de: 'Innentemperatur' },
        type: 'number',
        unit: '°C',
        role: 'value.temperature',
    },
    liquid: {
        label: { en: 'Refrigerant temperature', de: 'Kältemitteltemperatur' },
        type: 'number',
        unit: '°C',
        role: 'value.temperature',
    },
    inlet: {
        label: { en: 'Inlet temperature', de: 'Ansaugtemperatur' },
        type: 'number',
        unit: '°C',
        role: 'value.temperature',
    },
    temp: {
        label: { en: 'Setpoint (Daikin internal)', de: 'Sollwert (Daikin intern)' },
        type: 'number',
        unit: '°C',
        role: 'value.temperature',
    },
    comp: {
        label: { en: 'Compressor speed', de: 'Kompressordrehzahl' },
        type: 'number',
        unit: 'Hz',
        role: 'value.speed',
    },
    fanrpm: {
        label: { en: 'Fan speed', de: 'Lüfterdrehzahl' },
        type: 'number',
        unit: 'RPM',
        role: 'value.speed',
    },
    consumption: {
        label: { en: 'Power consumption', de: 'Leistungsaufnahme' },
        type: 'number',
        unit: 'W',
        role: 'value.power.consumption',
    },
    Whheating: {
        label: { en: 'Heating energy (cumulative)', de: 'Heizenergie (kumuliert)' },
        type: 'number',
        unit: 'Wh',
        role: 'value.energy.consumed',
    },
    Whcooling: {
        label: { en: 'Cooling energy (cumulative)', de: 'Kühlenergie (kumuliert)' },
        type: 'number',
        unit: 'Wh',
        role: 'value.energy.consumed',
    },
    Whoutside: {
        label: { en: 'Outdoor unit energy meter', de: 'Außengerät Energiezähler' },
        type: 'number',
        unit: 'Wh',
        role: 'value.energy.consumed',
    },
    hum: {
        label: { en: 'Humidity', de: 'Luftfeuchtigkeit' },
        type: 'number',
        unit: '%',
        role: 'value.humidity',
    },
    anglev: {
        label: { en: 'Vertical vane angle', de: 'Vertikaler Luftwinkel' },
        type: 'number',
        unit: '°',
        role: 'value',
    },
    angleh: {
        label: { en: 'Horizontal vane angle', de: 'Horizontaler Luftwinkel' },
        type: 'number',
        unit: '°',
        role: 'value',
    },
    comfort: {
        label: { en: 'Comfort mode', de: 'Comfort-Modus' },
        type: 'boolean',
        writeTopic: 'comfort',
        role: 'switch',
    },
    streamer: {
        label: { en: 'Air purifier (streamer)', de: 'Luftreiniger (Streamer)' },
        type: 'boolean',
        writeTopic: 'streamer',
        role: 'switch',
    },
    led: {
        label: { en: 'LED', de: 'LED' },
        type: 'boolean',
        writeTopic: 'led',
        role: 'switch',
    },
    quiet: {
        label: { en: 'Quiet mode (outdoor unit)', de: 'Quiet (Außengerät leise)' },
        type: 'boolean',
        writeTopic: 'quiet',
        role: 'switch',
    },
    humidify: {
        label: { en: 'Humidifier (e.g. X/L/S/H/C)', de: 'Befeuchter (z.B. X/L/S/H/C)' },
        type: 'string',
        writeTopic: 'humidify',
        role: 'text',
    },
    autoe: {
        label: { en: 'Auto mode active', de: 'Auto-Funktion aktiv' },
        type: 'boolean',
        writeTopic: 'autoe',
        role: 'switch',
    },
    autop: {
        label: { en: 'Auto power on/off active', de: 'Auto Ein/Aus aktiv' },
        type: 'boolean',
        writeTopic: 'autop',
        role: 'switch',
    },
    auto0: {
        label: { en: 'Timer off time', de: 'Timer Ausschaltzeit' },
        type: 'string',
        writeTopic: 'setting',
        role: 'text',
    },
    auto1: {
        label: { en: 'Timer on time', de: 'Timer Einschaltzeit' },
        type: 'string',
        writeTopic: 'setting',
        role: 'text',
    },
    autob: {
        label: { en: 'BLE reference device (MAC)', de: 'BLE-Referenzgerät (MAC)' },
        type: 'string',
        bleKey: true,
        role: 'text',
    },
    antifreeze: {
        label: { en: 'Anti-freeze active', de: 'Frostschutz aktiv' },
        type: 'boolean',
        role: 'indicator',
    },
    env: {
        label: { en: 'Room temperature', de: 'Raumtemperatur' },
        type: 'number',
        unit: '°C',
        role: 'value.temperature',
    },
    env_set: {
        label: { en: 'Room temperature (send control reference)', de: 'Raumtemperatur (Regelreferenz senden)' },
        type: 'number',
        unit: '°C',
        writeTopic: 'control',
        writeOnly: true,
        role: 'level.temperature',
    },
    restart: {
        label: { en: 'Restart device', de: 'Gerät neu starten' },
        type: 'boolean',
        writeTopic: 'restart',
        writeOnly: true,
        role: 'button',
    },
    ble_temp: {
        label: { en: 'BLE temperature', de: 'BLE Temperatur' },
        type: 'number',
        unit: '°C',
        bleKey: true,
        role: 'value.temperature',
    },
    ble_hum: {
        label: { en: 'BLE humidity', de: 'BLE Luftfeuchtigkeit' },
        type: 'number',
        unit: '%',
        bleKey: true,
        role: 'value.humidity',
    },
    ble_bat: {
        label: { en: 'BLE battery level', de: 'BLE Batteriestand' },
        type: 'number',
        unit: '%',
        bleKey: true,
        role: 'value.battery',
    },
    ble_volt: {
        label: { en: 'BLE battery voltage', de: 'BLE Batteriespannung' },
        type: 'number',
        unit: 'V',
        bleKey: true,
        role: 'value.voltage',
    },
};

// ----------------------------------------------------------------
// Config fields (16 entries, write-only, not in status JSON)
// ported from CONFIG_FIELDS_DEF in generator
// ----------------------------------------------------------------
export const CONFIG_FIELDS_DEF: Record<string, FieldDef> = {
    heatback: {
        label: { en: 'Heat pull-back', de: 'Heat pull-back' },
        type: 'number',
        unit: '°C',
        writeOnly: true,
        role: 'level',
    },
    heatover: {
        label: { en: 'Heat push-over', de: 'Heat push-over' },
        type: 'number',
        unit: '°C',
        writeOnly: true,
        role: 'level',
    },
    coolback: {
        label: { en: 'Cool pull-back', de: 'Cool pull-back' },
        type: 'number',
        unit: '°C',
        writeOnly: true,
        role: 'level',
    },
    coolover: {
        label: { en: 'Cool push-over', de: 'Cool push-over' },
        type: 'number',
        unit: '°C',
        writeOnly: true,
        role: 'level',
    },
    tcontrol: {
        label: { en: 'Control message timeout', de: 'Control-Timeout' },
        type: 'number',
        unit: 's',
        writeOnly: true,
        role: 'level',
    },
    thermref: {
        label: { en: 'Inlet/home blend ratio', de: 'Inlet/Home-Blend-Verhältnis' },
        type: 'number',
        unit: '%',
        writeOnly: true,
        role: 'level',
    },
    tmin: {
        label: { en: 'Min temperature limit', de: 'Min-Temperatur' },
        type: 'number',
        unit: '°C',
        writeOnly: true,
        role: 'level.temperature',
    },
    tmax: {
        label: { en: 'Max temperature limit', de: 'Max-Temperatur' },
        type: 'number',
        unit: '°C',
        writeOnly: true,
        role: 'level.temperature',
    },
    tcoolmin: {
        label: { en: 'Min temp limit (cooling)', de: 'Min-Temperatur Kühlen' },
        type: 'number',
        unit: '°C',
        writeOnly: true,
        role: 'level.temperature',
    },
    theatmax: {
        label: { en: 'Max temp limit (heating)', de: 'Max-Temperatur Heizen' },
        type: 'number',
        unit: '°C',
        writeOnly: true,
        role: 'level.temperature',
    },
    frosttemp: {
        label: { en: 'Frost protection', de: 'Frostschutz' },
        type: 'number',
        unit: '°C',
        writeOnly: true,
        role: 'level.temperature',
    },
    minoutside: {
        label: { en: 'Min outdoor temperature', de: 'Min-Außentemperatur' },
        type: 'number',
        unit: '°C',
        writeOnly: true,
        role: 'level.temperature',
    },
    switchtemp: {
        label: { en: 'Switch-point offset', de: 'Schaltpunkt-Offset' },
        type: 'number',
        unit: '°C',
        writeOnly: true,
        role: 'level',
    },
    pushtemp: {
        label: { en: 'Push-point offset', de: 'Push-Offset' },
        type: 'number',
        unit: '°C',
        writeOnly: true,
        role: 'level',
    },
    reporting: {
        label: { en: 'Status report interval', de: 'Report-Intervall' },
        type: 'number',
        unit: 's',
        writeOnly: true,
        role: 'level',
    },
    lockmode: {
        label: { en: 'Lock heating/cooling mode', de: 'Heiz-/Kühlmodus sperren' },
        type: 'boolean',
        writeOnly: true,
        role: 'switch',
    },
};

// Fields always created even if not found via o.xyz scan
// (direct MQTT JSON fields or synthetic write-only data points)
export const FIELD_WHITELIST = new Set<string>(['comp', 'anglev', 'angleh', 'env_set', 'restart', 'Whheating', 'Whcooling', 'Whoutside']);
