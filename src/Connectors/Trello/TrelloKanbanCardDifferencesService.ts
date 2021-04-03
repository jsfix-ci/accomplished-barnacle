import { Topic, ObjectEvent } from "choicest-barnacle";
import { Logger } from 'sitka';
import { HeijunkaBoard } from "outstanding-barnacle";
import { TrelloConfiguration } from "./TrelloConfiguration";
import { DifferencesService } from "../DifferencesService";
import { HttpClient } from "../../Backend/HttpClient";
import { Observable } from "rxjs";
import { take } from 'rxjs/operators';
import { TrelloKanbanCard } from './TrelloKanbanCard';
import { FetchKanbanCardsFromTrelloService } from './FetchKanbanCardsFromTrelloService';

export class TrelloKanbanCardDifferencesService extends DifferencesService {
    private configuration: TrelloConfiguration;

    constructor(configuration: TrelloConfiguration) {
        super();
        this.configuration = configuration;
    }

    public reconciliate(topic: Topic, board: HeijunkaBoard, logger: Logger): Observable<ObjectEvent> {
        const httpClient = new HttpClient(logger, true);
        const kanbanCardsOnTrelloBoard = new FetchKanbanCardsFromTrelloService().fetch(httpClient, this.configuration).pipe(take(3));
        kanbanCardsOnTrelloBoard.subscribe({
            next(kanbanCard: TrelloKanbanCard) {
                console.log(kanbanCard.toString());
            }
        });

        // 1. build 
        return new Observable(subscriber => {
            subscriber.complete();
        });
    }
}