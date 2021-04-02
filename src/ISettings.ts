export type BackendConfiguration = {
    endpoint: string
};

export interface ISettings {
    backendConfiguration(): BackendConfiguration;
}