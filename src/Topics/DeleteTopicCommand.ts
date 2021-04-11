import { Logger } from "sitka";
import { StringParameter } from "../TopLevelCommand/StringParameter";
import { Backend } from '../Backend/Backend';
import { CommandLineParameter } from "../TopLevelCommand/CommandLineParameter";
import { ISettings } from "../TopLevelCommand/ISettings";
import { ITopLevelCommand } from "../TopLevelCommand/ITopLevelCommand";

export class DeleteTopicCommand implements ITopLevelCommand {
    public readonly name = 'delete-topic';
    private idKey = 'id'

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public commandLineParameters(): { key: string; parameter: CommandLineParameter<any>; }[] {
        return [{
            key: this.idKey,
            parameter: new StringParameter('id', 'id of topic to delete', true)
        }];
    }

    public async run(settings: ISettings, logger: Logger): Promise<void> {
        const idOfTopic = settings.valueOf(this.idKey);
        Backend.initializeBackend(settings, logger).then(
            (backend) => {
                const topic = backend.getAvailableTopics().find(topic => topic.id === idOfTopic);
                if (topic !== undefined) {
                    backend.deleteTopic(topic);
                    logger.info('deleted topic (' + topic.id + ') with name ' + topic.name);
                } else {
                    logger.error('no topic with id ' + idOfTopic + ' available');
                }
                backend.disconnect();
            }
        )
    }
}