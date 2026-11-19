import React from 'react';
declare function DemandChart(props: any): React.DetailedReactHTMLElement<{
    style: {
        padding: string;
        color: "#888";
        fontStyle: "italic";
        fontSize: string;
    };
}, HTMLElement> | React.DetailedReactHTMLElement<{
    style: {
        margin: string;
    };
}, HTMLElement>;
declare function GuardStatus(props: any): React.DetailedReactHTMLElement<{
    style: {
        fontSize: string;
        color: "#888";
        fontStyle: "italic";
        padding: string;
    };
}, HTMLElement> | React.DetailedReactHTMLElement<{
    style: {
        fontSize: string;
        margin: string;
        display: "flex";
        alignItems: "flex-start";
        gap: string;
        flexWrap: "wrap";
    };
}, HTMLElement>;
declare function DemandTabs(props: any): React.DetailedReactHTMLElement<{
    style: {
        fontSize: string;
    };
}, HTMLElement>;
declare function EnvSensorConfig(props: any): React.DetailedReactHTMLElement<{
    style: {
        fontSize: string;
        maxWidth: string;
    };
}, HTMLElement>;
declare function ScheduleConfig(props: any): React.DetailedReactHTMLElement<{
    style: {
        fontSize: string;
    };
}, HTMLElement>;
declare function HumidityTabs(props: any): React.DetailedReactHTMLElement<{
    style: {
        fontSize: string;
    };
}, HTMLElement>;
declare const _default: {
    DemandTabs: typeof DemandTabs;
    DemandChart: typeof DemandChart;
    GuardStatus: typeof GuardStatus;
    EnvSensorConfig: typeof EnvSensorConfig;
    ScheduleConfig: typeof ScheduleConfig;
    HumidityTabs: typeof HumidityTabs;
};
export default _default;
