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
        await this.initializeDomainModel();
        await this.reconcilitateDifferences();
        this.tearDown();
    }

    private tearDown(): void {
        this.backend.disconnect();
        this.logger.debug('tore down.');
    }

    private async reconcilitateDifferences(): Promise<void> {
        // tbd
    }

    private async initializeBackend(): Promise<void> {
        this.backend = new Backend(this.settings.backendConfiguration(), this.logger);
        await this.backend.connect();
        this.logger.debug('initialized backend');
    }

    private async initializeDomainModel() {
        const topic = this.connector.selectTopic(this.backend as ITopicService);
        this.domainModel = new DomainModel(this.backend);
        await this.domainModel.switchToTopic(topic);
        this.logger.debug('initialized domain model');
    }
}