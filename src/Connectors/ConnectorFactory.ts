import { Connector } from "./Connector";
import { TrelloConnector } from "./Trello/TrelloConnector";

export class ConnectorFactory {
    private availableConnectors: Connector[] = [];

    constructor() {
        this.availableConnectors.push(new TrelloConnector());
    }

    public getAvailableConnectorNames(): string[] {
        const result: string[] = [];
        this.availableConnectors.forEach(connector => result.push(connector.name()));
        return result;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    public initialize(connectorName: string, connectorSettings: any): Connector {
        const connector: Connector | undefined = this.availableConnectors.find(aConnector => aConnector.name() === connectorName);
        if (connector === undefined) {
            throw new Error("unknown connector name " + connectorName);
        }
        connector.readConfiguration(connectorSettings);
        return connector;
    }
}