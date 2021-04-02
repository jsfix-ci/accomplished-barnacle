import { Logger } from 'sitka';
import { Backend } from './Backend/Backend';
import { ITopicService } from './Backend/ITopicService';
import { ConfigurationFileReader } from './ConfigurationFileReader';

export class Application {
    private logger: Logger;
    private backend: Backend;
    private topicService: ITopicService;

    constructor(logger: Logger) {
        this.logger = logger;
    }

    public run(): void {
        this.initializeBackend();
        this.initializeTopicService();
        this.logger.info('started.');
    }

    private initializeBackend(): void {
        const configurationFileReader = new ConfigurationFileReader(this.logger);
        const defaultBackendConfigurationFile = './backend.json';
        const backendConfiguration = configurationFileReader.read(defaultBackendConfigurationFile);

        this.backend = new Backend(backendConfiguration, this.logger);
        this.backend.connect();
    }

    private initializeTopicService() {
        this.topicService = this.backend;
        this.logger.info('available topics are: ');
        this.topicService.getAvailableTopics().forEach(topic => {
            this.logger.info(topic.id + ': ' + topic.name);
        })
    }
}