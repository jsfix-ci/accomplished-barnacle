import { Topic } from "choicest-barnacle";
import { ITopicService } from '../../Backend/ITopicService';
import { Connector } from '../Connector';
import { TrelloConfiguration } from './TrelloConfiguration';

export class TrelloConnector extends Connector {
    private configuration = new TrelloConfiguration();

    constructor() {
        super('trello');
        this.setConfiguration(this.configuration);
    }

    public selectTopic(topicService: ITopicService): Topic {
        return topicService.getAvailableTopics().find(topic => topic.id === this.configuration.topic());
    }
}