import { Logger } from 'sitka';
import { ICommandLineArgumentsParser } from './ICommandLineArgumentsParser';
import { ISettings, BackendConfiguration } from './ISettings';
import { ConfigurationFileReader } from './ConfigurationFileReader';

export class Settings implements ISettings, ICommandLineArgumentsParser {
    private logger: Logger;
    private configuredConnectors: string[];
    private backendConfigurationSettings: BackendConfiguration;

    constructor(logger: Logger, configuredConnectors: string[]) {
        this.logger = logger;
        this.configuredConnectors = configuredConnectors;
    }

    public parseCommandLineArguments(args: string[]): void {
        args.forEach(arg => this.logger.info(arg));
        this.readBackendConfiguration();
    }

    public backendConfiguration(): BackendConfiguration {
        return this.backendConfigurationSettings;
    }

    private readBackendConfiguration(): void {
        const configurationFileReader = new ConfigurationFileReader(this.logger);
        const defaultBackendConfigurationFile = './backend.json';
        this.backendConfigurationSettings = configurationFileReader.read(defaultBackendConfigurationFile);
    }

}