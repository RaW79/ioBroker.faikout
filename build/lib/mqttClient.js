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
exports.FaikoutMqttClient = void 0;
const mqtt = __importStar(require("mqtt"));
const BACKOFF_INITIAL_MS = 1000;
const BACKOFF_MAX_MS = 60000;
class FaikoutMqttClient {
    constructor(options, onMessage, onConnectionChange) {
        this.client = null;
        this.subscriptions = new Set();
        this.reconnectDelay = BACKOFF_INITIAL_MS;
        this.reconnectTimer = null;
        this.intentionalDisconnect = false;
        this.options = options;
        this.onMessage = onMessage;
        this.onConnectionChange = onConnectionChange;
    }
    connect() {
        this.intentionalDisconnect = false;
        this._doConnect();
    }
    _doConnect() {
        const { host, port, username, password, clientId } = this.options;
        const connectOpts = {
            host,
            port,
            clientId,
            clean: true,
            reconnectPeriod: 0,
        };
        if (username) {
            connectOpts.username = username;
        }
        if (password) {
            connectOpts.password = password;
        }
        this.client = mqtt.connect(`mqtt://${host}:${port}`, connectOpts);
        this.client.on('connect', () => {
            this.reconnectDelay = BACKOFF_INITIAL_MS;
            this.onConnectionChange(true);
            for (const topic of this.subscriptions) {
                this.client?.subscribe(topic, { qos: 1 });
            }
        });
        this.client.on('message', (topic, payload) => {
            this.onMessage(topic, payload.toString());
        });
        this.client.on('error', (err) => {
            void err;
        });
        this.client.on('close', () => {
            this.onConnectionChange(false);
            if (!this.intentionalDisconnect) {
                this._scheduleReconnect();
            }
        });
        this.client.on('offline', () => {
            this.onConnectionChange(false);
        });
    }
    _scheduleReconnect() {
        if (this.reconnectTimer !== null) {
            return;
        }
        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            if (!this.intentionalDisconnect) {
                if (this.client) {
                    this.client.removeAllListeners();
                    this.client.end(true);
                    this.client = null;
                }
                this._doConnect();
                this.reconnectDelay = Math.min(this.reconnectDelay * 2, BACKOFF_MAX_MS);
            }
        }, this.reconnectDelay);
    }
    async disconnect() {
        this.intentionalDisconnect = true;
        if (this.reconnectTimer !== null) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        if (this.client) {
            await new Promise((resolve) => {
                this.client.end(false, {}, () => resolve());
            });
            this.client = null;
        }
        this.onConnectionChange(false);
    }
    subscribe(topic) {
        this.subscriptions.add(topic);
        if (this.client?.connected) {
            this.client.subscribe(topic, { qos: 1 });
        }
    }
    unsubscribe(topic) {
        this.subscriptions.delete(topic);
        if (this.client?.connected) {
            this.client.unsubscribe(topic);
        }
    }
    publish(topic, payload) {
        if (this.client?.connected) {
            this.client.publish(topic, payload, { qos: 0, retain: false });
        }
    }
    get connected() {
        return this.client?.connected ?? false;
    }
}
exports.FaikoutMqttClient = FaikoutMqttClient;
