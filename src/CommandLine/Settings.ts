import { Logger } from 'sitka';
import { ICommandLineArgumentsParser } from './ICommandLineArgumentsParser';
import { ISettings, BackendConfiguration } from './ISettings';
import { ConfigurationFileReader } from './ConfigurationFileReader';
import { Connector } from '../Connectors/Connector';
import { ConnectorFactory } from '../Connectors/ConnectorFactory';
import { CommandLineParameter } from './CommandLineParameter';
import { FileNameParameter } from './FileNameParameter';
import { LogLevelParameter } from './LogLevelParameter';
import { ConnectorNameParameter } from './ConnectorNameParameter';

enum SettingKey {
    BACKEND_CONFIGURATION_FILE = 'BACKEND_CONFIGURATION_FILE',
    CONNECTOR_NAME = 'CONNECTOR_NAME',
    CONNECTOR_FILE = 'CONNECTOR_FILE',
    LOG_LEVEL = 'LOG_LEVEL'
}

export class Settings implements ISettings, ICommandLineArgumentsParser {
    private logger: Logger;
    private connectorFactory: ConnectorFactory;
    private backendConfigurationSettings: BackendConfiguration;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private cliParameters: Map<SettingKey, CommandLineParameter<any>> = new Map<SettingKey, CommandLineParameter<any>>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private configurationConnector: any;

    constructor(logger: Logger, connectorFactory: ConnectorFactory) {
        this.logger = logger;
        this.connectorFactory = connectorFactory;

        this.cliParameters.set(SettingKey.CONNECTOR_NAME, new ConnectorNameParameter(logger, 'connector', 'connector name', true, connectorFactory));
        this.cliParameters.set(SettingKey.CONNECTOR_FILE, new FileNameParameter(logger, 'connector-config', 'connector configuration file', true));
        this.cliParameters.set(SettingKey.BACKEND_CONFIGURATION_FILE, new FileNameParameter(logger, 'backend', 'backend configuration file', false, './backend.json'));
        this.cliParameters.set(SettingKey.LOG_LEVEL, new LogLevelParameter(logger, 'log-level', 'level of log', false));
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
        this.readConnectorConfiguration();
        this.readBackendConfiguration();
        return true;
    }

    private parseCommandLineParameters(args: string[]): string[] {
        args.splice(0, 2);
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

    public backendConfiguration(): BackendConfiguration {
        return this.backendConfigurationSettings;
    }

    public selectedConnector(): Connector {
        return this.connectorFactory.initialize(
            this.cliParameters.get(SettingKey.CONNECTOR_NAME).getValue(),
            this.configurationConnector
        );
    }

    private readBackendConfiguration(): void {
        const configurationFileReader = new ConfigurationFileReader(this.logger);
        this.backendConfigurationSettings = configurationFileReader.read(this.cliParameters.get(SettingKey.BACKEND_CONFIGURATION_FILE).getValue());
    }

    private readConnectorConfiguration(): void {
        const configurationFileReader = new ConfigurationFileReader(this.logger);
        this.configurationConnector = configurationFileReader.read(this.cliParameters.get(SettingKey.CONNECTOR_FILE).getValue());
    }

    private printHelp(): void {
        console.log("usage: ");
        this.cliParameters.forEach(aParameter => {
            let description = aParameter.key;
            description = description + ' ' + (aParameter.isMandatory ? '(mandatory)' : '(optional)');
            description = description + ':' + (aParameter.description);
            console.log(" " + description)
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