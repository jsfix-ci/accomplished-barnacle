import { ICommandLineArgumentsParser } from './ICommandLineArgumentsParser';
import { ISettings, SettingKey } from './ISettings';
import { ITopLevelCommand } from '../ITopLevelCommand';
import { CommandLineParameter } from './CommandLineParameter';


export class Settings implements ISettings, ICommandLineArgumentsParser {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private cliParameters: Map<SettingKey, CommandLineParameter<any>> = new Map<SettingKey, CommandLineParameter<any>>();
    private commands: ITopLevelCommand[] = [];
    private selectedCommand: ITopLevelCommand;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public add(settingKey: SettingKey, parameter: CommandLineParameter<any>): void {
        this.cliParameters.set(settingKey, parameter);
    }

    public addCommand(toplevelCommand: ITopLevelCommand): void {
        this.commands.push(toplevelCommand);
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
    public valueOf(settingKey: SettingKey): any {
        return this.cliParameters.get(settingKey).getValue();
    }

    private findTopLevelCommand(name: string): ITopLevelCommand {
        return this.commands.find(command => command.name === name);
    }

    private parseCommandLineParameters(args: string[]): string[] {
        const validationErrors: string[] = [];

        args.splice(0, 2);
        this.selectedCommand = this.findTopLevelCommand(args[0]);
        if (this.selectedCommand === undefined) {
            validationErrors.push('unknown selectedCommand: ' + args[0]);
            return validationErrors;
        }
        args.splice(0, 1);

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

    private printHelp(): void {
        console.log("usage: ");
        this.cliParameters.forEach(aParameter => {
            let description = aParameter.key;
            description = description + ' ' + (aParameter.isMandatory ? '(mandatory)' : '(optional)');
            description = description + ': ' + (aParameter.description);
            console.log(" " + description);
        })
    }

    private findSettingKeyForParameter(parameter: string): SettingKey {
        let result: SettingKey = undefined;
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
}