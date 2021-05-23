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

	describe('redundant transitions are removed', () => {
		it('duplicate transitions are removed', () => {
			const testObject = new TrelloKanbanCard('name', 'id');
			const aDate = new Date(2020, 11, 11, 10, 10);
			testObject.addTransition('toList', aDate);
			testObject.addTransition('toList', aDate);
			expect(testObject.getTransitions()).toHaveLength(1);
		});

		it('subsequent transitions without a transition to a different state in between: The later one is redundant', () => {
			const testObject = new TrelloKanbanCard('name', 'id');
			const aDate = new Date(2020, 11, 11, 10, 10);
			const aLaterDate = new Date(2020, 11, 12, 10, 10);
			testObject.addTransition('toList', aDate);
			testObject.addTransition('toList', aLaterDate);
			expect(testObject.getTransitions()).toHaveLength(1);
			expect(testObject.getTransitions()[0].at).toEqual(aDate);
		});
	})

});
