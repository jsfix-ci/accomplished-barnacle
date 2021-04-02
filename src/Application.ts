import { Logger } from 'sitka';
import { Backend } from './Backend/Backend';
import { ITopicService } from './Backend/ITopicService';
import { Connector } from './Connectors/Connector';
import { ISettings } from './ISettings';

export class Application {
    private logger: Logger;
    private backend: Backend;
    private topicService: ITopicService;
    private current: Connector;
    private settings: ISettings;

    constructor(settings: ISettings, logger: Logger) {
        this.logger = logger;
        this.settings = settings;
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
        this.backend = new Backend(this.settings.backendConfiguration(), this.logger);
        this.topicService = this.backend;
        await this.backend.connect();

        this.current = this.settings.selectedConnector();
        this.logger.info('initialized.');
    }
}