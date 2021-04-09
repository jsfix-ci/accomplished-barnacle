import { ObjectEvent, Topic } from "choicest-barnacle";
import { HeijunkaBoard } from "outstanding-barnacle";
import { Logger } from "sitka";

import { IObjectEventProcessor } from "./IObjectEventProcessor";
import { ITopicService } from "../Backend/ITopicService";
import { Configuration } from "./Configuration"
import { DifferencesService } from './DifferencesService'
import { DomainDifferences } from './DomainDifferences';

export abstract class Connector {
    private _configuration: Configuration = undefined;
    private _differenceServices: Map<DomainDifferences, DifferencesService> = new Map<DomainDifferences, DifferencesService>();

    abstract selectTopic(topicService: ITopicService): Topic;

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any
    public readConfiguration(configuration: any): void {
        if (this._configuration === undefined) {
            return;
        }
        this._configuration.validate(configuration);
        this._configuration.read(configuration);
    }

    public async reconciliate(domainDifference: DomainDifferences, topic: Topic, board: HeijunkaBoard, processor: IObjectEventProcessor, logger: Logger): Promise<void> {
        if (!this._differenceServices.has(domainDifference)) {
            return;
        }
        let allObjectEventsForwarded = false;
        this._differenceServices.get(domainDifference).reconciliate(topic, board, logger).subscribe({
            next(objectEvent: ObjectEvent) {
                processor.process(objectEvent);
            },
            error(e) {
                logger.error(e.message);
                allObjectEventsForwarded = true;
            },
            complete() {
                logger.info('reconciliated differences for ' + domainDifference);
                allObjectEventsForwarded = true;
            }
        });

        let timeout = undefined;
        while (!allObjectEventsForwarded) {
            await new Promise(r => timeout = setTimeout(r, 100));
            clearTimeout(timeout);
            timeout = undefined;
        }
    }

    protected setConfiguration(configuration: Configuration): void {
        this._configuration = configuration;
    }

    protected setDifferencesService(domainDifference: DomainDifferences, differenceService: DifferencesService): void {
        this._differenceServices.set(domainDifference, differenceService);
    }
}