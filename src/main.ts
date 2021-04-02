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

const settings = new Settings(logger);
settings.parseCommandLineArguments(process.argv);

const availableConnectors = new Map<string, Connector>();
availableConnectors.set('trello', new TrelloConnector());

const application = new Application(availableConnectors, logger);
application.run();
