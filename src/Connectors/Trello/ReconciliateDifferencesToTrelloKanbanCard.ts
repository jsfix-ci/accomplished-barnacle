import { TrelloKanbanCard } from './TrelloKanbanCard';
import { TrelloJointKanbanCardState } from './TrelloJointKanbanCardState';

export class ReconciliateDifferencesToTrelloKanbanCard {
    public merge(trelloKanbanCard: TrelloKanbanCard, state: TrelloJointKanbanCardState): TrelloJointKanbanCardState {
        return state;
    }
}