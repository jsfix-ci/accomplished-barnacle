import { Connector } from '../Connector';
import { TrelloConfiguration } from './TrelloConfiguration';

export class TrelloConnector extends Connector {
    private configuration = new TrelloConfiguration();

    constructor() {
        super();
        this.setConfiguration(this.configuration);
    }

    name(): string {
        return 'trello';
    }
}