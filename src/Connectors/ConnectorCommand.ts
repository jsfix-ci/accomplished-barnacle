import { CommandLineParameter } from "../TopLevelCommand/CommandLineParameter";
import { ITopLevelCommand } from "../TopLevelCommand/ITopLevelCommand";
import { ConnectorSettings } from './ConnectorSettings';
import { FileNameParameter } from '../TopLevelCommand/FileNameParameter';
import { ConnectorNameParameter } from './ConnectorNameParameter';
import { ConnectorFactory } from "./ConnectorFactory";
import { ConnectorApplication } from "./ConnectorApplication";
import { Logger } from "sitka";
import { ISettings } from "../TopLevelCommand/ISettings";

export class ConnectorCommand implements ITopLevelCommand {
    private connectorFactory: ConnectorFactory = new ConnectorFactory();

    public run(settings: ISettings, logger: Logger): void {
        const application = new ConnectorApplication(settings, this.connectorFactory, logger);
        application.run();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public commandLineParameters(): { key: string, parameter: CommandLineParameter<any> }[] {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any   
        const settings: { key: string, parameter: CommandLineParameter<any> }[] = [];
        settings.push({ key: ConnectorSettings.CONNECTOR_NAME, parameter: new ConnectorNameParameter('connector', 'connector name', true, this.connectorFactory) });
        settings.push({ key: ConnectorSettings.CONNECTOR_FILE, parameter: new FileNameParameter('connector-config', 'connector configuration file', false) });
        return settings;
    }

    public readonly name = "connect";
}