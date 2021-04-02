import { Topic } from "choicest-barnacle";
import { ITopicService } from '../../Backend/ITopicService';
import { Connector } from '../Connector';
import { StateModelDifferencesService } from "../StateModelDifferencesService";
import { TrelloConfiguration } from './TrelloConfiguration';
import { TrelloStateModelDifferencesService } from "./TrelloStateModelDifferencesService";

export class TrelloConnector extends Connector {
    private configuration = new TrelloConfiguration();
    private stateModelDifferencesService: StateModelDifferencesService;

    constructor() {
        super('trello');
        this.setConfiguration(this.configuration);
        this.stateModelDifferencesService = new TrelloStateModelDifferencesService(this.configuration);
        this.setStateModelDifferencesService(this.stateModelDifferencesService);
    }

    public selectTopic(topicService: ITopicService): Topic {
        return topicService.getAvailableTopics().find(topic => topic.id === this.configuration.topic());
    }
}