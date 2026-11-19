'use strict';

const assert = require('assert');
const path = require('path');

const pkgPath = path.join(__dirname, '..', 'package.json');
const ioPkgPath = path.join(__dirname, '..', 'io-package.json');

const pkg = require(pkgPath);
const ioPkg = require(ioPkgPath);

describe('package.json', () => {
    it('has required fields', () => {
        assert.ok(pkg.name, 'name missing');
        assert.ok(pkg.version, 'version missing');
        assert.ok(pkg.description, 'description missing');
        assert.ok(pkg.license, 'license missing');
        assert.ok(pkg.author, 'author missing');
        assert.ok(pkg.main, 'main missing');
        assert.ok(pkg.engines && pkg.engines.node, 'engines.node missing');
    });

    it('name follows iobroker naming convention', () => {
        assert.strictEqual(pkg.name, 'iobroker.faikout-ac', 'name must be iobroker.faikout-ac');
    });

    it('main points to build/src/main.js', () => {
        assert.strictEqual(pkg.main, 'build/src/main.js', 'main must be build/src/main.js');
    });
});

describe('io-package.json', () => {
    it('has required common fields', () => {
        assert.ok(ioPkg.common, 'common missing');
        assert.ok(ioPkg.common.name, 'common.name missing');
        assert.ok(ioPkg.common.version, 'common.version missing');
        assert.ok(ioPkg.common.title, 'common.title missing');
        assert.ok(ioPkg.common.desc, 'common.desc missing');
        assert.ok(ioPkg.common.mode, 'common.mode missing');
        assert.ok(ioPkg.common.license, 'common.license missing');
        assert.ok(ioPkg.common.icon, 'common.icon missing');
    });

    it('common.name is faikout-ac', () => {
        assert.strictEqual(ioPkg.common.name, 'faikout-ac', 'common.name must be faikout-ac');
    });

    it('mode is daemon', () => {
        assert.strictEqual(ioPkg.common.mode, 'daemon', 'mode must be daemon');
    });

    it('has native defaults', () => {
        assert.ok(ioPkg.native, 'native missing');
        assert.strictEqual(ioPkg.native.mqttHost, 'localhost', 'native.mqttHost default must be localhost');
        assert.strictEqual(ioPkg.native.mqttPort, 1883, 'native.mqttPort default must be 1883');
        assert.ok(Array.isArray(ioPkg.native.devices), 'native.devices must be an array');
    });

    it('has encryptedNative and protectedNative for mqttPassword', () => {
        assert.ok(ioPkg.encryptedNative.includes('mqttPassword'), 'mqttPassword must be in encryptedNative');
        assert.ok(ioPkg.protectedNative.includes('mqttPassword'), 'mqttPassword must be in protectedNative');
    });

    it('has instanceObjects with info.connection', () => {
        assert.ok(Array.isArray(ioPkg.instanceObjects), 'instanceObjects must be an array');
        const conn = ioPkg.instanceObjects.find((o) => o._id === 'info.connection');
        assert.ok(conn, 'info.connection instance object missing');
        assert.strictEqual(conn.common.type, 'boolean', 'info.connection type must be boolean');
    });
});

describe('version consistency', () => {
    it('package.json and io-package.json versions match', () => {
        assert.strictEqual(
            pkg.version,
            ioPkg.common.version,
            `Version mismatch: package.json=${pkg.version}, io-package.json=${ioPkg.common.version}`,
        );
    });
});
