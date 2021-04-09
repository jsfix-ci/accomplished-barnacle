import { Logger } from 'sitka';
import { ConnectorCommand } from './Connectors/ConnectorCommand';
import { Settings } from './CommandLine/Settings';
import { ITopLevelCommand } from './TopLevelCommand/ITopLevelCommand';
import { GeneralSettings } from './CommandLine/GeneralSettings';

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
        const command: ITopLevelCommand = settings.getSelectedCommand();
        command.run(settings, logger);
    }
} catch (e) {
    console.log(e.message);
}
