// Device discovery for Faikout ioBroker adapter
// Ports all 4 HTTP fetch functions from faikout_alias_generator_en.js v0.4.
// Uses built-in Node.js http module (no axios).

import * as http from 'node:http';
import { FIELDS, FIELD_WHITELIST } from './fieldDefinitions';
import type { TopicConfig } from './topicBuilder';
import { DEFAULT_TOPIC_CONFIG } from './topicBuilder';

/**
 *
 */
export interface XgpioPin {
    /**
     *
     */
    set: boolean;
    /**
     *
     */
    out: boolean;
    /**
     *
     */
    pwm: boolean;
    /**
     *
     */
    adc: boolean;
    /**
     *
     */
    name: string;
}

/**
 *
 */
export interface DeviceProfile {
    /**
     *
     */
    deviceId: string;
    /**
     *
     */
    appName: string;
    /**
     *
     */
    activeFields: Set<string>;
    /**
     *
     */
    topicConfig: TopicConfig;
    /**
     *
     */
    xgpioConfig: XgpioPin[];
    /**
     *
     */
    ip: string;
    /**
     *
     */
    fantype: number;
}

function fetchPage(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
            let html = '';
            res.on('data', (chunk: Buffer) => {
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

// Step 1: Fetch active fields from device root page + extras page
// Ports fetchDeviceFields() from generator
async function fetchDeviceFields(ip: string): Promise<{ activeFields: Set<string>; fantype: number }> {
    const [mainHtml, extrasHtml] = await Promise.all([
        fetchPage(`http://${ip}/`),
        fetchPage(`http://${ip}/revk-settings?_page=-2`),
    ]);

    const matches = mainHtml.match(/\bo\.([a-zA-Z]\w*)\b/g) ?? [];
    // Device HTML uses lowercase field names; restore exact FIELDS key casing
    // (e.g. 'whheating' from HTML → 'Whheating' as defined in FIELDS)
    const fieldsKeyMap = new Map(Object.keys(FIELDS).map((k) => [k.toLowerCase(), k]));
    const found = new Set(
        matches.map((m: string) => {
            const lower = m.slice(2).toLowerCase();
            return fieldsKeyMap.get(lower) ?? lower;
        }),
    );

    // Remove disabled optional features (must run before BLE expansion)
    for (const key of Object.keys(FIELDS)) {
        const disabled = new RegExp(`id="no${key}"[^>]*checked`, 'i').test(extrasHtml);
        if (disabled) {
            found.delete(key);
        }
    }

    // BLE: add ble sub-fields only if ble is still active after extras check
    if (found.has('ble')) {
        found.add('ble_temp');
        found.add('ble_hum');
        found.add('ble_bat');
        found.add('ble_volt');
    }

    // Always add whitelist fields
    for (const f of FIELD_WHITELIST) {
        found.add(f);
    }

    // Extract fantype from fantype select (page=-2, already fetched)
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

// Step 2: Fetch device ID and app name from settings page
// Ports fetchDeviceId() from generator
function fetchDeviceId(ip: string): Promise<{ deviceId: string; appName: string }> {
    return new Promise((resolve, reject) => {
        const req = http.get(`http://${ip}/revk-settings?_page=0`, (res) => {
            let html = '';
            res.on('data', (chunk: Buffer) => {
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

// Step 2b: Fetch xgpio configuration (OLA GPIO mod, page 1)
// Ports fetchXgpioConfig() from generator
function fetchXgpioConfig(ip: string): Promise<XgpioPin[]> {
    const emptyConfig = (): XgpioPin[] =>
        Array.from({ length: 5 }, () => ({ set: false, out: false, pwm: false, adc: false, name: '' }));

    return new Promise((resolve) => {
        const req = http.get(`http://${ip}/revk-settings?_page=1`, (res) => {
            let html = '';
            res.on('data', (chunk: Buffer) => {
                html += chunk.toString();
            });
            res.on('end', () => {
                const config: XgpioPin[] = [];
                for (let n = 1; n <= 5; n++) {
                    const valM =
                        html.match(new RegExp(`id="xgpio${n}"[^>]*value="([^"]*)"`)) ??
                        html.match(new RegExp(`value="([^"]*)"[^>]*id="xgpio${n}"`));
                    const gpioVal = valM ? valM[1].trim() : '';
                    const set = gpioVal !== '' && gpioVal !== '0';
                    const out = new RegExp(`id="xgpio${n}out"[^>]*checked`).test(html);
                    const pwm = new RegExp(`id="xgpio${n}pwm"[^>]*checked`).test(html);
                    const adc = new RegExp(`id="xgpio${n}adc"[^>]*checked`).test(html);
                    const nameM =
                        html.match(new RegExp(`id="xgpio${n}name"[^>]*value="([^"]*)"`)) ??
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

// Step 2c: Fetch MQTT topic configuration from device (page -3)
// Ports fetchTopicConfig() from generator
function fetchTopicConfig(ip: string): Promise<TopicConfig> {
    return new Promise((resolve) => {
        const req = http.get(`http://${ip}/revk-settings?_page=-3`, (res) => {
            let html = '';
            res.on('data', (chunk: Buffer) => {
                html += chunk.toString();
            });
            res.on('end', () => {
                function val(id: string): string | null {
                    const m =
                        html.match(new RegExp(`id="${id}"[^>]*value="([^"]*)"`)) ??
                        html.match(new RegExp(`value="([^"]*)"[^>]*id="${id}"`));
                    return m ? m[1].trim() : null;
                }
                const topiccommand = val('topiccommand') ?? DEFAULT_TOPIC_CONFIG.topiccommand;
                const topicsetting = val('topicsetting') ?? DEFAULT_TOPIC_CONFIG.topicsetting;
                const topicstate = val('topicstate') ?? DEFAULT_TOPIC_CONFIG.topicstate;
                const prefixapp = new RegExp('id="prefixapp"[^>]*checked').test(html);
                const prefixhost = new RegExp('id="prefixhost"[^>]*checked').test(html);
                resolve({ topiccommand, topicsetting, topicstate, prefixapp, prefixhost });
            });
        });
        req.setTimeout(6000, () => {
            req.destroy();
            resolve({ ...DEFAULT_TOPIC_CONFIG });
        });
        req.on('error', () => resolve({ ...DEFAULT_TOPIC_CONFIG }));
    });
}

// Main discovery function: runs all 4 fetches in parallel, returns DeviceProfile
/**
 *
 */
export async function discoverDevice(ip: string): Promise<DeviceProfile> {
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
