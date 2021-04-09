import { Logger } from "sitka";
import { Backend } from '../Backend/Backend';
import { CommandLineParameter } from "../TopLevelCommand/CommandLineParameter";
import { ISettings } from "../TopLevelCommand/ISettings";
import { ITopLevelCommand } from "../TopLevelCommand/ITopLevelCommand";

export class ListTopicsCommand implements ITopLevelCommand {
    public readonly name = 'list-topics';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public commandLineParameters(): { key: string; parameter: CommandLineParameter<any>; }[] {
        return [];
    }

    public async run(settings: ISettings, logger: Logger): Promise<void> {
        Backend.initializeBackend(settings, logger).then(
            (backend) => {
                console.log('available topics are:')
                backend.getAvailableTopics().forEach(topic => {
                    console.log(topic.id + ': ' + topic.name);
                });
                backend.disconnect();
            }
        )
    }
}