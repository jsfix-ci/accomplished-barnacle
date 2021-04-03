import { TrelloConfiguration } from "./TrelloConfiguration";
import { HttpClient } from "../../Backend/HttpClient";
import { Observable, of } from "rxjs";
import { map, mergeAll, reduce, concatMap } from 'rxjs/operators';
import { TrelloKanbanCard } from './TrelloKanbanCard';

type TrelloCardResponse = {
    name: string,
    id: string
}

type TrelloActionResponse = {
    name: string,
    id: string,
    date: string,
    type: string,
    data: {
        list: {
            id: string,
            name: string
        }
        listBefore: { id: string, name: string },
        listAfter: { id: string, name: string }
    }
}

export class FetchKanbanCardsFromTrelloService {
    public fetch(httpClient: HttpClient, configuration: TrelloConfiguration): Observable<TrelloKanbanCard> {
        return httpClient.get(configuration.cardURL()).pipe(map<TrelloCardResponse, TrelloKanbanCard>(
            (value: TrelloCardResponse) => {
                return new TrelloKanbanCard(value.name, value.id);
            }),
            // wait for 0.1 seconds, as this is the rate limit imposed by Trello
            concatMap(value => {

                return new Promise(resolve => setTimeout(() => resolve(value), 100));
            }),
            concatMap(value => {
                return of(value);
            }),
            map<TrelloKanbanCard, Observable<TrelloKanbanCard>>(
                (card: TrelloKanbanCard) => {
                    return httpClient.get(configuration.actionsOfCardURL(card.id)).pipe(
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