import { Logger } from 'sitka';

export class Settings {
    private logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }

    public parseCommandLineArguments(args: string[]): void {
        args.forEach(arg => this.logger.info(arg));
    }
}