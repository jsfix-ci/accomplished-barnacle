import { Topic } from "choicest-barnacle";
import { ITopicService } from '../../Backend/ITopicService';
import { Connector } from '../Connector';
import { TrelloConfiguration } from './TrelloConfiguration';
import { TrelloStateModelDifferencesService } from "./TrelloStateModelDifferencesService";
import { TrelloProjectDifferencesService } from "./TrelloProjectDifferencesService";
import { DomainDifferences } from "../DomainDifferences";
import { TrelloKanbanCardDifferencesService } from "./TrelloKanbanCardDifferencesService";
import { TrelloContextDifferencesService } from './TrelloContextDifferencesService';

export class TrelloConnector extends Connector {
    public static readonly connectorName = 'trello';

    private configuration = new TrelloConfiguration();

    constructor() {
        super();
        this.setConfiguration(this.configuration);
        this.setDifferencesService(DomainDifferences.STATE_MODEL, new TrelloStateModelDifferencesService(this.configuration));
        this.setDifferencesService(DomainDifferences.PROJECTS, new TrelloProjectDifferencesService(this.configuration));
        this.setDifferencesService(DomainDifferences.KANBANCARDS, new TrelloKanbanCardDifferencesService(this.configuration));
        this.setDifferencesService(DomainDifferences.CONTEXT, new TrelloContextDifferencesService(this.configuration));
    }

    public selectTopic(topicService: ITopicService): Topic {
        return topicService.getAvailableTopics().find(topic => topic.id === this.configuration.topic());
    }
}