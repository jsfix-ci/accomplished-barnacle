import { Topic, ObjectEvent } from "choicest-barnacle";
import { Logger } from 'sitka';
import { HeijunkaBoard } from "outstanding-barnacle";
import { TrelloConfiguration, TrelloCardResponse } from "./TrelloConfiguration";
import { DifferencesService } from "../DifferencesService";
import { HttpClient } from "../../Backend/HttpClient";
import { Observable, from } from "rxjs";
import { map, mergeAll, take } from 'rxjs/operators';

export class TrelloKanbanCardDifferencesService extends DifferencesService {
    private configuration: TrelloConfiguration;

    constructor(configuration: TrelloConfiguration) {
        super();
        this.configuration = configuration;
    }

    public reconciliate(topic: Topic, board: HeijunkaBoard, logger: Logger): Observable<ObjectEvent> {
        const httpClient = new HttpClient(logger, true);

        return httpClient.get(this.configuration.cardURL()).pipe(map<TrelloCardResponse, string>(
            (value: TrelloCardResponse) => {
                console.log(value);
                return value.id;
            }),
            take(3),
            map<string, Observable<ObjectEvent>>(
                (id: string) => {
                    console.log(this.configuration.actionsOfCardURL(id));
                    return from([])
                }
            ),
            mergeAll<ObjectEvent>()
        );
    }
}