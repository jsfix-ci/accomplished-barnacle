import { Configuration } from '../Configuration';

type StateModel = {
    states: string[],
    initialState: string,
    finalStates: string[],
    transitions: string[2][]
}

type TrelloJsonConfiguration = {
    applicationKey: string,
    board: string,
    token: string,
    topic: string,
    stateModel: StateModel
}

export class TrelloConfiguration extends Configuration {
    private _applicationKey: string;
    private _board: string;
    private _token: string;
    private _topic: string;
    private _states: string[];
    private _initialState: string;
    private _finalStates: string[];
    private _transitions: string[2][];

    read(configuration: TrelloJsonConfiguration): void {
        this._applicationKey = configuration.applicationKey;
        this._board = configuration.board;
        this._token = configuration.token;
        this._topic = configuration.topic;
        this._states = configuration.stateModel.states;
        this._initialState = configuration.stateModel.initialState;
        this._finalStates = configuration.stateModel.finalStates;
        this._transitions = configuration.stateModel.transitions;
    }

    validate(configuration: TrelloJsonConfiguration): void {
        this.verifyThatConfigurationHasProperty(configuration, 'applicationKey');
        this.verifyThatConfigurationHasProperty(configuration, 'board');
        this.verifyThatConfigurationHasProperty(configuration, 'token');
        this.verifyThatConfigurationHasProperty(configuration, 'stateModel');
        this.verifyThatConfigurationHasProperty(configuration, 'topic');
        this.verifyThatConfigurationHasProperty(configuration.stateModel, 'states');
        this.verifyThatConfigurationHasProperty(configuration.stateModel, 'initialState');
        this.verifyThatConfigurationHasProperty(configuration.stateModel, 'finalStates');
        this.verifyThatConfigurationHasProperty(configuration.stateModel, 'transitions');

        this.validateStateModel(configuration.stateModel);
    }

    public applicationKey(): string {
        return this._applicationKey;
    }

    public board(): string {
        return this._board;
    }

    public token(): string {
        return this._token;
    }

    public topic(): string {
        return this._topic;
    }

    public states(): string[] {
        return this._states;
    }


    public initialState(): string {
        return this._initialState;
    }

    public finalStates(): string[] {
        return this._finalStates;
    }

    public transitions(): string[2][] {
        return this._transitions;
    }

    private validateStateModel(stateModel: StateModel) {
        const stateIsPartOfStates = (aState: string) => stateModel.states.find((x: string) => x === aState) !== undefined;
        if (!stateIsPartOfStates(stateModel.initialState)) {
            throw new Error('states does not contain initial state (' + stateModel.initialState + ')');
        }

        stateModel.finalStates.forEach((finalState: string) => {
            if (!stateIsPartOfStates(finalState)) {
                throw new Error('states does not contain final state (' + finalState + ')');
            }
        })

        stateModel.transitions.forEach((aTransition: string[2]) => {
            const fromState = aTransition[0];
            const toState = aTransition[1];
            if (!stateIsPartOfStates(fromState)) {
                throw new Error('states does not contain from-state in the transition (' + fromState + ',' + toState + ')');
            }
            if (!stateIsPartOfStates(toState)) {
                throw new Error('states does not contain to-state in the transition (' + fromState + ',' + toState + ')');
            }
        })
    }
}