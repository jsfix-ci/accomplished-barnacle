import { Topic, ObjectEvent } from "choicest-barnacle";
import { Logger } from 'sitka';
import { HeijunkaBoard, ProjectEventFactory } from "outstanding-barnacle";
import { TrelloConfiguration, TrelloBoardResponse } from "./TrelloConfiguration";
import { DifferencesService } from "../DifferencesService";
import { HttpClient } from "../../Backend/HttpClient";
import { Observable, from } from "rxjs";
import { map, mergeAll, mergeMap } from 'rxjs/operators';

export class TrelloProjectDifferencesService extends DifferencesService {
    private configuration: TrelloConfiguration;

    constructor(configuration: TrelloConfiguration) {
        super();
        this.configuration = configuration;
    }

    public reconciliate(topic: Topic, board: HeijunkaBoard, logger: Logger): Observable<ObjectEvent> {
        const aProjectIsAlreadyDefined = board.projects.getProjects().length > 0;
        if (aProjectIsAlreadyDefined) {
            return new Observable(subscriber => {
                subscriber.complete();
            });
        }

        const httpClient = new HttpClient(logger, true);

        return httpClient.get(this.configuration.boardURL()).pipe(map<TrelloBoardResponse, Observable<ObjectEvent>>(
            (value: TrelloBoardResponse) => {
                const projectName = value.name;
                const stateModel = board.stateModels.getStateModels()[0];
                const objectEvents = new ProjectEventFactory().create(topic, projectName, stateModel);
                logger.info('create project ' + projectName);
                return from(objectEvents);
            }),
            mergeAll<ObjectEvent>()
        );

    }
}