import { Topic } from "choicest-barnacle";
import { Logger } from 'sitka';
import { HeijunkaBoard, ProjectEventFactory } from "outstanding-barnacle";
import { IObjectEventProcessor } from "../../IObjectEventProcessor";
import { TrelloConfiguration } from "./TrelloConfiguration";
import { ProjectDifferencesService } from "../ProjectDifferencesService";

export class TrelloProjectDifferencesService extends ProjectDifferencesService {
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
        const projectName = this.configuration.board();
        const stateModel = board.stateModels.getStateModels()[0];
        const objectEvents = new ProjectEventFactory().create(topic, projectName, stateModel);

        logger.info('create project ' + projectName);
        objectEventProcessor.process(objectEvents);
    }
}