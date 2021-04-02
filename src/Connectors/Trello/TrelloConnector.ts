import { Connector } from '../Connector';

export class TrelloConnector extends Connector {
    name(): string {
        return 'trello';
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    readConfiguration(configuration: any): void {
        // TBD
        console.log(configuration);
    }

}