import { Logger } from 'sitka';
import { ICommandLineArgumentsParser } from './ICommandLineArgumentsParser';
import { ISettings, BackendConfiguration } from './ISettings';
import { ConfigurationFileReader } from './ConfigurationFileReader';

enum SettingKey {
    BACKEND_CONFIGURATION_FILE = 'BACKEND_CONFIGURATION_FILE',
    CONNECTOR_NAME = 'CONNECTOR_NAME',
    CONNECTOR_FILE = 'CONNECTOR_FILE'
}

export class Settings implements ISettings, ICommandLineArgumentsParser {
    private logger: Logger;
    private configuredConnectors: string[];
    private backendConfigurationSettings: BackendConfiguration;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private configurationConnector: any;
    private parameters: Map<string, string> = new Map<string, string>();

    constructor(logger: Logger, configuredConnectors: string[]) {
        this.logger = logger;
        this.configuredConnectors = configuredConnectors;
    }

    public parseCommandLineArguments(args: string[]): void {
        args.splice(0, 2);
        try {
            this.parseConnectorName(args);
            this.parseConnectorSettingsFile(args);
            this.parseBackendSettings(args);
            this.readConnectorConfiguration();
            this.readBackendConfiguration();
        } catch (e) {
            this.printHelp();
            throw e;
        }
    }

    public backendConfiguration(): BackendConfiguration {
        return this.backendConfigurationSettings;
    }

    public selectedConnector(): string {
        return this.parameters.get(SettingKey.CONNECTOR_NAME);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public connectorConfiguration(): any {
        return this.configurationConnector;
    }

    private parseConnectorName(args: string[]): void {
        if (args.length <= 0) {
            throw new Error("missing mandatory parameter connector name");
        }
        const connectorName = args[0];
        if (!this.configuredConnectors.some(connector => connectorName === connector)) {
            let errorMessage: string = "unknown connector with name >>" + connectorName + "<<. Available are: ";
            this.configuredConnectors.forEach(connector => errorMessage = errorMessage + connector + ",");
            errorMessage = errorMessage.substr(0, errorMessage.length - 1) + ".";
            throw new Error(errorMessage);
        }
        this.parameters.set(SettingKey.CONNECTOR_NAME, connectorName);
    }

    private parseConnectorSettingsFile(args: string[]): void {
        if (args.length <= 1) {
            throw new Error("missing mandatory parameter connector settings file");
        }
        const connectorConfigurationFile = args[1];
        this.parameters.set(SettingKey.CONNECTOR_FILE, connectorConfigurationFile);
    }

    private parseBackendSettings(args: string[]): void {
        let backendConfigurationFile = './backend.json';
        if (args.length >= 3) {
            backendConfigurationFile = args[2];
        }

        this.parameters.set(SettingKey.BACKEND_CONFIGURATION_FILE, backendConfigurationFile);
    }

    private readBackendConfiguration(): void {
        const configurationFileReader = new ConfigurationFileReader(this.logger);
        this.backendConfigurationSettings = configurationFileReader.read(this.parameters.get(SettingKey.BACKEND_CONFIGURATION_FILE));
    }

    private readConnectorConfiguration(): void {
        const configurationFileReader = new ConfigurationFileReader(this.logger);
        this.configurationConnector = configurationFileReader.read(this.parameters.get(SettingKey.CONNECTOR_FILE));
    }

    private printHelp(): void {
        console.log("usage: <connectorname> <json file with connector settings> <optional: json file with backend connecting (defaults to backend.json)>")
    }
}