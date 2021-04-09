import { Logger } from "sitka";
import { GeneralSettings } from "../CommandLine/GeneralSettings";
import { Backend } from '../Backend/Backend';
import { CommandLineParameter } from "../TopLevelCommand/CommandLineParameter";
import { ISettings } from "../TopLevelCommand/ISettings";
import { ITopLevelCommand } from "../TopLevelCommand/ITopLevelCommand";

export class ListTopicsCommand implements ITopLevelCommand {
    public readonly name = 'list-topics';
    private backend: Backend;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public commandLineParameters(): { key: string; parameter: CommandLineParameter<any>; }[] {
        return [];
    }

    public async run(settings: ISettings, logger: Logger): Promise<void> {
        await this.initializeBackend(settings, logger);

        console.log('available topics are:')
        this.backend.getAvailableTopics().forEach(topic => {
            console.log(topic.id + ': ' + topic.name);
        });
        this.backend.disconnect();
    }

    private async initializeBackend(settings: ISettings, logger: Logger): Promise<void> {
        this.backend = new Backend(settings.valueOf(GeneralSettings.BACKEND_CONFIGURATION_FILE), logger);
        this.backend.connect();
        await this.backend.blockUntilBackendHasProcessedRequests();
        logger.debug('initialized backend');
    }
}