import { Logger } from 'sitka';
import { Backend } from './Backend';
import { existsSync, readFileSync } from 'fs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loggerConfig: any = { name: 'accomplished-barnacle', level: Logger.Level.ALL };
const logger = Logger.getLogger(loggerConfig);
logger.info('started');

const backendConfigurationFile = '../backend.json';
let backendConfiguration = {};
if (existsSync(backendConfigurationFile)) {
    const rawConfig = readFileSync(backendConfigurationFile, 'utf8');
    backendConfiguration = JSON.parse(rawConfig);
}

const backend = new Backend(backendConfiguration, logger);

