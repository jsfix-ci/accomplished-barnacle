import { Topic } from 'choicest-barnacle';
import { Logger } from 'sitka';
import { ITopicService } from './ITopicService';

type BackendConfiguration = {
    endpoint: string
};

export class Backend implements ITopicService {
    private logger: Logger;
    private configuration: BackendConfiguration;

    constructor(configuration: BackendConfiguration, logger: Logger) {
        this.logger = logger;
        this.configuration = configuration;
    }

    public connect(): void {
        this.logger.info('connecting with backend at ' + this.configuration.endpoint);
    }

    public find(name: string): Topic {
        return new Topic(name, name);
    }

    public getAvailableTopics(): Topic[] {
        return [new Topic('dummy', 'dummy')];
    }
}