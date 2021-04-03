import { Topic } from "choicest-barnacle";
import { ITopicService } from '../../Backend/ITopicService';
import { Connector } from '../Connector';
import { TrelloConfiguration } from './TrelloConfiguration';
import { TrelloStateModelDifferencesService } from "./TrelloStateModelDifferencesService";
import { TrelloProjectDifferencesService } from "./TrelloProjectDifferencesService";
import { DomainDifferences } from "../DomainDifferences";

export class TrelloConnector extends Connector {
    private configuration = new TrelloConfiguration();

    constructor() {
        super('trello');
        this.setConfiguration(this.configuration);
        this.setDifferencesService(DomainDifferences.STATE_MODEL, new TrelloStateModelDifferencesService(this.configuration));
        this.setDifferencesService(DomainDifferences.PROJECTS, new TrelloProjectDifferencesService(this.configuration));
    }

    public selectTopic(topicService: ITopicService): Topic {
        return topicService.getAvailableTopics().find(topic => topic.id === this.configuration.topic());
    }
}