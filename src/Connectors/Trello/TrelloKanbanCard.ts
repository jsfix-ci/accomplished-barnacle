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
    private readonly transitions: TrelloTransition[] = [];
    public createdAt: Date = undefined;
    public readonly labels: string[];

    constructor(name: string, id: string, labels: string[] = []) {
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

    public getTransitions(): TrelloTransition[] {
        const result: TrelloTransition[] = [];
        const sorted = this.transitions.sort((a, b) => a.at.getTime() - b.at.getTime());
        sorted.forEach(aTransition => {
            if (result.length === 0) {
                result.push(aTransition);
                return;
            }
            if (result[result.length - 1].toList !== aTransition.toList) {
                result.push(aTransition);
            }
        })
        return result;
    }
}