import { RemoveKanbanCardsNotInTrelloAnymore } from '../../../src/Connectors/Trello/RemoveKanbanCardsNotInTrelloAnymore';
import { TrelloJointKanbanCardState } from '../../../src/Connectors/Trello/TrelloJointKanbanCardState';
import { HeijunkaBoard, KanbanCard, Project, State, StateModel } from 'outstanding-barnacle';
import { Topic } from 'choicest-barnacle';
import { Logger } from 'sitka';

describe('RemoveKanbanCardsNotInTrelloAnymore', () => {
	it('no card present => no object events created', () => {
		const noCards: KanbanCard[] = [];
		const state = generateState(noCards);
		const testObject = new RemoveKanbanCardsNotInTrelloAnymore();
		expect(testObject.findAndRemoveTrashedKanbanCards(state).getReconciliationEvents()).toHaveLength(0);
	});

	it('one card and that is marked as present => no object events created', () => {
		const oneCard = KanbanCard.create('kanbanId', 'projectId');
		const state = generateState([oneCard]);
		state.markAsStillOnTrelloBoard(oneCard)
		const testObject = new RemoveKanbanCardsNotInTrelloAnymore();
		expect(testObject.findAndRemoveTrashedKanbanCards(state).getReconciliationEvents()).toHaveLength(0);
	});

	it('one card and that is not marked as present => object events created', () => {
		const oneCard = KanbanCard.create('kanbanId', 'projectId');
		const state = generateState([oneCard]);
		const testObject = new RemoveKanbanCardsNotInTrelloAnymore();
		expect(testObject.findAndRemoveTrashedKanbanCards(state).getReconciliationEvents()).toHaveLength(1);
	});
});

function generateState(kanbanCards: KanbanCard[]) {
	const topic = new Topic('topic', 'name');
	const board = HeijunkaBoard.createEmptyHeijunkaBoard();
	const project = Project.create('id', 'stateModelId');
	const logger = Logger.getLogger({ level: Logger.Level.OFF });
	const aState = new State('stateId', 'stateName');
	const stateModel = new StateModel('stateModelId', 'stateModelName', [aState], aState, [], aState);
	return new TrelloJointKanbanCardState(kanbanCards, board, project, stateModel, topic, logger);
}