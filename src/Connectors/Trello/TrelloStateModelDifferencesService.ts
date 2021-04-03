import { Topic } from "choicest-barnacle";
import { Logger } from 'sitka';
import { State, StateModel, HeijunkaBoard, StateModelEventFactory, UUIDGenerator } from "outstanding-barnacle";
import { IObjectEventProcessor } from "../../IObjectEventProcessor";
import { DifferencesService } from "../DifferencesService";
import { TrelloConfiguration } from "./TrelloConfiguration";

export class TrelloStateModelDifferencesService extends DifferencesService {
    private configuration: TrelloConfiguration;
    private readonly stateModelName = 'stateModelOfLists';

    constructor(configuration: TrelloConfiguration) {
        super();
        this.configuration = configuration;
    }

    reconciliate(topic: Topic, board: HeijunkaBoard, objectEventProcessor: IObjectEventProcessor, logger: Logger): void {
        const alreadyDefined = board.stateModels.getStateModels().length > 0;
        if (alreadyDefined) {
            return;
        }

        logger.info('create state model');
        const objectEvent = new StateModelEventFactory().create(topic, this.generateStateModel());
        objectEventProcessor.process(objectEvent);
    }

    private generateStateModel(): StateModel {
        const id = UUIDGenerator.createUUID();
        const states: State[] = [];
        this.configuration.states().forEach(stateName => {
            states.push(new State(UUIDGenerator.createUUID(), stateName));
        })
        const initialState = states.find(aState => aState.name === this.configuration.initialState());
        const finalStates: State[] = [];
        this.configuration.finalStates().forEach(aFinalStateName => {
            finalStates.push(states.find(aState => aState.name === aFinalStateName));
        })
        const trashState: State = new State(UUIDGenerator.createUUID(), 'Trash');
        states.push(trashState);
        const stateModel = new StateModel(id, this.stateModelName, states, initialState, finalStates, trashState);
        this.configuration.transitions().forEach(aTransition => {
            const fromState = states.find(aState => aState.name === aTransition[0]);
            const toState = states.find(aState => aState.name === aTransition[1]);
            stateModel.setSuccessorOf(fromState, toState);
        })
        return stateModel;
    }
}