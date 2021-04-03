export enum SettingKey {
    BACKEND_CONFIGURATION_FILE = 'BACKEND_CONFIGURATION_FILE',
    CONNECTOR_NAME = 'CONNECTOR_NAME',
    CONNECTOR_FILE = 'CONNECTOR_FILE',
    LOG_LEVEL = 'LOG_LEVEL'
}

export interface ISettings {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    valueOf(settingKey: SettingKey): any;
}