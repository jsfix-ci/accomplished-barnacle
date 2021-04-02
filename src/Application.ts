import { Logger } from 'sitka';
import { Backend } from './Backend';
import { ConfigurationFileReader } from './ConfigurationFileReader';

export class Application {
    private logger: Logger;
    private backend: Backend;

    constructor(logger: Logger) {
        this.logger = logger;
    }

    public run(): void {
        this.initializeBackend();
        this.logger.info('started');
    }

    private initializeBackend(): void {
        const configurationFileReader = new ConfigurationFileReader(this.logger);
        const defaultBackendConfigurationFile = './backend.json';
        const backendConfiguration = configurationFileReader.read(defaultBackendConfigurationFile);

        this.backend = new Backend(backendConfiguration, this.logger);
    }
}