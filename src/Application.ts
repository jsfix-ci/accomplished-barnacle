import { Logger } from 'sitka';
import { Backend } from './Backend/Backend';
import { ITopicService } from './Backend/ITopicService';
import { Connector } from './Connectors/Connector';
import { ISettings } from './ISettings';
import { DomainModel } from './DomainModel/DomainModel';

export class Application {
    private logger: Logger;
    private backend: Backend;
    private connector: Connector;
    private settings: ISettings;
    private domainModel: DomainModel;

    constructor(settings: ISettings, logger: Logger) {
        this.logger = logger;
        this.settings = settings;
    }

    public async run(): Promise<void> {
        this.connector = this.settings.selectedConnector();
        await this.initializeBackend();
        this.initializeDomainModel();
        this.tearDown();
    }

    private tearDown(): void {
        this.backend.disconnect();
        this.logger.info('tore down.');
    }

    private async initializeBackend(): Promise<void> {
        this.backend = new Backend(this.settings.backendConfiguration(), this.logger);
        await this.backend.connect();
        this.logger.info('initialized backend');
    }

    private initializeDomainModel() {
        const topic = this.connector.selectTopic(this.backend as ITopicService);
        this.domainModel = new DomainModel(topic, this.backend);
        this.logger.info('initialized domain model');
    }
}