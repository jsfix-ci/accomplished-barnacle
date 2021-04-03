import { Topic } from "choicest-barnacle";
import { HeijunkaBoard, StateModelCollection } from "outstanding-barnacle";
import { IObjectEventProcessor } from "../IObjectEventProcessor";
import { ITopicService } from "../Backend/ITopicService";
import { Configuration } from "./Configuration"
import { StateModelDifferencesService } from './StateModelDifferencesService'
import { ProjectDifferencesService } from './ProjectDifferencesService'
import { KanbanCardDifferencesService } from './KanbanCardDifferencesService'
import { ContextDifferencesService } from './ContextDifferencesService'
import { Logger } from "sitka";

export abstract class Connector {
    private _configuration: Configuration = undefined;
    private _stateModelDifferencesService: StateModelDifferencesService = undefined;
    private _projectDifferencesService: ProjectDifferencesService = undefined;
    private _kanbanCardDifferencesService: KanbanCardDifferencesService = undefined;
    private _contextDifferencesService: ContextDifferencesService = undefined;
    public readonly name: string;

    constructor(name: string) {
        this.name = name;
    }

    abstract selectTopic(topicService: ITopicService): Topic;

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any
    public readConfiguration(configuration: any): void {
        if (this._configuration === undefined) {
            return;
        }
        this._configuration.validate(configuration);
        this._configuration.read(configuration);
    }

    public reconciliateStateModel(topic: Topic, stateModels: StateModelCollection, objectEventProcessor: IObjectEventProcessor, logger: Logger): void {
        if (this._stateModelDifferencesService === undefined) {
            return;
        }
        this._stateModelDifferencesService.reconciliate(topic, stateModels, objectEventProcessor, logger);
    }

    public reconciliateProjects(topic: Topic, board: HeijunkaBoard, objectEventProcessor: IObjectEventProcessor, logger: Logger): void {
        if (this._projectDifferencesService === undefined) {
            return;
        }
        this._projectDifferencesService.reconciliate(topic, board, objectEventProcessor, logger);
    }

    public reconciliateKanbanCards(topic: Topic, board: HeijunkaBoard, objectEventProcessor: IObjectEventProcessor, logger: Logger): void {
        if (this._kanbanCardDifferencesService === undefined) {
            return;
        }
        this._kanbanCardDifferencesService.reconciliate(topic, board, objectEventProcessor, logger);
    }

    public reconciliateContexts(topic: Topic, board: HeijunkaBoard, objectEventProcessor: IObjectEventProcessor, logger: Logger): void {
        if (this._contextDifferencesService === undefined) {
            return;
        }
        this._contextDifferencesService.reconciliate(topic, board, objectEventProcessor, logger);
    }

    protected setConfiguration(configuration: Configuration): void {
        this._configuration = configuration;
    }

    protected setStateModelDifferencesService(stateModelDifferencesService: StateModelDifferencesService): void {
        this._stateModelDifferencesService = stateModelDifferencesService;
    }

    protected setProjectDifferencesService(projectDifferencesService: ProjectDifferencesService): void {
        this._projectDifferencesService = projectDifferencesService;
    }

    protected setKanbanCardDifferencesService(kanbanCardDifferencesService: KanbanCardDifferencesService): void {
        this._kanbanCardDifferencesService = kanbanCardDifferencesService;
    }

    protected setContextDifferencesService(contextDifferencesService: ContextDifferencesService): void {
        this._contextDifferencesService = contextDifferencesService;
    }


}