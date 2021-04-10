import { TrelloKanbanCard } from './TrelloKanbanCard';
import { TrelloJointKanbanCardState } from './TrelloJointKanbanCardState';
import { Context, KanbanCard, KanbanCardProperties } from 'outstanding-barnacle';

export class ReconciliateDifferencesToTrelloKanbanCard {
    public merge(trelloKanbanCard: TrelloKanbanCard, state: TrelloJointKanbanCardState): TrelloJointKanbanCardState {
        const isNewCard = state.findKanbanCard(trelloKanbanCard.id) === undefined;
        if (isNewCard) {
            return this.addNewCard(trelloKanbanCard, state);
        }
        const correspondingBarnacleCard = state.findKanbanCard(trelloKanbanCard.id);
        state.markAsStillOnTrelloBoard(correspondingBarnacleCard);
        return this.mergeChangesWith(trelloKanbanCard, correspondingBarnacleCard, state);
    }

    private addNewCard(trelloKanbanCard: TrelloKanbanCard, state: TrelloJointKanbanCardState): TrelloJointKanbanCardState {
        if (trelloKanbanCard.createdAt !== undefined) {
            const newCardId = state.createKanbanCard(trelloKanbanCard.id, trelloKanbanCard.name, trelloKanbanCard.createdAt);
            trelloKanbanCard.transitions.forEach(aTrelloTransition => {
                state.addTransition(trelloKanbanCard.id, newCardId, aTrelloTransition);
            });

            state = this.addToMissingContexts(trelloKanbanCard, newCardId, state);
        }
        return state;
    }

    private mergeChangesWith(trelloKanbanCard: TrelloKanbanCard, correspondingBarnacleCard: KanbanCard,
        state: TrelloJointKanbanCardState): TrelloJointKanbanCardState {

        state = this.updateName(trelloKanbanCard, correspondingBarnacleCard, state);
        state = this.addMissingTransitions(trelloKanbanCard, correspondingBarnacleCard, state);
        state = this.addToMissingContexts(trelloKanbanCard, correspondingBarnacleCard.id, state);
        state = this.removeFromContexts(trelloKanbanCard, correspondingBarnacleCard.id, state);

        return state;
    }

    private addToMissingContexts(trelloKanbanCard: TrelloKanbanCard, kanbanCardId: string, state: TrelloJointKanbanCardState): TrelloJointKanbanCardState {
        trelloKanbanCard.labels.forEach(aLabel => {
            const context: Context = state.findContext(aLabel);
            if (context !== undefined && !context.contains(kanbanCardId)) {
                state.addToContext(kanbanCardId, context);
            }
        })
        return state;
    }

    private removeFromContexts(trelloKanbanCard: TrelloKanbanCard, kanbanCardId: string, state: TrelloJointKanbanCardState): TrelloJointKanbanCardState {
        return state;
    }

    private updateName(trelloKanbanCard: TrelloKanbanCard, kanbanCard: KanbanCard, state: TrelloJointKanbanCardState): TrelloJointKanbanCardState {
        if (trelloKanbanCard.name !== kanbanCard.valueOfProperty(KanbanCardProperties.NAME)) {
            state.rename(kanbanCard, trelloKanbanCard.name);
        }
        return state;
    }

    private addMissingTransitions(trelloKanbanCard: TrelloKanbanCard, kanbanCard: KanbanCard, state: TrelloJointKanbanCardState): TrelloJointKanbanCardState {
        const knownTransitions = kanbanCard.history.transitions;
        trelloKanbanCard.transitions.forEach(aTransition => {
            const indexOfCorrespondingTransition = knownTransitions.findIndex(transition => Math.abs(transition.occurredAt.getTime() - aTransition.at.getTime()) < 1100);
            if (indexOfCorrespondingTransition === -1) {
                state.addTransition(trelloKanbanCard.id, kanbanCard.id, aTransition);
            }
        });
        return state;
    }
}