import { Topic } from "choicest-barnacle";
import { ITopicService } from '../../Backend/ITopicService';
import { Connector } from '../Connector';
import { StateModelDifferencesService } from "../StateModelDifferencesService";
import { ProjectDifferencesService } from "../ProjectDifferencesService";
import { TrelloConfiguration } from './TrelloConfiguration';
import { TrelloStateModelDifferencesService } from "./TrelloStateModelDifferencesService";
import { TrelloProjectDifferencesService } from "./TrelloProjectDifferencesService";

export class TrelloConnector extends Connector {
    private configuration = new TrelloConfiguration();
    private stateModelDifferencesService: StateModelDifferencesService;
    private projectDifferencesService: ProjectDifferencesService;

    constructor() {
        super('trello');
        this.setConfiguration(this.configuration);
        this.stateModelDifferencesService = new TrelloStateModelDifferencesService(this.configuration);
        this.projectDifferencesService = new TrelloProjectDifferencesService(this.configuration);
        this.setStateModelDifferencesService(this.stateModelDifferencesService);
        this.setProjectDifferencesService(this.projectDifferencesService);
    }

    public selectTopic(topicService: ITopicService): Topic {
        return topicService.getAvailableTopics().find(topic => topic.id === this.configuration.topic());
    }
}