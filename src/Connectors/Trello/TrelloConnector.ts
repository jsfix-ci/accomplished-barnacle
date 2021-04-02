import { Connector } from '../Connector';

export class TrelloConnector extends Connector {
    name(): string {
        return 'trello';
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    readConfiguration(configuration: any): void {
        this.validateConfiguration(configuration);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    private validateConfiguration(configuration: any): void {
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    private verifyThatConfigurationHasProperty(configuration: any, propertyName: string): void {
        // eslint-disable-next-line no-prototype-builtins
        if (!configuration.hasOwnProperty(propertyName)) {
            throw new Error('configuration does not have property ' + propertyName);
        }
    }
}