import { Logger } from 'sitka';
import { ICommandLineArgumentsParser } from './ICommandLineArgumentsParser';
import { ISettings, BackendConfiguration } from './ISettings';
import { ConfigurationFileReader } from './ConfigurationFileReader';

enum SettingKey {
    BACKEND_CONFIGURATION_FILE = 'BACKEND_CONFIGURATION_FILE',
    CONNECTOR = 'CONNECTOR',
    CONNECTOR_SETTINGS = 'CONNECTOR_SETTINGS'
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

        this.parameters.set(SettingKey.BACKEND_CONFIGURATION_FILE, './backend.json');
        this.parameters.set(SettingKey.CONNECTOR_SETTINGS, './connector.json');
        this.parameters.set(SettingKey.CONNECTOR, configuredConnectors[0]);
    }

    public parseCommandLineArguments(args: string[]): void {
        args.splice(0, 2);
        args.forEach(arg => this.logger.info(arg));
        this.readBackendConfiguration();
        this.readConnectorConfiguration();
    }

    public backendConfiguration(): BackendConfiguration {
        return this.backendConfigurationSettings;
    }

    public selectedConnector(): string {
        return this.parameters.get(SettingKey.CONNECTOR);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public connectorConfiguration(): any {
        return this.configurationConnector;
    }

    private readBackendConfiguration(): void {
        const configurationFileReader = new ConfigurationFileReader(this.logger);
        this.backendConfigurationSettings = configurationFileReader.read(this.parameters.get(SettingKey.BACKEND_CONFIGURATION_FILE));
    }

    private readConnectorConfiguration(): void {
        const configurationFileReader = new ConfigurationFileReader(this.logger);
        this.configurationConnector = configurationFileReader.read(this.parameters.get(SettingKey.CONNECTOR_SETTINGS));
    }

}