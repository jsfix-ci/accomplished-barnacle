import { Logger } from 'sitka';
import { Application } from './Application';
import { Settings } from './Settings';

import { Connector } from './Connectors/Connector';
import { TrelloConnector } from './Connectors/Trello/TrelloConnector';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loggerConfig: any = {
    name: 'accomplished-barnacle', level: Logger.Level.ALL,
    format: '[%{LEVEL}] : %{MESSAGE}'
};
const logger = Logger.getLogger(loggerConfig);

const availableConnectors = new Map<string, Connector>();
availableConnectors.set('trello', new TrelloConnector());

const namesOfAvailableConnectors: string[] = [];
availableConnectors.forEach((_value, key) => namesOfAvailableConnectors.push(key));

const settings = new Settings(logger, namesOfAvailableConnectors);
settings.parseCommandLineArguments(process.argv);

const application = new Application(availableConnectors, logger);
application.run();
