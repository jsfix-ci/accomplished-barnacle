import { TrelloConfiguration } from "./TrelloConfiguration";
import { HttpClient } from "../../Backend/HttpClient";
import { Observable, of, concat } from "rxjs";
import { map, mergeAll, reduce, concatMap } from 'rxjs/operators';
import { TrelloKanbanCard } from './TrelloKanbanCard';

type TrelloCardResponse = {
    name: string,
    id: string,
    labels: { name: string }[]
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
        },
        listBefore: { id: string, name: string },
        listAfter: { id: string, name: string }
    }
}

export class FetchKanbanCardsFromTrelloService {
    public fetch(httpClient: HttpClient, configuration: TrelloConfiguration): Observable<TrelloKanbanCard> {
        const rateLimitPerCardMs = 200;
        return httpClient.get(configuration.cardURL()).pipe(map<TrelloCardResponse, TrelloKanbanCard>(
            (value: TrelloCardResponse) => {
                return new TrelloKanbanCard(value.name, value.id, value.labels.map(completeLabelInfo => completeLabelInfo.name));
            }),
            // wait for 0.1 seconds, as this is the rate limit imposed by Trello
            concatMap(value => {
                return new Promise(resolve => setTimeout(() => resolve(value), rateLimitPerCardMs));
            }),
            concatMap(value => {
                return of(value);
            }),
            map<TrelloKanbanCard, Observable<TrelloKanbanCard>>(
                (card: TrelloKanbanCard) => {
                    const nonClosedActions = httpClient.get(configuration.actionsOfCardURL(card.id)).pipe(
                        reduce<TrelloActionResponse, TrelloKanbanCard>((acc: TrelloKanbanCard, value: TrelloActionResponse) => {
                            return this.mergeWithTrelloAction(acc, value);
                        }, card)
                    );

                    const closedActions = httpClient.get(configuration.actionsOfCardURL(card.id, true)).pipe(
                        reduce<TrelloActionResponse, TrelloKanbanCard>((acc: TrelloKanbanCard, value: TrelloActionResponse) => {
                            return this.mergeWithTrelloAction(acc, value);
                        }, card)
                    )
                    return concat(nonClosedActions, closedActions);
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
                // eslint-disable-next-line no-prototype-builtins
                if (action.data.hasOwnProperty('listAfter') && action.data.listAfter.hasOwnProperty('name')) {
                    kanbanCard.addTransition(action.data.listAfter.name, new Date(action.date));
                } else {
                    console.log(action);
                }
                break;
            case 'closed':
                console.log('closed trello action:' + action.data);
                break;
            default:
                console.log(action);
        }
        return kanbanCard;
    }
}