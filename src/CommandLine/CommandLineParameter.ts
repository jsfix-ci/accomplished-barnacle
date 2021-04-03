import { Logger } from 'sitka';

export abstract class CommandLineParameter {
    public readonly key: string;
    public readonly description: string;
    public readonly isMandatory: boolean;

    private readonly _logger: Logger;

    constructor(logger: Logger, key: string, description: string, isMandatory: boolean) {
        this._logger = logger;
        this.key = key;
        this.description = description;
        this.isMandatory = isMandatory;
    }

    // returns validation error
    abstract validate(value: string): string | undefined;
}