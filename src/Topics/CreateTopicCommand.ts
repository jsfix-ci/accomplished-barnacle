import { Logger } from "sitka";
import { StringParameter } from "../TopLevelCommand/StringParameter";
import { Backend } from '../Backend/Backend';
import { CommandLineParameter } from "../TopLevelCommand/CommandLineParameter";
import { ISettings } from "../TopLevelCommand/ISettings";
import { ITopLevelCommand } from "../TopLevelCommand/ITopLevelCommand";

export class CreateTopicCommand implements ITopLevelCommand {
    public readonly name = 'create-topic';
    private nameKey = 'name'

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public commandLineParameters(): { key: string; parameter: CommandLineParameter<any>; }[] {
        return [{
            key: this.nameKey,
            parameter: new StringParameter('name', 'name of new topic', true)
        }];
    }

    public async run(settings: ISettings, logger: Logger): Promise<void> {
        const nameOfNewTopic = settings.valueOf(this.nameKey);
        Backend.initializeBackend(settings, logger).then(
            (backend) => {
                backend.createTopic(nameOfNewTopic);
                backend.disconnect();
            }
        )
    }
}