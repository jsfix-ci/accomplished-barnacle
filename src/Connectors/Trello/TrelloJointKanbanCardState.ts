import { KanbanCard, HeijunkaBoard } from "outstanding-barnacle";
import { Topic, ObjectEvent } from "choicest-barnacle";
import { Logger } from "sitka";

export class TrelloJointKanbanCardState {
    private kanbanCards: KanbanCard[];
    private readonly board: HeijunkaBoard;
    private readonly topic: Topic;
    private readonly logger: Logger;
    private reconciliationEvents: ObjectEvent[] = [];

    constructor(kanbanCards: KanbanCard[], board: HeijunkaBoard, topic: Topic, logger: Logger) {
        this.kanbanCards = kanbanCards;
        this.board = board;
        this.topic = topic;
        this.logger = logger;
    }

    public getReconciliationEvents(): ObjectEvent[] {
        return this.reconciliationEvents;
    }
}