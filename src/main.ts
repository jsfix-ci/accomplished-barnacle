import { Logger } from 'sitka';
import { Application } from './Application';
import { Settings } from './CommandLine/Settings';

import { ConnectorFactory } from './Connectors/ConnectorFactory';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loggerConfig: any = {
    name: 'accomplished-barnacle', level: Logger.Level.INFO,
    format: '[%{LEVEL}] : %{MESSAGE}'
};
const logger = Logger.getLogger(loggerConfig);

try {
    const settings = new Settings(logger, new ConnectorFactory());
    const noProblems = settings.parseCommandLineArguments(process.argv);
    if (noProblems) {
        const application = new Application(settings, logger);
        application.run();
    }

} catch (e) {
    console.log(e.message);
}