import { Connector } from "./Connector";
import { TrelloConnector } from "./Trello/TrelloConnector";
import { ConfigurationFileReader } from '../CommandLine/ConfigurationFileReader';
import { Logger } from "sitka";

export class ConnectorFactory {
    private availableConnectors: string[] = [];

    constructor() {
        this.availableConnectors.push(TrelloConnector.connectorName);
    }

    public getAvailableConnectorNames(): string[] {
        return this.availableConnectors;
    }

    public initialize(connectorName: string, connectorConfigurationFile: string, logger: Logger): Connector {
        const connector = this.instantiateConnector(connectorName, logger);

        if (connectorConfigurationFile !== undefined) {
            const configurationFileReader = new ConfigurationFileReader(logger);
            const configurationConnector = configurationFileReader.read(connectorConfigurationFile);
            connector.readConfiguration(configurationConnector);
        }
        return connector;
    }

    private instantiateConnector(connectorName: string, logger: Logger): Connector {
        if (!this.availableConnectors.some(aConnectorName => aConnectorName === connectorName)) {
            throw new Error("unknown connector name " + connectorName);
        }
        if (connectorName === TrelloConnector.connectorName) {
            return new TrelloConnector(logger);
        }
    }
}