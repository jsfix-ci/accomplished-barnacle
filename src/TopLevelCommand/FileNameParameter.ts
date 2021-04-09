import { CommandLineParameter } from './CommandLineParameter';
import { existsSync } from 'fs';

export class FileNameParameter extends CommandLineParameter<string> {
    constructor(key: string, description: string, isMandatory: boolean, defaultValue: string = undefined) {
        super(key, description, isMandatory);
        this.setValue(defaultValue);
    }

    public validate(value: string): string | undefined {
        if (!existsSync(value)) {
            return 'cannot find file at ' + value;
        }
    }

    public setValue(value: string): void {
        this._value = value;
    }
}