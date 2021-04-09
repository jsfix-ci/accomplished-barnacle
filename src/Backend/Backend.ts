import { ObjectEvent, Topic } from 'choicest-barnacle';
import { Logger } from 'sitka';
import { ITopicService } from './ITopicService';
import { HttpClient } from './HttpClient';
import { Client } from 'prime-barnacle';
import { EventSourceFactory } from './EventSourceFactory';
import { Observable, Subscription } from 'rxjs';
import { ConfigurationFileReader } from '../CommandLine/ConfigurationFileReader';
import { ISettings } from '../TopLevelCommand/ISettings';
import { GeneralSettings } from '../CommandLine/GeneralSettings';

type BackendConfiguration = {
    endpoint: string
};

export class Backend implements ITopicService {
    private logger: Logger;
    private configuration: BackendConfiguration;
    private client: Client;
    private topics: Topic[] = [];
    private newTopicStream: Subscription = undefined;

    constructor(backendConfigurationFile: string, logger: Logger) {
        this.logger = logger;
        const configurationFileReader = new ConfigurationFileReader(logger);
        this.configuration = configurationFileReader.read(backendConfigurationFile);
    }

    public static async initializeBackend(settings: ISettings, logger: Logger): Promise<Backend> {
        const backend = new Backend(settings.valueOf(GeneralSettings.BACKEND_CONFIGURATION_FILE), logger);
        backend.connect();
        await backend.blockUntilBackendHasProcessedRequests();
        logger.debug('initialized backend');
        return backend;
    }

    public connect(): void {
        this.logger.debug('connecting with backend at ' + this.configuration.endpoint);
        this.client = new Client(this.configuration.endpoint, new EventSourceFactory(), new HttpClient(this.logger, false));
        this.connectWithTopics();
    }

    public async blockUntilBackendHasProcessedRequests(): Promise<void> {
        let timeout = undefined;
        while (this.client.hasPendingRequests()) {
            await new Promise(r => timeout = setTimeout(r, 100));
            clearTimeout(timeout);
            timeout = undefined;
        }
    }

    public hasPendingRequests(): boolean {
        return this.client.hasPendingRequests();
    }

    public getObjectEvents(): Observable<ObjectEvent> {
        return this.client.publishedObjectEvents;
    }

    public switchToTopic(topic: Topic): void {
        this.client.switchToTopic(topic);
    }

    public storeObjectEvent(objectEvent: ObjectEvent): void {
        this.client.storeObjectEvent(objectEvent);
    }

    public disconnect(): void {
        this.logger.debug('disconnecting from backend at ' + this.configuration.endpoint);
        this.disconnectWithTopics();
        this.client.disconnect();
    }

    public getAvailableTopics(): Topic[] {
        return [...this.topics];
    }

    private connectWithTopics(): void {
        if (this.newTopicStream !== undefined) {
            this.disconnectWithTopics();
        }
        this.newTopicStream = this.client.publishedTopics.subscribe((topic: Topic) => {
            this.topics.push(topic);
        });
        this.client.getAllTopics();
    }

    private disconnectWithTopics(): void {
        if (this.newTopicStream === undefined) {
            return;
        }
        this.newTopicStream.unsubscribe();
        this.newTopicStream = undefined;
    }
}