import { Topic } from "choicest-barnacle";
import { Logger } from 'sitka';
import { StateModelCollection } from "outstanding-barnacle";
import { IObjectEventProcessor } from "../IObjectEventProcessor";

export abstract class StateModelDifferencesService {
    abstract reconciliate(topic: Topic, stateModels: StateModelCollection, objectEventProcessor: IObjectEventProcessor, logger: Logger): void;
}