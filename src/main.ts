import { Logger } from 'sitka';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loggerConfig: any = {name: 'accomplished-barnacle',level: Logger.Level.ALL};
const logger = Logger.getLogger(loggerConfig);
logger.info('started');
