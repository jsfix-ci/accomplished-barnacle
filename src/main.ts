import { Logger } from 'sitka';
import { Backend } from './Backend';
import { ConfigurationFileReader } from './ConfigurationFileReader';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loggerConfig: any = { name: 'accomplished-barnacle', level: Logger.Level.ALL };
const logger = Logger.getLogger(loggerConfig);
logger.info('started');

const configurationFileReader = new ConfigurationFileReader(logger);

const defaultBackendConfigurationFile = '../backend.json';
const backendConfiguration = configurationFileReader.read(defaultBackendConfigurationFile);

const backend = new Backend(backendConfiguration, logger);

