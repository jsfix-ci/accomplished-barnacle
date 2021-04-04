import { TrelloKanbanCard } from './TrelloKanbanCard';
import { TrelloJointKanbanCardState } from './TrelloJointKanbanCardState';

export class ReconciliateDifferencesToTrelloKanbanCard {
    public merge(trelloKanbanCard: TrelloKanbanCard, state: TrelloJointKanbanCardState): TrelloJointKanbanCardState {
        const isNewCard = state.findKanbanCard(trelloKanbanCard.id) === undefined;
        if (isNewCard && trelloKanbanCard.createdAt !== undefined) {
            state.createKanbanCard(trelloKanbanCard.id, trelloKanbanCard.name, trelloKanbanCard.createdAt);
        }
        return state;
    }
}