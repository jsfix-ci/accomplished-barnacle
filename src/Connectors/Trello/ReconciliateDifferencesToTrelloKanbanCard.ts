import { TrelloKanbanCard } from './TrelloKanbanCard';
import { TrelloJointKanbanCardState } from './TrelloJointKanbanCardState';

export class ReconciliateDifferencesToTrelloKanbanCard {
    public merge(trelloKanbanCard: TrelloKanbanCard, state: TrelloJointKanbanCardState): TrelloJointKanbanCardState {
        const isNewCard = state.findKanbanCard(trelloKanbanCard.id) === undefined;
        if (isNewCard && trelloKanbanCard.createdAt !== undefined) {
            const newCardId = state.createKanbanCard(trelloKanbanCard.id, trelloKanbanCard.name, trelloKanbanCard.createdAt);
            trelloKanbanCard.transitions.forEach(aTrelloTransition => {
                state.addTransition(trelloKanbanCard.id, newCardId, aTrelloTransition);
            })
        }
        return state;
    }
}