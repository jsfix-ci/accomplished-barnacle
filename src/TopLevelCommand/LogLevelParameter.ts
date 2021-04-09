import { LogLevel } from 'sitka';
import { CommandLineParameter } from './CommandLineParameter';

export class LogLevelParameter extends CommandLineParameter<LogLevel> {
    private readonly allowedLogLevels = ['ALL', 'ERROR', 'WARN', 'DEBUG', 'INFO'];

    constructor(key: string, description: string, isMandatory: boolean, defaultValue: LogLevel = LogLevel.WARN) {
        super(key, description, isMandatory);
        this._value = defaultValue;
    }

    public validate(value: string): string | undefined {
        if (!this.allowedLogLevels.some(aLogLevel => aLogLevel.toLowerCase() === value.toLowerCase())) {
            let descriptionAllowed = '';
            this.allowedLogLevels.forEach(aLogLevel => {
                descriptionAllowed = descriptionAllowed + aLogLevel + ', ';
            })
            descriptionAllowed.substr(0, descriptionAllowed.length - 2);
            return 'unknown log-level ' + value + '. Valid values are: ' + descriptionAllowed;
        }
    }

    public setValue(value: string): void {
        switch (value.toLowerCase()) {
            case 'all':
                this._value = LogLevel.ALL;
                break;
            case 'info':
                this._value = LogLevel.INFO;
                break;
            case 'error':
                this._value = LogLevel.ERROR;
                break;
            case 'warn':
                this._value = LogLevel.WARN;
                break;
            case 'debug':
                this._value = LogLevel.DEBUG;
                break;
        }
    }
}