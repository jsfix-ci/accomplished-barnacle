import { KanbanCard, HeijunkaBoard, KanbanCardEventFactory, Project, StateModel, State, KanbanCardProperties } from "outstanding-barnacle";
import { Topic, ObjectEvent, ModificationService } from "choicest-barnacle";
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
    private readonly objectEventModificationService: ModificationService = new ModificationService();

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
        this.addEvent(events, createdAt);
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

    public rename(kanbanCard: KanbanCard, newName: string): void {
        this.logger.info('rename kanban card to ' + newName);

        const event: ObjectEvent = this.kanbanCardFactory.updateProperty(this.topic, kanbanCard, KanbanCardProperties.NAME, newName);
        this.reconciliationEvents.push(event);
    }

    public markAsStillOnTrelloBoard(kanbanCard: KanbanCard): void {
        this.kanbanCards.splice(this.kanbanCards.findIndex(aCard => aCard.id === kanbanCard.id), 1);
    }

    public getKanbanCardsNotMarkedAsStillOnTrelloBoard(): KanbanCard[] {
        return this.kanbanCards;
    }

    public moveToTrash(kanbanCard: KanbanCard): void {
        const event = this.kanbanCardFactory.moveToTrash(this.topic, kanbanCard);
        this.reconciliationEvents.push(event);
    }

    private addEvent(event: ObjectEvent | ObjectEvent[], atTime: Date) {
        if (event instanceof Array) {
            event = this.objectEventModificationService.adjustTimes(event, atTime);
            event.forEach(anEvent => {
                this.reconciliationEvents.push(anEvent);
            });
        } else {
            event = this.objectEventModificationService.adjustTime(event, atTime);
            this.reconciliationEvents.push(event);
        }
    }
}