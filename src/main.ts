import { Logger } from 'sitka';
import { Application } from './Application';
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

const application = new Application(availableConnectors, logger);
application.run();
