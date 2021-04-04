import { KanbanCard, HeijunkaBoard, KanbanCardEventFactory, Project, StateModel } from "outstanding-barnacle";
import { Topic, ObjectEvent } from "choicest-barnacle";
import { Logger } from "sitka";
import { TrelloKanbanCardProperties } from './TrelloKanbanCard'

export class TrelloJointKanbanCardState {
    private kanbanCards: KanbanCard[];
    private readonly board: HeijunkaBoard;
    private readonly topic: Topic;
    private readonly logger: Logger;
    private readonly project: Project;
    private readonly stateModel: StateModel;
    private reconciliationEvents: ObjectEvent[] = [];
    private readonly kanbanCardFactory: KanbanCardEventFactory = new KanbanCardEventFactory();

    constructor(kanbanCards: KanbanCard[], board: HeijunkaBoard, project: Project, stateModel: StateModel, topic: Topic, logger: Logger) {
        this.kanbanCards = kanbanCards;
        this.board = board;
        this.topic = topic;
        this.logger = logger;
        this.project = project;
        this.stateModel = stateModel;
    }

    public getReconciliationEvents(): ObjectEvent[] {
        return this.reconciliationEvents;
    }

    public findKanbanCard(trelloId: string): KanbanCard {
        return this.kanbanCards.find(kanbanCard => kanbanCard.valueOfProperty(TrelloKanbanCardProperties.ID) === trelloId);
    }

    public createKanbanCard(trelloId: string, name: string, createdAt: Date): void {
        const { events, kanbanCardId } = this.kanbanCardFactory.create(this.topic, name, this.project, this.stateModel);
        events.push(this.kanbanCardFactory.initializeProperty(this.topic, kanbanCardId, TrelloKanbanCardProperties.ID, trelloId));
        events.forEach(anEvent => {
            this.addEvent(anEvent, createdAt);
        });
    }

    private addEvent(event: ObjectEvent, atTime: Date) {
        event.time = atTime;
        this.reconciliationEvents.push(event);
    }
}