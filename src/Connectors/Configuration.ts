/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export abstract class Configuration {
    abstract read(configuration: any): void;

    abstract validate(configuration: any): void;

    protected verifyThatConfigurationHasProperty(configuration: any, propertyName: string): void {
        // eslint-disable-next-line no-prototype-builtins
        if (!configuration.hasOwnProperty(propertyName)) {
            throw new Error('configuration does not have property ' + propertyName);
        }
    }
}