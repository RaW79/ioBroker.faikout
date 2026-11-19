"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateManager = void 0;
const fieldDefinitions_1 = require("./fieldDefinitions");
class StateManager {
    constructor(adapter, deviceFolder) {
        this.adapter = adapter;
        this.deviceFolder = deviceFolder;
    }
    async createStates(profile, createConfigStates) {
        const { deviceId, appName, ip, activeFields, topicConfig, fantype } = profile;
        await this.adapter.setObjectNotExistsAsync(this.deviceFolder, {
            type: 'channel',
            common: { name: appName || deviceId },
            native: {},
        });
        await this._ensureChannel(`${this.deviceFolder}.info`, 'Device Information');
        await this._ensureState(`${this.deviceFolder}.info.deviceId`, {
            name: 'Device ID',
            type: 'string',
            role: 'info.address',
            read: true,
            write: false,
            def: deviceId,
        });
        await this._ensureState(`${this.deviceFolder}.info.appName`, {
            name: 'App Name',
            type: 'string',
            role: 'info.name',
            read: true,
            write: false,
            def: appName,
        });
        await this._ensureState(`${this.deviceFolder}.info.ip`, {
            name: 'IP Address',
            type: 'string',
            role: 'info.ip',
            read: true,
            write: false,
            def: ip,
        });
        await this._ensureState(`${this.deviceFolder}.info.connection`, {
            name: 'Connection',
            type: 'boolean',
            role: 'indicator.connection',
            read: true,
            write: false,
            def: false,
        });
        await this._ensureState(`${this.deviceFolder}.info.lastUpdate`, {
            name: 'Last Update',
            type: 'number',
            role: 'date',
            read: true,
            write: false,
            def: 0,
        });
        await this._ensureState(`${this.deviceFolder}.info.fantype`, {
            name: 'Fan type',
            type: 'number',
            role: 'value',
            read: true,
            write: false,
            def: fantype,
        });
        await this.adapter.setStateAsync(`${this.deviceFolder}.info.fantype`, { val: fantype, ack: true });
        await this._ensureState(`${this.deviceFolder}.info.protocol`, {
            name: 'Protocol',
            type: 'string',
            role: 'info.firmware',
            read: true,
            write: false,
            def: '',
        });
        await this._ensureChannel(`${this.deviceFolder}.topics`, 'MQTT Topics');
        await this._ensureState(`${this.deviceFolder}.topics.state`, {
            name: 'State topic prefix',
            type: 'string',
            role: 'text',
            read: true,
            write: false,
            def: topicConfig.topicstate,
        });
        await this._ensureState(`${this.deviceFolder}.topics.command`, {
            name: 'Command topic prefix',
            type: 'string',
            role: 'text',
            read: true,
            write: false,
            def: topicConfig.topiccommand,
        });
        await this._ensureState(`${this.deviceFolder}.topics.setting`, {
            name: 'Setting topic prefix',
            type: 'string',
            role: 'text',
            read: true,
            write: false,
            def: topicConfig.topicsetting,
        });
        await this._ensureState(`${this.deviceFolder}.topics.prefixApp`, {
            name: 'Prefix app name',
            type: 'boolean',
            role: 'indicator',
            read: true,
            write: false,
            def: topicConfig.prefixapp,
        });
        await this._ensureState(`${this.deviceFolder}.topics.prefixHost`, {
            name: 'Prefix host name',
            type: 'boolean',
            role: 'indicator',
            read: true,
            write: false,
            def: topicConfig.prefixhost,
        });
        const hasBle = activeFields.has('ble') || activeFields.has('ble_temp');
        let bleChannelCreated = false;
        for (const [key, def] of Object.entries(fieldDefinitions_1.FIELDS)) {
            if (def.bleKey) {
                if (!hasBle) {
                    continue;
                }
                const isBleSubField = key.startsWith('ble_');
                if (isBleSubField) {
                    if (!bleChannelCreated) {
                        await this._ensureChannel(`${this.deviceFolder}.ble`, 'BLE Sensor');
                        bleChannelCreated = true;
                    }
                    const subKey = key.slice(4);
                    await this._ensureFieldState(`${this.deviceFolder}.ble.${subKey}`, def);
                }
                else {
                    await this._ensureFieldState(`${this.deviceFolder}.${key}`, def);
                }
                continue;
            }
            if (!activeFields.has(key)) {
                continue;
            }
            await this._ensureFieldState(`${this.deviceFolder}.${key}`, def);
        }
        if (createConfigStates) {
            await this._ensureChannel(`${this.deviceFolder}.config`, 'Device Configuration');
            for (const [key, def] of Object.entries(fieldDefinitions_1.CONFIG_FIELDS_DEF)) {
                await this._ensureFieldState(`${this.deviceFolder}.config.${key}`, def);
            }
        }
    }
    async updateFromMqttPayload(payload) {
        let json;
        try {
            json = JSON.parse(payload);
        }
        catch (e) {
            this.adapter.log.warn(`${this.deviceFolder}: Failed to parse MQTT payload: ${String(e)}`);
            return;
        }
        for (const [key, def] of Object.entries(fieldDefinitions_1.FIELDS)) {
            if (def.writeOnly) {
                continue;
            }
            if (def.bleKey && key.startsWith('ble_')) {
                continue;
            }
            const rawVal = json[key];
            if (rawVal === undefined || rawVal === null) {
                continue;
            }
            const converted = this._convertReadValue(key, def, rawVal);
            if (converted === null || converted === undefined) {
                continue;
            }
            await this.adapter.setStateAsync(`${this.deviceFolder}.${key}`, { val: converted, ack: true });
        }
        const bleObj = json.ble;
        if (bleObj !== null && bleObj !== undefined && typeof bleObj === 'object') {
            const ble = bleObj;
            const bleMap = {
                ble_temp: 'temp',
                ble_hum: 'hum',
                ble_bat: 'bat',
                ble_volt: 'volt',
            };
            for (const [fieldKey, subKey] of Object.entries(bleMap)) {
                const rawVal = ble[subKey];
                if (rawVal === undefined || rawVal === null) {
                    continue;
                }
                const def = fieldDefinitions_1.FIELDS[fieldKey];
                if (!def) {
                    continue;
                }
                const converted = this._convertReadValue(fieldKey, def, rawVal);
                if (converted === null || converted === undefined) {
                    continue;
                }
                await this.adapter.setStateAsync(`${this.deviceFolder}.ble.${subKey}`, { val: converted, ack: true });
            }
        }
        if (json.autob !== undefined && json.autob !== null) {
            await this.adapter.setStateAsync(`${this.deviceFolder}.autob`, {
                val: String(json.autob),
                ack: true,
            });
        }
        if (json.protocol !== undefined && json.protocol !== null) {
            const protocol = String(json.protocol);
            await this.adapter.setStateAsync(`${this.deviceFolder}.info.protocol`, { val: protocol, ack: true });
            await this._updateFanStates(protocol);
        }
        await this.adapter.setStateAsync(`${this.deviceFolder}.info.lastUpdate`, { val: Date.now(), ack: true });
    }
    async _updateFanStates(protocol) {
        const fantypeState = await this.adapter.getStateAsync(`${this.deviceFolder}.info.fantype`);
        const fantype = fantypeState?.val != null ? Number(fantypeState.val) : 0;
        const states = (0, fieldDefinitions_1.getFanStates)(fantype, protocol);
        await this.adapter.extendObjectAsync(`${this.deviceFolder}.fan`, { common: { states } });
    }
    isUserModified(key) {
        void key;
        return false;
    }
    async removeStaleStates(profile) {
        const hasBle = profile.activeFields.has('ble') || profile.activeFields.has('ble_temp');
        for (const key of Object.keys(fieldDefinitions_1.FIELDS)) {
            const def = fieldDefinitions_1.FIELDS[key];
            if (!def) {
                continue;
            }
            const isBleField = def.bleKey && key.startsWith('ble_');
            const statePath = isBleField ? `${this.deviceFolder}.ble.${key.slice(4)}` : `${this.deviceFolder}.${key}`;
            const shouldExist = isBleField ? hasBle : def.bleKey ? hasBle : profile.activeFields.has(key);
            if (!shouldExist) {
                try {
                    const existing = await this.adapter.getObjectAsync(statePath);
                    if (existing) {
                        await this.adapter.delObjectAsync(statePath);
                        this.adapter.log.debug(`Removed stale state: ${statePath}`);
                    }
                }
                catch {
                }
            }
        }
    }
    _buildStateCommon(def) {
        const common = {
            name: def.label,
            type: def.type,
            role: def.role ?? (def.type === 'boolean' ? (def.writeTopic ? 'switch' : 'indicator') : 'value'),
            read: !def.writeOnly,
            write: !!def.writeTopic,
        };
        if (def.unit) {
            common.unit = def.unit;
        }
        if (def.states) {
            common.states = def.states;
        }
        if (def.min !== undefined) {
            common.min = def.min;
        }
        if (def.max !== undefined) {
            common.max = def.max;
        }
        return common;
    }
    async _ensureFieldState(id, def) {
        const existing = await this.adapter.getObjectAsync(id);
        if (existing?.native?.userModified === true) {
            this.adapter.log.debug(`Skipping userModified state: ${id}`);
            return;
        }
        await this.adapter.setObjectAsync(id, {
            type: 'state',
            common: this._buildStateCommon(def),
            native: { userModified: false },
        });
    }
    async _ensureState(id, common) {
        const { def: defaultVal, ...rest } = common;
        await this.adapter.setObjectNotExistsAsync(id, {
            type: 'state',
            common: rest,
            native: { userModified: false },
        });
        if (defaultVal !== undefined) {
            const existing = await this.adapter.getStateAsync(id);
            if (existing === null || existing === undefined) {
                await this.adapter.setStateAsync(id, { val: defaultVal, ack: true });
            }
        }
    }
    async _ensureChannel(id, name) {
        await this.adapter.setObjectNotExistsAsync(id, {
            type: 'channel',
            common: { name },
            native: {},
        });
    }
    _convertReadValue(key, def, rawVal) {
        if (rawVal === null || rawVal === undefined) {
            return null;
        }
        switch (def.type) {
            case 'boolean':
                return rawVal === true || rawVal === 1 || rawVal === '1' || rawVal === 'true';
            case 'number': {
                if (key === 'demand' || key === 'Whheating' || key === 'Whcooling' || key === 'Whoutside') {
                    return parseInt(String(rawVal), 10);
                }
                return parseFloat(String(rawVal));
            }
            case 'string':
                return String(rawVal);
            default:
                return String(rawVal);
        }
    }
}
exports.StateManager = StateManager;
