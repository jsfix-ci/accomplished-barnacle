import { Topic } from "choicest-barnacle";
import { HeijunkaBoard } from "outstanding-barnacle";
import { IObjectEventProcessor } from "../../IObjectEventProcessor";
import { TrelloConfiguration } from "./TrelloConfiguration";
import { ProjectDifferencesService } from "../ProjectDifferencesService";

export class TrelloProjectDifferencesService extends ProjectDifferencesService {
    private configuration: TrelloConfiguration;

    constructor(configuration: TrelloConfiguration) {
        super();
        this.configuration = configuration;
    }

    public reconciliate(topic: Topic, board: HeijunkaBoard, objectEventProcessor: IObjectEventProcessor): void {
        // TBD
    }
}