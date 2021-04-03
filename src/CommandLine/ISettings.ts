import { Connector } from '../Connectors/Connector';

export type BackendConfiguration = {
    endpoint: string
};

export interface ISettings {
    backendConfiguration(): BackendConfiguration;
    selectedConnector(): Connector;
}