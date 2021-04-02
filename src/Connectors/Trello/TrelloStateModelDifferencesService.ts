import { StateModelCollection } from "outstanding-barnacle";
import { IObjectEventProcessor } from "../../IObjectEventProcessor";
import { StateModelDifferencesService } from "../StateModelDifferencesService";
import { TrelloConfiguration } from "./TrelloConfiguration";

export class TrelloStateModelDifferencesService extends StateModelDifferencesService {
    private configuration: TrelloConfiguration;

    constructor(configuration: TrelloConfiguration) {
        super();
        this.configuration = configuration;
    }

    reconciliate(stateModels: StateModelCollection, objectEventProcessor: IObjectEventProcessor): void {
        throw new Error("Method not implemented.");
    }
}