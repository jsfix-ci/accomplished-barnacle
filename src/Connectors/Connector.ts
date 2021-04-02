import { Topic } from "choicest-barnacle";
import { ITopicService } from "../Backend/ITopicService";
import { Configuration } from "./Configuration"

export abstract class Connector {
    private _configuration: Configuration = undefined;
    public readonly name: string;

    constructor(name: string) {
        this.name = name;
    }

    abstract selectTopic(topicService: ITopicService): Topic;

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any
    public readConfiguration(configuration: any): void {
        if (this._configuration === undefined) {
            return;
        }
        this._configuration.validate(configuration);
        this._configuration.read(configuration);
    }

    protected setConfiguration(configuration: Configuration): void {
        this._configuration = configuration;
    }
}