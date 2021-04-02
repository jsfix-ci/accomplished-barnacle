import { Logger } from 'sitka';
import { ICommandLineArgumentsParser } from './ICommandLineArgumentsParser';
import { ISettings, BackendConfiguration } from './ISettings';

export class Settings implements ISettings, ICommandLineArgumentsParser {
    private logger: Logger;
    private configuredConnectors: string[];

    constructor(logger: Logger, configuredConnectors: string[]) {
        this.logger = logger;
        this.configuredConnectors = configuredConnectors;
    }

    public parseCommandLineArguments(args: string[]): void {
        args.forEach(arg => this.logger.info(arg));
        this.readBackendConfiguration();
    }

    public backendConfiguration(): BackendConfiguration {
        return { endpoint: 'asd' };
    }

    private readBackendConfiguration(): void {
        // TBD
    }

}