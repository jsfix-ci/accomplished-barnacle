import { ICommandLineArgumentsParser } from './ICommandLineArgumentsParser';
import { ISettings } from '../TopLevelCommand/ISettings';
import { ITopLevelCommand } from '../TopLevelCommand/ITopLevelCommand';
import { CommandLineParameter } from '../TopLevelCommand/CommandLineParameter';
import { GeneralSettings } from './GeneralSettings';
import { FileNameParameter } from '../TopLevelCommand/FileNameParameter';
import { LogLevelParameter } from './LogLevelParameter';

export class Settings implements ISettings, ICommandLineArgumentsParser {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private cliParameters: Map<string, CommandLineParameter<any>> = new Map<string, CommandLineParameter<any>>();
    private commands: ITopLevelCommand[] = [];
    private selectedCommand: ITopLevelCommand;

    constructor() {
        this.addParameter(GeneralSettings.BACKEND_CONFIGURATION_FILE, new FileNameParameter('backend', 'backend configuration file', false, './backend.json'));
        this.addParameter(GeneralSettings.LOG_LEVEL, new LogLevelParameter('log-level', 'level of log', false));
    }

    public add(toplevelCommand: ITopLevelCommand): void {
        this.commands.push(toplevelCommand);
    }

    public getSelectedCommand(): ITopLevelCommand {
        return this.selectedCommand;
    }

    public parseCommandLineArguments(args: string[]): boolean {
        const validationErrors: string[] = this.parseCommandLineParameters(args);
        const missingMandatoryParameters = this.validateMandatoryParametersHaveValues();
        missingMandatoryParameters.forEach(aMissingMandatoryParameter => validationErrors.push(aMissingMandatoryParameter));
        if (validationErrors.length > 0) {
            console.log('validation errors:');
            validationErrors.forEach(aValidationError => {
                console.log(aValidationError);
            })
            this.printHelp();
            return false;
        }
        return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public valueOf(settingKey: string): any {
        return this.cliParameters.get(settingKey).getValue();
    }

    private findTopLevelCommand(name: string): ITopLevelCommand {
        return this.commands.find(command => command.name === name);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private addParameter(settingKey: string, parameter: CommandLineParameter<any>): void {
        this.cliParameters.set(settingKey, parameter);
    }

    private parseCommandLineParameters(args: string[]): string[] {
        args.splice(0, 2);
        this.selectedCommand = this.findTopLevelCommand(args[0]);
        const validationErrors = this.readCommand(args[0]);
        if (validationErrors.length > 0) {
            return validationErrors;
        }
        args.splice(0, 1);
        return this.readParameters(args);
    }

    private printHelp(): void {
        console.log("usage: ");
        this.cliParameters.forEach(aParameter => {
            let description = aParameter.key;
            description = description + ' ' + (aParameter.isMandatory ? '(mandatory)' : '(optional)');
            description = description + ': ' + (aParameter.description);
            console.log(" " + description);
        })
    }

    private findSettingKeyForParameter(parameter: string): string {
        let result: string = undefined;
        this.cliParameters.forEach((value, key) => {
            if (value.key === parameter) {
                result = key;
            }
        });
        return result;
    }

    private validateMandatoryParametersHaveValues(): string[] {
        const validationErrors: string[] = [];
        this.cliParameters.forEach((value) => {
            if (value.isMandatory && !value.hasValue()) {
                validationErrors.push('missing value for mandatory parameter ' + value.key);
            }
        });
        return validationErrors;
    }

    private readCommand(commandName: string): string[] {
        this.selectedCommand = this.findTopLevelCommand(commandName);
        if (this.selectedCommand === undefined) {
            return ['unknown selectedCommand: ' + commandName];
        }
        const commandsParameters = this.selectedCommand.commandLineParameters();
        commandsParameters.forEach(parameter => {
            this.addParameter(parameter.key, parameter.parameter);
        })
        return [];
    }

    private readParameters(args: string[]): string[] {
        const validationErrors: string[] = [];
        while (args.length >= 2) {
            const key = args[0];
            const value = args[1];
            args.splice(0, 2);
            const settingKey = this.findSettingKeyForParameter(key);
            if (settingKey === undefined) {
                validationErrors.push('unknown parameter ' + key);
                continue;
            }
            const validationError = this.cliParameters.get(settingKey).validate(value);
            if (validationError !== undefined) {
                validationErrors.push(validationError);
            } else {
                this.cliParameters.get(settingKey).setValue(value);
            }
        }
        return validationErrors;
    }
}