import { CommandLineParameter } from './CommandLineParameter';

export class StringParameter extends CommandLineParameter<string> {
    constructor(key: string, description: string, isMandatory: boolean, defaultValue: string = undefined) {
        super(key, description, isMandatory);
        this.setValue(defaultValue);
    }

    public validate(): string | undefined {
        return;
    }

    public setValue(value: string): void {
        this._value = value;
    }
}