// Topic builder for Faikout ioBroker adapter
// Ports buildTopicPaths() from faikout_alias_generator_en.js v0.4 exactly.
// Implements the RevK topic logic (revk.c revk_topic).

export interface TopicConfig {
    topiccommand: string;
    topicsetting: string;
    topicstate: string;
    prefixapp: boolean;
    prefixhost: boolean;
}

export interface TopicPaths {
    statusTopic: string;
    xgpioTopic: string;
    commandTopic: (suffix: string) => string;
    settingTopic: (suffix: string) => string;
    settingJsonTopic: string;
}

export function buildTopicPaths(
    deviceId: string,
    appName: string,
    topicConfig: TopicConfig,
): TopicPaths {
    const { topiccommand, topicsetting, topicstate, prefixapp, prefixhost } = topicConfig;

    function makeTopic(name: string | null, suffix: string | null): string {
        const parts: string[] = [];
        if (prefixhost) {
            if (prefixapp && appName) parts.push(appName);
            parts.push(deviceId);
            if (name) parts.push(name);
        } else {
            if (name) parts.push(name);
            if (prefixapp && appName) parts.push(appName);
            parts.push(deviceId);
        }
        if (suffix) parts.push(suffix);
        return parts.join('/');
    }

    return {
        statusTopic:      makeTopic(topicstate, 'status'),
        xgpioTopic:       makeTopic(topicstate, 'xgpio'),
        commandTopic:     (f: string) => makeTopic(topiccommand, f),
        settingTopic:     (f: string) => makeTopic(topicsetting, f),
        settingJsonTopic: makeTopic(topicsetting, null),
    };
}

export const DEFAULT_TOPIC_CONFIG: TopicConfig = {
    topiccommand: 'command',
    topicsetting: 'setting',
    topicstate: 'state',
    prefixapp: false,
    prefixhost: false,
};
