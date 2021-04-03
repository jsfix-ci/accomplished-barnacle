import { Topic } from "choicest-barnacle";
import { Logger } from 'sitka';
import { HeijunkaBoard, ProjectEventFactory } from "outstanding-barnacle";
import { IObjectEventProcessor } from "../../IObjectEventProcessor";
import { TrelloConfiguration, TrelloBoardResponse } from "./TrelloConfiguration";
import { DifferencesService } from "../DifferencesService";
import { HttpClient } from "../../Backend/HttpClient";

export class TrelloProjectDifferencesService extends DifferencesService {
    private configuration: TrelloConfiguration;

    constructor(configuration: TrelloConfiguration) {
        super();
        this.configuration = configuration;
    }

    public reconciliate(topic: Topic, board: HeijunkaBoard, objectEventProcessor: IObjectEventProcessor, logger: Logger): void {
        const aProjectIsAlreadyDefined = board.projects.getProjects().length > 0;
        if (aProjectIsAlreadyDefined) {
            return;
        }

        const httpClient = new HttpClient(logger, true);
        httpClient.get(this.configuration.boardURL()).subscribe({
            next(value: TrelloBoardResponse) {
                const projectName = value.name;
                const stateModel = board.stateModels.getStateModels()[0];
                const objectEvents = new ProjectEventFactory().create(topic, projectName, stateModel);
                logger.info('create project ' + projectName);
                objectEventProcessor.process(objectEvents);
            },
            error(e) { logger.error(e) }
        })

    }
}