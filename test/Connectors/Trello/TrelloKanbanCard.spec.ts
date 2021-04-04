import { TrelloKanbanCard } from '../../../src/Connectors/Trello/TrelloKanbanCard';

describe('TrelloKanbanCard', () => {
	describe('creation date is missing sometimes', () => {
		it('transition date is implicitly set as creation date, if creation date hasn\'t been set yet', () => {
			const testObject = new TrelloKanbanCard('name', 'id');
			const aDate = new Date(2020, 11, 11, 10, 10);
			testObject.addTransition('toList', aDate);
			expect(testObject.createdAt).toEqual(aDate);
		});

		it('transition date is implicitly set as creation date, if it is earlier than the current creation date', () => {
			const testObject = new TrelloKanbanCard('name', 'id');
			const initialDate = new Date(2020, 11, 13);
			testObject.createdAt = initialDate;
			const earlierDate = new Date(2020, 11, 11);
			testObject.addTransition('toList', earlierDate);
			expect(testObject.createdAt).toEqual(earlierDate);
		});

		it('transition date does not overwrite creation date, if it is later than the current creation date', () => {
			const testObject = new TrelloKanbanCard('name', 'id');
			const initialDate = new Date(2020, 11, 13);
			testObject.createdAt = initialDate;
			const laterDate = new Date(2020, 11, 13);
			testObject.addTransition('toList', laterDate);
			expect(testObject.createdAt).toEqual(initialDate);
		});
	})

});
