'use strict';

const path = require('path');
const { tests } = require('@iobroker/testing');

tests.packageFiles(path.join(__dirname, '..'), {
    additionalTests(packageJson, ioPackageJson) {
        const assert = require('assert');

        it('name follows iobroker naming convention', () => {
            assert.strictEqual(packageJson.name, 'iobroker.faikout-ac');
        });

        it('main points to build/src/main.js', () => {
            assert.strictEqual(packageJson.main, 'build/src/main.js');
        });

        it('mode is daemon', () => {
            assert.strictEqual(ioPackageJson.common.mode, 'daemon');
        });

        it('has native defaults', () => {
            assert.ok(ioPackageJson.native);
            assert.strictEqual(ioPackageJson.native.mqttHost, 'localhost');
            assert.strictEqual(ioPackageJson.native.mqttPort, 1883);
            assert.ok(Array.isArray(ioPackageJson.native.devices));
        });

        it('has encryptedNative and protectedNative for mqttPassword', () => {
            assert.ok(ioPackageJson.encryptedNative.includes('mqttPassword'));
            assert.ok(ioPackageJson.protectedNative.includes('mqttPassword'));
        });

        it('has instanceObjects with info.connection', () => {
            assert.ok(Array.isArray(ioPackageJson.instanceObjects));
            const conn = ioPackageJson.instanceObjects.find((o) => o._id === 'info.connection');
            assert.ok(conn);
            assert.strictEqual(conn.common.type, 'boolean');
        });

        it('package.json and io-package.json versions match', () => {
            assert.strictEqual(packageJson.version, ioPackageJson.common.version);
        });
    },
});
