import { Connector } from "./Connector";
import { TrelloConnector } from "./Trello/TrelloConnector";
import { ConfigurationFileReader } from '../CommandLine/ConfigurationFileReader';
import { Logger } from "sitka";

export class ConnectorFactory {
    private availableConnectors: Connector[] = [];

    constructor() {
        this.availableConnectors.push(new TrelloConnector());
    }

    public getAvailableConnectorNames(): string[] {
        const result: string[] = [];
        this.availableConnectors.forEach(connector => result.push(connector.name));
        return result;
    }

    public initialize(connectorName: string, connectorConfigurationFile: string, logger: Logger): Connector {
        const connector: Connector | undefined = this.availableConnectors.find(aConnector => aConnector.name === connectorName);
        if (connector === undefined) {
            throw new Error("unknown connector name " + connectorName);
        }
        if (connectorConfigurationFile !== undefined) {
            const configurationFileReader = new ConfigurationFileReader(logger);
            const configurationConnector = configurationFileReader.read(connectorConfigurationFile);
            connector.readConfiguration(configurationConnector);
        }
        return connector;
    }
}