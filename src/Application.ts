import { Logger } from 'sitka';
import { Backend } from './Backend/Backend';
import { ITopicService } from './Backend/ITopicService';
import { Connector } from './Connectors/Connector';
import { ISettings } from './ISettings';
import { DomainModel } from './DomainModel';
import { Topic } from 'choicest-barnacle';

export class Application {
    private logger: Logger;
    private backend: Backend;
    private connector: Connector;
    private settings: ISettings;
    private domainModel: DomainModel;
    private topic: Topic;

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
        this.connector.reconcilitateStateModel(this.topic, this.domainModel.getDomainModel().stateModels, this.domainModel);
        this.connector.reconcilitateProjects(this.topic, this.domainModel.getDomainModel(), this.domainModel);
        await this.backend.blockUntilBackendHasProcessedRequests();
    }

    private async initializeBackend(): Promise<void> {
        this.backend = new Backend(this.settings.backendConfiguration(), this.logger);
        this.backend.connect();
        await this.backend.blockUntilBackendHasProcessedRequests();
        this.logger.debug('initialized backend');
    }

    private async initializeDomainModel() {
        this.topic = this.connector.selectTopic(this.backend as ITopicService);
        this.domainModel = new DomainModel(this.backend);
        await this.domainModel.switchToTopic(this.topic);
        this.logger.debug('initialized domain model');
    }
}