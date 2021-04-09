import { Logger } from 'sitka';
import { ConnectorApplication } from './Connectors/ConnectorApplication';
import { SettingKey } from './CommandLine/ISettings';
import { SettingsFactory } from './CommandLine/SettingsFactory';
import { ConnectorFactory } from './Connectors/ConnectorFactory';
import { ConnectorCommand } from './Connectors/ConnectorCommand';

try {
    const connectorFactory = new ConnectorFactory();
    const settings = SettingsFactory.generate(connectorFactory);
    settings.addCommand(new ConnectorCommand());
    const noProblems = settings.parseCommandLineArguments(process.argv);
    if (noProblems) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const loggerConfig: any = {
            name: 'accomplished-barnacle', level: settings.valueOf(SettingKey.LOG_LEVEL),
            format: '[%{LEVEL}] : %{MESSAGE}'
        };
        const logger = Logger.getLogger(loggerConfig);

        const application = new ConnectorApplication(settings, connectorFactory, logger);
        application.run();
    }
} catch (e) {
    console.log(e.message);
}
