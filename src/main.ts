import { Logger } from 'sitka';
import { Settings } from './CommandLine/Settings';
import { GeneralSettings } from './CommandLine/GeneralSettings';

import { ConnectorCommand } from './Connectors/ConnectorCommand';

try {
    const settings = new Settings();
    settings.add(new ConnectorCommand());
    const noProblems = settings.parseCommandLineArguments(process.argv);
    if (noProblems) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const loggerConfig: any = {
            name: 'accomplished-barnacle', level: settings.valueOf(GeneralSettings.LOG_LEVEL),
            format: '[%{LEVEL}] : %{MESSAGE}'
        };
        const logger = Logger.getLogger(loggerConfig);
        settings.getSelectedCommand().run(settings, logger);
    }
} catch (e) {
    console.log(e.message);
}
