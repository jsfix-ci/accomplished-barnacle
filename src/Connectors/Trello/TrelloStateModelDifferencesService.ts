import { ObjectEvent, Topic } from "choicest-barnacle";
import { Logger } from 'sitka';
import { State, StateModel, HeijunkaBoard, StateModelEventFactory, UUIDGenerator } from "outstanding-barnacle";
import { DifferencesService } from "../DifferencesService";
import { TrelloConfiguration } from "./TrelloConfiguration";
import { Observable } from "rxjs";

export class TrelloStateModelDifferencesService extends DifferencesService {
    private configuration: TrelloConfiguration;
    private readonly stateModelName = 'stateModelOfLists';

    constructor(configuration: TrelloConfiguration) {
        super();
        this.configuration = configuration;
    }

    reconciliate(topic: Topic, board: HeijunkaBoard, logger: Logger): Observable<ObjectEvent> {
        const alreadyDefined = board.stateModels.getStateModels().length > 0;
        return new Observable(subscriber => {
            if (!alreadyDefined) {
                logger.info('create state model');
                const objectEvent = new StateModelEventFactory().create(topic, this.generateStateModel());
                subscriber.next(objectEvent);
            }
            subscriber.complete();
        });
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