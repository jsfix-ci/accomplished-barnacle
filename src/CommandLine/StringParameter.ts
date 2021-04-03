import { Logger } from 'sitka';
import { CommandLineParameter } from './CommandLineParameter';

export class StringParameter extends CommandLineParameter<string> {
    constructor(logger: Logger, key: string, description: string, isMandatory: boolean, defaultValue: string = undefined) {
        super(logger, key, description, isMandatory);
        this.setValue(defaultValue);
    }

    public validate(): string | undefined {
        return;
    }

    public setValue(value: string): void {
        this._value = value;
    }
}