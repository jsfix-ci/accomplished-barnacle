import { TrelloJointKanbanCardState } from "./TrelloJointKanbanCardState";

export class RemoveKanbanCardsNotInTrelloAnymore {
    public findAndRemoveTrashedKanbanCards(state: TrelloJointKanbanCardState): TrelloJointKanbanCardState {
        const toMoveToTrash = state.getKanbanCardsNotMarkedAsStillOnTrelloBoard();
        toMoveToTrash.forEach(removedKanbanCard => {
            state.moveToTrash(removedKanbanCard);
        })
        return state;
    }
}