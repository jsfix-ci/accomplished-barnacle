import { Logger } from 'sitka';
import { Backend } from '../Backend/Backend';
import { ITopicService } from '../Backend/ITopicService';
import { Connector } from './Connector';
import { ISettings } from '../TopLevelCommand/ISettings';
import { ConnectorSettings } from './ConnectorSettings';
import { DomainModel } from './DomainModel';
import { Topic } from 'choicest-barnacle';
import { DomainDifferences } from './DomainDifferences';
import { ConnectorFactory } from './ConnectorFactory';
import { GeneralSettings } from '../CommandLine/GeneralSettings';

export class ConnectorApplication {
    private logger: Logger;
    private backend: Backend;
    private connector: Connector;
    private settings: ISettings;
    private domainModel: DomainModel;
    private topic: Topic;
    private connectorFactory: ConnectorFactory;

    constructor(settings: ISettings, connectorFactory: ConnectorFactory, logger: Logger) {
        this.logger = logger;
        this.settings = settings;
        this.connectorFactory = connectorFactory;
    }

    public async run(): Promise<void> {
        this.initializeConnector();
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
        await this.connector.reconciliate(DomainDifferences.STATE_MODEL, this.topic, this.domainModel.getDomainModel(), this.domainModel, this.logger);
        await this.connector.reconciliate(DomainDifferences.PROJECTS, this.topic, this.domainModel.getDomainModel(), this.domainModel, this.logger);
        await this.connector.reconciliate(DomainDifferences.KANBANCARDS, this.topic, this.domainModel.getDomainModel(), this.domainModel, this.logger);
        await this.connector.reconciliate(DomainDifferences.CONTEXT, this.topic, this.domainModel.getDomainModel(), this.domainModel, this.logger);
        await this.backend.blockUntilBackendHasProcessedRequests();
    }

    private async initializeBackend(): Promise<void> {
        this.backend = new Backend(this.settings.valueOf(GeneralSettings.BACKEND_CONFIGURATION_FILE), this.logger);
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

    private initializeConnector() {
        this.connector = this.connectorFactory.initialize(this.settings.valueOf(ConnectorSettings.CONNECTOR_NAME),
            this.settings.valueOf(ConnectorSettings.CONNECTOR_FILE), this.logger);
    }
}