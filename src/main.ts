import { Logger } from 'sitka';
import { Application } from './Application';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loggerConfig: any = {
    name: 'accomplished-barnacle', level: Logger.Level.ALL,
    format: '[%{TIMESTAMP}] [%{LEVEL}] : %{MESSAGE}'
};
const logger = Logger.getLogger(loggerConfig);

const application = new Application(logger);
application.run();
