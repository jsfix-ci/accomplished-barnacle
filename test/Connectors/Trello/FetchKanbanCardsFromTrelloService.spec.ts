import { FetchKanbanCardsFromTrelloService, TrelloActionResponse } from '../../../src/Connectors/Trello/FetchKanbanCardsFromTrelloService';
import { TrelloKanbanCard } from '../../../src/Connectors/Trello/TrelloKanbanCard';

describe('FetchKanbanCardsFromTrelloService', () => {
	it('when closed is set to true, a transition to trash is created', () => {
		const trelloKanbanCard = new TrelloKanbanCard('aKanbanCard', 'trelloKanbanCardId');
		const trelloActionResponse = createMockTrelloActionResponse(true, 'aKnownState');
		delete trelloActionResponse.data.listAfter;
		delete trelloActionResponse.data.listBefore;
		const testObject = new FetchKanbanCardsFromTrelloService();
		const mergedKanbanCard = testObject.mergeWithTrelloAction(trelloKanbanCard, trelloActionResponse);
		expect(mergedKanbanCard.getTransitions()).toHaveLength(1);
		expect(mergedKanbanCard.getTransitions()[0].toList).toEqual('__ARCHIVED__');
	});
	it('when closed is set to false, a transition to current list is created', () => {
		const trelloKanbanCard = new TrelloKanbanCard('aKanbanCard', 'trelloKanbanCardId');
		const trelloActionResponse = createMockTrelloActionResponse(false, 'aKnownState');
		delete trelloActionResponse.data.listAfter;
		delete trelloActionResponse.data.listBefore;
		const testObject = new FetchKanbanCardsFromTrelloService();
		const mergedKanbanCard = testObject.mergeWithTrelloAction(trelloKanbanCard, trelloActionResponse);
		expect(mergedKanbanCard.getTransitions()).toHaveLength(1);
		expect(mergedKanbanCard.getTransitions()[0].toList).toEqual('aKnownState');
	});
});

function createMockTrelloActionResponse(isNowClosed: boolean, list: string): TrelloActionResponse {
	return {
		name: 'name',
		id: 'id',
		date: new Date().toUTCString(),
		type: 'updateCard',
		data: {
			old: {
				closed: !isNowClosed
			},
			list: {
				id: 'id',
				name: list
			},
			listBefore: { id: 'id', name: 'name' },
			listAfter: { id: 'id', name: 'name' }
		}
	}
}

