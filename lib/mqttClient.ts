// MQTT client wrapper for Faikout ioBroker adapter
// Uses mqtt npm package v5.x API.
// Implements exponential backoff reconnect and subscription restore.

import * as mqtt from 'mqtt';

/**
 *
 */
export interface MqttClientOptions {
    /**
     *
     */
    host: string;
    /**
     *
     */
    port: number;
    /**
     *
     */
    username?: string;
    /**
     *
     */
    password?: string;
    /**
     *
     */
    clientId: string;
    /**
     *
     */
    setTimeoutFn: (callback: () => void, ms: number) => unknown;
    /**
     *
     */
    clearTimeoutFn: (id: unknown) => void;
}

type OnMessageCallback = (topic: string, payload: string) => void;
type OnConnectionChangeCallback = (connected: boolean) => void;

const BACKOFF_INITIAL_MS = 1000;
const BACKOFF_MAX_MS = 60000;

/**
 *
 */
export class FaikoutMqttClient {
    private readonly options: MqttClientOptions;
    private readonly onMessage: OnMessageCallback;
    private readonly onConnectionChange: OnConnectionChangeCallback;

    private client: mqtt.MqttClient | null = null;
    private subscriptions: Set<string> = new Set();
    private reconnectDelay = BACKOFF_INITIAL_MS;
    private reconnectTimer: unknown = null;
    private intentionalDisconnect = false;

    /**
     *
     */
    constructor(
        options: MqttClientOptions,
        onMessage: OnMessageCallback,
        onConnectionChange: OnConnectionChangeCallback,
    ) {
        this.options = options;
        this.onMessage = onMessage;
        this.onConnectionChange = onConnectionChange;
    }

    /**
     *
     */
    connect(): void {
        this.intentionalDisconnect = false;
        this._doConnect();
    }

    private _doConnect(): void {
        const { host, port, username, password, clientId } = this.options;

        const connectOpts: mqtt.IClientOptions = {
            host,
            port,
            clientId,
            clean: true,
            reconnectPeriod: 0, // We manage reconnect ourselves
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
            // Restore all subscriptions after (re)connect
            for (const topic of this.subscriptions) {
                this.client?.subscribe(topic, { qos: 1 });
            }
        });

        this.client.on('message', (topic: string, payload: Buffer) => {
            this.onMessage(topic, payload.toString());
        });

        this.client.on('error', (err: Error) => {
            // Error is logged by adapter; connection change handled in 'close'
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

    private _scheduleReconnect(): void {
        if (this.reconnectTimer !== null) {
            return;
        }
        this.reconnectTimer = this.options.setTimeoutFn(() => {
            this.reconnectTimer = null;
            if (!this.intentionalDisconnect) {
                // Destroy old client before reconnecting
                if (this.client) {
                    this.client.removeAllListeners();
                    this.client.end(true);
                    this.client = null;
                }
                this._doConnect();
                // Increase backoff (capped at max)
                this.reconnectDelay = Math.min(this.reconnectDelay * 2, BACKOFF_MAX_MS);
            }
        }, this.reconnectDelay);
    }

    /**
     *
     */
    async disconnect(): Promise<void> {
        this.intentionalDisconnect = true;
        if (this.reconnectTimer !== null) {
            this.options.clearTimeoutFn(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        if (this.client) {
            await new Promise<void>((resolve) => {
                this.client!.end(false, {}, () => resolve());
            });
            this.client = null;
        }
        this.onConnectionChange(false);
    }

    /**
     *
     */
    subscribe(topic: string): void {
        this.subscriptions.add(topic);
        if (this.client?.connected) {
            this.client.subscribe(topic, { qos: 1 });
        }
    }

    /**
     *
     */
    unsubscribe(topic: string): void {
        this.subscriptions.delete(topic);
        if (this.client?.connected) {
            this.client.unsubscribe(topic);
        }
    }

    /**
     *
     */
    publish(topic: string, payload: string): void {
        if (this.client?.connected) {
            this.client.publish(topic, payload, { qos: 0, retain: false });
        }
    }

    /**
     *
     */
    get connected(): boolean {
        return this.client?.connected ?? false;
    }
}
