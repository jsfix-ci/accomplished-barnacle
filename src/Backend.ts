import { Logger } from 'sitka';


export class Backend {
    private logger: Logger;
    private configuration: any;

    constructor(configuration: any, logger: Logger) {
        this.logger = logger;
        this.configuration = configuration;
    }
}