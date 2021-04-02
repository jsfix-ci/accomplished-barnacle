import { StateModelCollection } from "outstanding-barnacle";
import { IObjectEventProcessor } from "../IObjectEventProcessor";

export abstract class StateModelDifferencesService {
    abstract reconciliate(stateModels: StateModelCollection, objectEventProcessor: IObjectEventProcessor): void;
}