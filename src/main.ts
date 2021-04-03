import { Logger } from 'sitka';
import { Application } from './Application';
import { SettingsFactory } from './CommandLine/SettingsFactory';

import { ConnectorFactory } from './Connectors/ConnectorFactory';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loggerConfig: any = {
    name: 'accomplished-barnacle', level: Logger.Level.INFO,
    format: '[%{LEVEL}] : %{MESSAGE}'
};
const logger = Logger.getLogger(loggerConfig);

const connectorFactory = new ConnectorFactory();
const settings = SettingsFactory.generate(logger, connectorFactory);

try {
    const noProblems = settings.parseCommandLineArguments(process.argv);
    if (noProblems) {
        const application = new Application(settings, connectorFactory, logger);
        application.run();
    }

} catch (e) {
    console.log(e.message);
}
