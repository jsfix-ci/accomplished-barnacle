import { KanbanCard, HeijunkaBoard, KanbanCardEventFactory, Project, StateModel, State } from "outstanding-barnacle";
import { Topic, ObjectEvent } from "choicest-barnacle";
import { Logger } from "sitka";
import { TrelloKanbanCardProperties, TrelloTransition } from './TrelloKanbanCard'

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

    public createKanbanCard(trelloId: string, name: string, createdAt: Date): string {
        this.logger.info('create kanban card "' + name + '" (' + trelloId + ')');
        const { events, kanbanCardId } = this.kanbanCardFactory.create(this.topic, name, this.project, this.stateModel);
        events.push(this.kanbanCardFactory.initializeProperty(this.topic, kanbanCardId, TrelloKanbanCardProperties.ID, trelloId));
        events.forEach(anEvent => {
            this.addEvent(anEvent, createdAt);
        });
        return kanbanCardId;
    }

    public addTransition(trelloId: string, kanbanCardId: string, transition: TrelloTransition): void {
        this.logger.info('create transition ("' + trelloId + '") to ' + transition.toList + ' at ' + transition.at.toDateString());
        const matchedStates = this.stateModel.find({ name: transition.toList });
        let moveTo: State;
        if (matchedStates.length > 0) {
            moveTo = matchedStates[0];
        } else {
            this.logger.warn('could not find state named ' + transition.toList + ' (' + trelloId + '). Move to trash instead.');
            moveTo = this.stateModel.trashState();
        }
        const event: ObjectEvent = this.kanbanCardFactory.moveToInProgress(this.topic, kanbanCardId, moveTo);
        this.addEvent(event, transition.at);
    }

    private addEvent(event: ObjectEvent, atTime: Date) {
        event.time = atTime;
        this.reconciliationEvents.push(event);
    }
}