import { ReconciliateDifferencesToTrelloKanbanCard } from '../../../src/Connectors/Trello/ReconciliateDifferencesToTrelloKanbanCard';
import { TrelloJointKanbanCardState } from '../../../src/Connectors/Trello/TrelloJointKanbanCardState';
import { HeijunkaBoard, KanbanCard, KanbanCardProperties, Project, State, StateModel, StateTransition } from 'outstanding-barnacle';
import { Topic } from 'choicest-barnacle';
import { Logger } from 'sitka';
import { TrelloKanbanCard, TrelloKanbanCardProperties } from '../../../src/Connectors/Trello/TrelloKanbanCard';

describe('ReconciliateDifferencesToTrelloKanbanCard', () => {

	it('fix: Transitions are repeatedly added, even though they shouldn\'t', () => {
		const trelloKanbanCard = new TrelloKanbanCard('aKanbanCard', 'trelloKanbanCardId');
		trelloKanbanCard.addTransition('Backlog', new Date(1617728247810));
		trelloKanbanCard.addTransition('In Progress', new Date(1617727961318));
		trelloKanbanCard.addTransition('Done', new Date(1617727780277));
		trelloKanbanCard.addTransition('Backlog', new Date(1617533894041));
		trelloKanbanCard.addTransition('Waiting For', new Date(1617533835651));
		trelloKanbanCard.addTransition('In Progress', new Date(1617533750607));
		trelloKanbanCard.addTransition('Waiting For', new Date(1616937391764));
		trelloKanbanCard.addTransition('In Progress', new Date(1616937386096));
		trelloKanbanCard.addTransition('Backlog', new Date(1607847658792));
		trelloKanbanCard.addTransition('Waiting For', new Date(1607410458310));
		trelloKanbanCard.addTransition('In Progress', new Date(1606692232839));
		trelloKanbanCard.addTransition('Waiting For', new Date(1597378252851));
		trelloKanbanCard.addTransition('To Do', new Date(1597378017506));

		const aKanbanCard = KanbanCard.create('kanbanCardBarnacle', 'projectId')
			.initializeProperty(KanbanCardProperties.NAME, 'aKanbanCard', new Date())
			.initializeProperty(TrelloKanbanCardProperties.ID, 'trelloKanbanCardId', new Date())
			.transitToNewState(StateTransition.inProgressInState('Trash', new Date(1597378017000)))
			.transitToNewState(StateTransition.inProgressInState('Waiting For', new Date(1597378252000)))
			.transitToNewState(StateTransition.inProgressInState('Waiting For', new Date(1607410458000)))
			.transitToNewState(StateTransition.inProgressInState('Waiting For', new Date(1616937391000)))
			.transitToNewState(StateTransition.inProgressInState('Waiting For', new Date(1617533835000)))
			.transitToNewState(StateTransition.inProgressInState('In Progress', new Date(1606692232000)))
			.transitToNewState(StateTransition.inProgressInState('In Progress', new Date(1616937386000)))
			.transitToNewState(StateTransition.inProgressInState('In Progress', new Date(1617533750000)))
			.transitToNewState(StateTransition.inProgressInState('Backlog', new Date(1607847658000)))
			.transitToNewState(StateTransition.inProgressInState('Backlog', new Date(1617533894000)));

		const state = generateState([aKanbanCard]);
		const testObject = new ReconciliateDifferencesToTrelloKanbanCard();
		expect(testObject.merge(trelloKanbanCard, state).getReconciliationEvents()).toHaveLength(0);
	});
});

function generateState(kanbanCards: KanbanCard[]) {
	const topic = new Topic('topic', 'name');
	const board = HeijunkaBoard.createEmptyHeijunkaBoard();
	const project = Project.create('projectId', 'stateModelId');
	const logger = Logger.getLogger({ level: Logger.Level.OFF });
	const backlogState = new State('Backlog', 'Backlog');
	const inProgressState = new State('In Progress', 'In Progress');
	const doneState = new State('Done', 'Done');
	const waitingForState = new State('Waiting For', 'Waiting For');
	const trashState = new State('Trash', 'Trash');

	const stateModel = new StateModel('stateModelId', 'stateModelName', [backlogState, inProgressState, doneState, waitingForState, trashState], backlogState, [doneState], trashState);
	return new TrelloJointKanbanCardState(kanbanCards, board, project, stateModel, topic, logger);
}
