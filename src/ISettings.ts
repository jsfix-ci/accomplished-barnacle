export type BackendConfiguration = {
    endpoint: string
};

export interface ISettings {
    backendConfiguration(): BackendConfiguration;
    selectedConnector(): string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    connectorConfiguration(): any;
}