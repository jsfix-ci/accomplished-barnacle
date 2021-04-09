import { CommandLineParameter } from '../TopLevelCommand/CommandLineParameter';
import { ConnectorFactory } from './ConnectorFactory';

export class ConnectorNameParameter extends CommandLineParameter<string> {
    private connectorFactory: ConnectorFactory;
    constructor(key: string, description: string, isMandatory: boolean, connectorFactory: ConnectorFactory) {
        super(key, description, isMandatory);
        this.connectorFactory = connectorFactory;
    }

    public validate(connectorName: string): string | undefined {
        if (this.connectorFactory.getAvailableConnectorNames().some(connector => connectorName === connector)) {
            return;
        }

        let errorMessage: string = "unknown connector with name >>" + connectorName + "<<. Available are: ";
        this.connectorFactory.getAvailableConnectorNames().forEach(connector => errorMessage = errorMessage + connector + ",");
        errorMessage = errorMessage.substr(0, errorMessage.length - 1) + ".";
        return errorMessage;
    }

    public setValue(value: string): void {
        this._value = value;
    }
}