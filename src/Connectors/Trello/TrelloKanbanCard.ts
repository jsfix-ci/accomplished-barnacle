export type TrelloTransition = {
    toList: string,
    at: Date,
};

export enum TrelloKanbanCardProperties {
    ID = 'TRELLO_ID'
}

export class TrelloKanbanCard {
    public readonly name: string;
    public readonly id: string;
    public readonly transitions: TrelloTransition[] = [];
    public createdAt: Date = undefined;
    public readonly labels: string[];

    constructor(name: string, id: string, labels: string[]) {
        this.name = name;
        this.id = id;
        this.labels = labels;
    }

    public addTransition(toList: string, at: Date): void {
        if (this.createdAt === undefined || this.createdAt > at) {
            this.createdAt = at;
        }
        this.transitions.push({ toList: toList, at: at });
    }
}