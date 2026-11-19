"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_TOPIC_CONFIG = void 0;
exports.buildTopicPaths = buildTopicPaths;
function buildTopicPaths(deviceId, appName, topicConfig) {
    const { topiccommand, topicsetting, topicstate, prefixapp, prefixhost } = topicConfig;
    function makeTopic(name, suffix) {
        const parts = [];
        if (prefixhost) {
            if (prefixapp && appName)
                parts.push(appName);
            parts.push(deviceId);
            if (name)
                parts.push(name);
        }
        else {
            if (name)
                parts.push(name);
            if (prefixapp && appName)
                parts.push(appName);
            parts.push(deviceId);
        }
        if (suffix)
            parts.push(suffix);
        return parts.join('/');
    }
    return {
        statusTopic: makeTopic(topicstate, 'status'),
        xgpioTopic: makeTopic(topicstate, 'xgpio'),
        commandTopic: (f) => makeTopic(topiccommand, f),
        settingTopic: (f) => makeTopic(topicsetting, f),
        settingJsonTopic: makeTopic(topicsetting, null),
    };
}
exports.DEFAULT_TOPIC_CONFIG = {
    topiccommand: 'command',
    topicsetting: 'setting',
    topicstate: 'state',
    prefixapp: false,
    prefixhost: false,
};
