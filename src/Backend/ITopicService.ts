import { Topic } from 'choicest-barnacle';

export interface ITopicService {
    find(name: string): Topic | undefined;
    getAvailableTopics(): Topic[];
}