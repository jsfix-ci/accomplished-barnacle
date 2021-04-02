import { Topic } from "choicest-barnacle";
import { HeijunkaBoard } from "outstanding-barnacle";
import { IObjectEventProcessor } from "../IObjectEventProcessor";

export abstract class ProjectDifferencesService {
    abstract reconciliate(topic: Topic, board: HeijunkaBoard, objectEventProcessor: IObjectEventProcessor): void;
}