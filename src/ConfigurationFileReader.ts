import { Logger } from 'sitka';
import { existsSync, readFileSync } from 'fs';

export class ConfigurationFileReader {
    private logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    read(configurationFilePath: string): any {
        if (existsSync(configurationFilePath)) {
            const rawConfig = readFileSync(configurationFilePath, 'utf8');
            this.logger.debug('read configuration file ' + configurationFilePath);
            return JSON.parse(rawConfig);
        }
        this.logger.error('cannot find configuration at ' + configurationFilePath);
        throw new Error('no configuration file found at ' + configurationFilePath);
    }
}