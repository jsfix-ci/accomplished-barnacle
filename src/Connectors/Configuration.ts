export abstract class Configuration {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    abstract read(configuration: any): void;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    abstract validate(configuration: any): void;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    protected verifyThatConfigurationHasProperty(configuration: any, propertyName: string): void {
        // eslint-disable-next-line no-prototype-builtins
        if (!configuration.hasOwnProperty(propertyName)) {
            throw new Error('configuration does not have property ' + propertyName);
        }
    }
}