import { Logger } from 'sitka';
import { Application } from './Application';
import { Settings } from './Settings';

import { Connector } from './Connectors/Connector';
import { AllConnectors } from './Connectors/AllConnectors';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loggerConfig: any = {
    name: 'accomplished-barnacle', level: Logger.Level.ALL,
    format: '[%{LEVEL}] : %{MESSAGE}'
};
const logger = Logger.getLogger(loggerConfig);

const namesOfAvailableConnectors: string[] = [];
const availableConnectors = new Map<string, Connector>();
AllConnectors.allConnectors().forEach(connector => {
    availableConnectors.set(connector.name(), connector);
    namesOfAvailableConnectors.push(connector.name());
})

const settings = new Settings(logger, namesOfAvailableConnectors);
settings.parseCommandLineArguments(process.argv);

const application = new Application(availableConnectors, settings, logger);
application.run();
