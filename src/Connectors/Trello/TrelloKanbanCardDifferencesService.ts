import { Topic, ObjectEvent } from "choicest-barnacle";
import { Logger } from 'sitka';
import { HeijunkaBoard } from "outstanding-barnacle";
import { TrelloConfiguration, TrelloCardResponse, TrelloActionResponse } from "./TrelloConfiguration";
import { DifferencesService } from "../DifferencesService";
import { HttpClient } from "../../Backend/HttpClient";
import { Observable, of } from "rxjs";
import { map, mergeAll, reduce, concatMap } from 'rxjs/operators';

type TrelloTransition = {
    toList: string,
    at: Date,
};

class TrelloKanbanCard {
    public readonly name: string;
    public readonly id: string;
    public readonly transitions: TrelloTransition[] = [];
    public createdAt: Date = undefined;

    constructor(name: string, id: string) {
        this.name = name;
        this.id = id;
    }

    public addTransition(toList: string, at: Date) {
        this.transitions.push({ toList: toList, at: at });
    }

    public toString(): string {
        let result: string = this.name;
        if (this.createdAt !== undefined) {
            result = result + ' (' + this.createdAt.toDateString() + ')';
        }
        result = result + ' #transitions = ' + this.transitions.length;
        return result;
    }
}

export class TrelloKanbanCardDifferencesService extends DifferencesService {
    private configuration: TrelloConfiguration;

    constructor(configuration: TrelloConfiguration) {
        super();
        this.configuration = configuration;
    }

    public reconciliate(topic: Topic, board: HeijunkaBoard, logger: Logger): Observable<ObjectEvent> {
        const kanbanCardsOnTrelloBoard = this.getKanbanCardsOnTrelloBoard(logger).subscribe({
            next(kanbanCard: TrelloKanbanCard) {
                console.log(kanbanCard.toString());
            }
        });

        // 1. build 
        return new Observable(subscriber => {
            subscriber.complete();
        });
    }

    private getKanbanCardsOnTrelloBoard(logger: Logger): Observable<TrelloKanbanCard> {
        const httpClient = new HttpClient(logger, true);
        return httpClient.get(this.configuration.cardURL()).pipe(map<TrelloCardResponse, TrelloKanbanCard>(
            (value: TrelloCardResponse) => {
                return new TrelloKanbanCard(value.name, value.id);
            }),
            concatMap(value => {
                // return a promise that resolves with the specified value after 0.1 seconds
                return new Promise(resolve => setTimeout(() => resolve(value), 100));
            }),
            concatMap(value => {
                return of(value);
            }),
            map<TrelloKanbanCard, Observable<TrelloKanbanCard>>(
                (card: TrelloKanbanCard) => {
                    const anotherHttpClient = new HttpClient(logger, true);
                    return anotherHttpClient.get(this.configuration.actionsOfCardURL(card.id)).pipe(
                        reduce<TrelloActionResponse, TrelloKanbanCard>((acc: TrelloKanbanCard, value: TrelloActionResponse) => {
                            return this.mergeWithTrelloAction(acc, value);
                        }, card)
                    )
                }
            ),
            mergeAll<TrelloKanbanCard>()
        );
    }

    private mergeWithTrelloAction(kanbanCard: TrelloKanbanCard, action: TrelloActionResponse): TrelloKanbanCard {
        switch (action.type) {
            case 'createCard':
                kanbanCard.createdAt = new Date(action.date);
                kanbanCard.addTransition(action.data.list.name, new Date(action.date));
                break;
            case 'updateCard':
                kanbanCard.addTransition(action.data.listAfter.name, new Date(action.date));
                break;
            default:
                console.log(action);
        }
        return kanbanCard;
    }
}