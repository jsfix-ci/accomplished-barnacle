import { Connector } from "./Connector";
import { TrelloConnector } from "./Trello/TrelloConnector";

export class AllConnectors {
    public static allConnectors(): Connector[] {
        const result: Connector[] = [];
        result.push(new TrelloConnector());
        return result;
    }
}