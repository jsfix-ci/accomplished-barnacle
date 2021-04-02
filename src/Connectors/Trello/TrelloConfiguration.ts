import { Configuration } from '../Configuration';

export class TrelloConfiguration extends Configuration {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    read(configuration: any): void {
        this.validate(configuration);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    validate(configuration: any): void {
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    private validateStateModel(stateModel: any) {
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