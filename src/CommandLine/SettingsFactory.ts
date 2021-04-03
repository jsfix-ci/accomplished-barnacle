import { Logger } from 'sitka';
import { FileNameParameter } from './FileNameParameter';
import { LogLevelParameter } from './LogLevelParameter';
import { ConnectorNameParameter } from './ConnectorNameParameter';

import { SettingKey } from "./ISettings";
import { Settings } from "./Settings";
import { ConnectorFactory } from '../Connectors/ConnectorFactory';

export class SettingsFactory {
    public static generate(logger: Logger, connectorFactory: ConnectorFactory): Settings {
        const settings = new Settings();

        settings.add(SettingKey.CONNECTOR_NAME, new ConnectorNameParameter(logger, 'connector', 'connector name', true, connectorFactory));
        settings.add(SettingKey.CONNECTOR_FILE, new FileNameParameter(logger, 'connector-config', 'connector configuration file', false));
        settings.add(SettingKey.BACKEND_CONFIGURATION_FILE, new FileNameParameter(logger, 'backend', 'backend configuration file', false, './backend.json'));
        settings.add(SettingKey.LOG_LEVEL, new LogLevelParameter(logger, 'log-level', 'level of log', false));
        return settings;
    }
}