import { Logger } from 'sitka';
import { Backend } from './Backend/Backend';
import { ITopicService } from './Backend/ITopicService';
import { Connector } from './Connectors/Connector';
import { ConfigurationFileReader } from './ConfigurationFileReader';

export class Application {
    private logger: Logger;
    private backend: Backend;
    private topicService: ITopicService;
    private connectors: Map<string, Connector>;
    private current: Connector;

    constructor(connectors: Map<string, Connector>, logger: Logger) {
        this.logger = logger;
        this.connectors = connectors;
        this.current = this.connectors.get('trello');
    }

    public async run(): Promise<void> {
        await this.initialize();
        this.logger.info('started.');
        this.tearDown();
    }

    private tearDown(): void {
        this.backend.disconnect();
        this.logger.info('tore down.');
    }

    private async initialize(): Promise<void> {
        const configurationFileReader = new ConfigurationFileReader(this.logger);
        const defaultBackendConfigurationFile = './backend.json';
        const backendConfiguration = configurationFileReader.read(defaultBackendConfigurationFile);

        this.backend = new Backend(backendConfiguration, this.logger);
        this.topicService = this.backend;
        await this.backend.connect();
        this.logger.info('initialized.');
    }
}