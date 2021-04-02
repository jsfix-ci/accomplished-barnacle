import { Topic } from 'choicest-barnacle';

export interface ITopicService {
    getAvailableTopics(): Topic[];
}