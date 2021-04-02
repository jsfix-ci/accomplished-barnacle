import { ObjectEvent, Topic } from "choicest-barnacle";
import { HeijunkaBoard, ObjectEventCommandProcessor } from "outstanding-barnacle";
import { Backend } from "../Backend/Backend";

export class DomainModel {
    private localProcessor: ObjectEventCommandProcessor;
    private topic: Topic;
    private backend: Backend;

    constructor(topic: Topic, backend: Backend) {
        this.localProcessor = new ObjectEventCommandProcessor();
        this.backend = backend;
        backend.getObjectEvents().subscribe((objectEvent: ObjectEvent) => {
            this.processLocalDomainModel(objectEvent);
        });
        backend.switchToTopic(topic);
    }

    public getDomainModel(): HeijunkaBoard {
        return this.localProcessor.getHeijunkaBoard();
    }

    public process(objectEvent: ObjectEvent): void {
        this.processLocalDomainModel(objectEvent);
        this.saveInBackend(objectEvent);
    }

    private processLocalDomainModel(objectEvent: ObjectEvent): void {
        if (objectEvent.topic !== this.topic.id) {
            return;
        }
        this.localProcessor.process(objectEvent);
    }

    private saveInBackend(objectEvent: ObjectEvent): void {
        if (objectEvent.topic !== this.topic.id) {
            return;
        }
        this.backend;
    }
}