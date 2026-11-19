"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.discoverDevice = discoverDevice;
const http = __importStar(require("http"));
const fieldDefinitions_1 = require("./fieldDefinitions");
const topicBuilder_1 = require("./topicBuilder");
function fetchPage(url) {
    return new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
            let html = '';
            res.on('data', (chunk) => {
                html += chunk.toString();
            });
            res.on('end', () => resolve(html));
        });
        req.setTimeout(6000, () => {
            req.destroy();
            reject(new Error(`Timeout: ${url}`));
        });
        req.on('error', reject);
    });
}
async function fetchDeviceFields(ip) {
    const [mainHtml, extrasHtml] = await Promise.all([
        fetchPage(`http://${ip}/`),
        fetchPage(`http://${ip}/revk-settings?_page=-2`),
    ]);
    const matches = mainHtml.match(/\bo\.([a-zA-Z]\w*)\b/g) ?? [];
    const fieldsKeyMap = new Map(Object.keys(fieldDefinitions_1.FIELDS).map((k) => [k.toLowerCase(), k]));
    const found = new Set(matches.map((m) => {
        const lower = m.slice(2).toLowerCase();
        return fieldsKeyMap.get(lower) ?? lower;
    }));
    for (const key of Object.keys(fieldDefinitions_1.FIELDS)) {
        const disabled = new RegExp(`id="no${key}"[^>]*checked`, 'i').test(extrasHtml);
        if (disabled) {
            found.delete(key);
        }
    }
    if (found.has('ble')) {
        found.add('ble_temp');
        found.add('ble_hum');
        found.add('ble_bat');
        found.add('ble_volt');
    }
    for (const f of fieldDefinitions_1.FIELD_WHITELIST) {
        found.add(f);
    }
    let fantype = 0;
    const fantypeBlock = extrasHtml.match(/name="_fantype"[\s\S]{0,600}?<\/select>/);
    if (fantypeBlock) {
        const sel = fantypeBlock[0].match(/<option value="(\d+)"[^>]*selected/);
        if (sel) {
            fantype = parseInt(sel[1], 10);
        }
    }
    return { activeFields: found, fantype };
}
function fetchDeviceId(ip) {
    return new Promise((resolve, reject) => {
        const req = http.get(`http://${ip}/revk-settings?_page=0`, (res) => {
            let html = '';
            res.on('data', (chunk) => {
                html += chunk.toString();
            });
            res.on('end', () => {
                const match = html.match(/<h1>([^\s<]+)/);
                if (!match) {
                    reject(new Error('Device ID not found on settings page'));
                    return;
                }
                const deviceId = match[1];
                const appMatch = html.match(/Home<\/a>\s+([^\s<]+)<small>/);
                const appName = appMatch ? appMatch[1] : '';
                resolve({ deviceId, appName });
            });
        });
        req.setTimeout(6000, () => {
            req.destroy();
            reject(new Error(`Timeout reading settings: ${ip}`));
        });
        req.on('error', reject);
    });
}
function fetchXgpioConfig(ip) {
    const emptyConfig = () => Array.from({ length: 5 }, () => ({ set: false, out: false, pwm: false, adc: false, name: '' }));
    return new Promise((resolve) => {
        const req = http.get(`http://${ip}/revk-settings?_page=1`, (res) => {
            let html = '';
            res.on('data', (chunk) => {
                html += chunk.toString();
            });
            res.on('end', () => {
                const config = [];
                for (let n = 1; n <= 5; n++) {
                    const valM = html.match(new RegExp(`id="xgpio${n}"[^>]*value="([^"]*)"`)) ??
                        html.match(new RegExp(`value="([^"]*)"[^>]*id="xgpio${n}"`));
                    const gpioVal = valM ? valM[1].trim() : '';
                    const set = gpioVal !== '' && gpioVal !== '0';
                    const out = new RegExp(`id="xgpio${n}out"[^>]*checked`).test(html);
                    const pwm = new RegExp(`id="xgpio${n}pwm"[^>]*checked`).test(html);
                    const adc = new RegExp(`id="xgpio${n}adc"[^>]*checked`).test(html);
                    const nameM = html.match(new RegExp(`id="xgpio${n}name"[^>]*value="([^"]*)"`)) ??
                        html.match(new RegExp(`value="([^"]*)"[^>]*id="xgpio${n}name"`));
                    const name = nameM ? nameM[1].trim() : '';
                    config.push({ set, out, pwm, adc, name });
                }
                resolve(config);
            });
        });
        req.setTimeout(6000, () => {
            req.destroy();
            resolve(emptyConfig());
        });
        req.on('error', () => resolve(emptyConfig()));
    });
}
function fetchTopicConfig(ip) {
    return new Promise((resolve) => {
        const req = http.get(`http://${ip}/revk-settings?_page=-3`, (res) => {
            let html = '';
            res.on('data', (chunk) => {
                html += chunk.toString();
            });
            res.on('end', () => {
                function val(id) {
                    const m = html.match(new RegExp(`id="${id}"[^>]*value="([^"]*)"`)) ??
                        html.match(new RegExp(`value="([^"]*)"[^>]*id="${id}"`));
                    return m ? m[1].trim() : null;
                }
                const topiccommand = val('topiccommand') ?? topicBuilder_1.DEFAULT_TOPIC_CONFIG.topiccommand;
                const topicsetting = val('topicsetting') ?? topicBuilder_1.DEFAULT_TOPIC_CONFIG.topicsetting;
                const topicstate = val('topicstate') ?? topicBuilder_1.DEFAULT_TOPIC_CONFIG.topicstate;
                const prefixapp = new RegExp('id="prefixapp"[^>]*checked').test(html);
                const prefixhost = new RegExp('id="prefixhost"[^>]*checked').test(html);
                resolve({ topiccommand, topicsetting, topicstate, prefixapp, prefixhost });
            });
        });
        req.setTimeout(6000, () => {
            req.destroy();
            resolve({ ...topicBuilder_1.DEFAULT_TOPIC_CONFIG });
        });
        req.on('error', () => resolve({ ...topicBuilder_1.DEFAULT_TOPIC_CONFIG }));
    });
}
async function discoverDevice(ip) {
    const [{ activeFields, fantype }, { deviceId, appName }, xgpioConfig, topicConfig] = await Promise.all([
        fetchDeviceFields(ip),
        fetchDeviceId(ip),
        fetchXgpioConfig(ip),
        fetchTopicConfig(ip),
    ]);
    return {
        deviceId,
        appName,
        activeFields,
        topicConfig,
        xgpioConfig,
        ip,
        fantype,
    };
}
