import { TrelloConnector } from '../src/Connectors/Trello/TrelloConnector';

describe('TrelloConnector readConfiguration', () => {
	it('mandatory parameter: topic', () => {
		const testObject = new TrelloConnector();
		const configuration = generateValidTrelloConfiguration();
		delete configuration['topic'];
		expect(() => testObject.readConfiguration(configuration)).toThrow();
	});

	it('mandatory parameter: applicationKey', () => {
		const testObject = new TrelloConnector();
		const configuration = generateValidTrelloConfiguration();
		delete configuration['applicationKey'];
		expect(() => testObject.readConfiguration(configuration)).toThrow();
	});

	it('mandatory parameter: board', () => {
		const testObject = new TrelloConnector();
		const configuration = generateValidTrelloConfiguration();
		delete configuration['board'];
		expect(() => testObject.readConfiguration(configuration)).toThrow();
	});

	it('mandatory parameter: token', () => {
		const testObject = new TrelloConnector();
		const configuration = generateValidTrelloConfiguration();
		delete configuration['token'];
		expect(() => testObject.readConfiguration(configuration)).toThrow();
	});

	it('mandatory parameter: stateModel', () => {
		const testObject = new TrelloConnector();
		const configuration = generateValidTrelloConfiguration();
		delete configuration['stateModel'];
		expect(() => testObject.readConfiguration(configuration)).toThrow();
	});

	it('mandatory parameter: stateModel.states', () => {
		const testObject = new TrelloConnector();
		const configuration = generateValidTrelloConfiguration();
		delete configuration['stateModel']['states'];
		expect(() => testObject.readConfiguration(configuration)).toThrow();
	});

	it('mandatory parameter: stateModel.initialState', () => {
		const testObject = new TrelloConnector();
		const configuration = generateValidTrelloConfiguration();
		delete configuration['stateModel']['initialState'];
		expect(() => testObject.readConfiguration(configuration)).toThrow();
	});

	it('mandatory parameter: stateModel.finalStates', () => {
		const testObject = new TrelloConnector();
		const configuration = generateValidTrelloConfiguration();
		delete configuration['stateModel']['finalStates'];
		expect(() => testObject.readConfiguration(configuration)).toThrow();
	});

	it('mandatory parameter: stateModel.transitions', () => {
		const testObject = new TrelloConnector();
		const configuration = generateValidTrelloConfiguration();
		delete configuration['stateModel']['transitions'];
		expect(() => testObject.readConfiguration(configuration)).toThrow();
	});

	it('initial state belongs to states', () => {
		const testObject = new TrelloConnector();
		const configuration = generateValidTrelloConfiguration();
		configuration.stateModel.initialState = 'd';
		expect(() => testObject.readConfiguration(configuration)).toThrow();
	});

	it('each final state belongs to states', () => {
		const testObject = new TrelloConnector();
		const configuration = generateValidTrelloConfiguration();
		configuration.stateModel.finalStates = ['b', 'd'];
		expect(() => testObject.readConfiguration(configuration)).toThrow();
	});

	it('each from-node in a transition belongs to states', () => {
		const testObject = new TrelloConnector();
		const configuration = generateValidTrelloConfiguration();
		configuration.stateModel.transitions.push(['d', 'b']);
		expect(() => testObject.readConfiguration(configuration)).toThrow();
	});

	it('each to-node in a transition belongs to states', () => {
		const testObject = new TrelloConnector();
		const configuration = generateValidTrelloConfiguration();
		configuration.stateModel.transitions.push(['b', 'd']);
		expect(() => testObject.readConfiguration(configuration)).toThrow();
	});
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateValidTrelloConfiguration(): any {
	return {
		topic: "topic",
		applicationKey: "applicationKey",
		board: "board",
		token: "token",
		stateModel: {
			states: ['a', 'b', 'c'],
			initialState: 'a',
			finalStates: ['c'],
			transitions: [[
				"a",
				"b"
			], [
				"a",
				"c"
			], [
				"b",
				"c"
			]]
		}
	}
}