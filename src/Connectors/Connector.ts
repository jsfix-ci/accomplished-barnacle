import { Topic } from "choicest-barnacle";
import { StateModelCollection } from "outstanding-barnacle";
import { IObjectEventProcessor } from "../IObjectEventProcessor";
import { ITopicService } from "../Backend/ITopicService";
import { Configuration } from "./Configuration"
import { StateModelDifferencesService } from './StateModelDifferencesService'

export abstract class Connector {
    private _configuration: Configuration = undefined;
    private _stateModelDifferencesService: StateModelDifferencesService = undefined;
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

    public reconcilitateStateModel(topic: Topic, stateModels: StateModelCollection, objectEventProcessor: IObjectEventProcessor): void {
        if (this._stateModelDifferencesService === undefined) {
            return;
        }
        this._stateModelDifferencesService.reconciliate(topic, stateModels, objectEventProcessor);
    }

    protected setConfiguration(configuration: Configuration): void {
        this._configuration = configuration;
    }

    protected setStateModelDifferencesService(stateModelDifferencesService: StateModelDifferencesService): void {
        this._stateModelDifferencesService = stateModelDifferencesService;
    }
}