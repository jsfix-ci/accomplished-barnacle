import { Logger } from 'sitka';

type BackendConfiguration = {
    endpoint: string
};

export class Backend {
    private logger: Logger;
    private configuration: BackendConfiguration;

    constructor(configuration: BackendConfiguration, logger: Logger) {
        this.logger = logger;
        this.configuration = configuration;
    }

    public connect(): void {
        this.logger.info('connecting with backend at ' + this.configuration.endpoint);
    }
}