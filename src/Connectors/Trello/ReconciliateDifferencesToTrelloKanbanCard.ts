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
            trelloKanbanCard.labels.forEach(aLabel => {
                const context: Context = state.findContext(aLabel);
                if (context !== undefined && !context.contains(newCardId)) {
                    state.addToContext(newCardId, context);
                }
            })
        }
        return state;
    }

    private mergeChangesWith(trelloKanbanCard: TrelloKanbanCard, correspondingBarnacleCard: KanbanCard,
        state: TrelloJointKanbanCardState): TrelloJointKanbanCardState {
        if (trelloKanbanCard.name !== correspondingBarnacleCard.valueOfProperty(KanbanCardProperties.NAME)) {
            state.rename(correspondingBarnacleCard, trelloKanbanCard.name);
        }

        const knownTransitions = correspondingBarnacleCard.history.transitions;
        trelloKanbanCard.transitions.forEach(aTransition => {
            const indexOfCorrespondingTransition = knownTransitions.findIndex(transition => Math.abs(transition.occurredAt.getTime() - aTransition.at.getTime()) < 1100);
            if (indexOfCorrespondingTransition === -1) {
                state.addTransition(trelloKanbanCard.id, correspondingBarnacleCard.id, aTransition);
            }
        });

        return state;
    }
}