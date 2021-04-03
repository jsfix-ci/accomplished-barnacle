import { LogLevel } from 'sitka';
import { CommandLineParameter } from './CommandLineParameter';

export class LogLevelParameter extends CommandLineParameter<LogLevel> {
    private readonly allowedLogLevels = [LogLevel.ALL, LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG];

    constructor(key: string, description: string, isMandatory: boolean, defaultValue: LogLevel = LogLevel.WARN) {
        super(key, description, isMandatory);
        this._value = defaultValue;
    }

    public validate(value: string): string | undefined {
        if (!this.allowedLogLevels.some(aLogLevel => aLogLevel.toString().toLowerCase() === value.toLowerCase())) {
            let descriptionAllowed = '';
            this.allowedLogLevels.forEach(aLogLevel => {
                descriptionAllowed = descriptionAllowed + aLogLevel + ', ';
            })
            descriptionAllowed.substr(0, descriptionAllowed.length - 2);
            return 'unknown log-level ' + value + '. Valid values are: ' + descriptionAllowed;
        }
    }

    public setValue(value: string): void {
        this._value = this.allowedLogLevels.find(aLogLevel => aLogLevel.toString().toLowerCase() === value.toLowerCase());
    }
}