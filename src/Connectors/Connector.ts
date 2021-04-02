export abstract class Connector {
    abstract name(): string;
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any
    abstract readConfiguration(configuration: any): void;
}