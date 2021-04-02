import { Topic } from 'choicest-barnacle';
import { Logger } from 'sitka';
import { ITopicService } from './ITopicService';
import { HttpClient } from './HttpClient';
import { Client, EventSourceFactory } from 'prime-barnacle';

type BackendConfiguration = {
    endpoint: string
};

export class Backend implements ITopicService {
    private logger: Logger;
    private configuration: BackendConfiguration;
    private client: Client;
    private topics: Topic[] = [];

    constructor(configuration: BackendConfiguration, logger: Logger) {
        this.logger = logger;
        this.configuration = configuration;
    }

    public connect(): void {
        this.logger.info('connecting with backend at ' + this.configuration.endpoint);
        this.client = new Client(this.configuration.endpoint, new EventSourceFactory(), new HttpClient());
        // connect to    readonly publishedTopics: Observable<Topic>;
        this.client.getAllTopics();
    }

    public getAvailableTopics(): Topic[] {
        return [...this.topics];
    }
}