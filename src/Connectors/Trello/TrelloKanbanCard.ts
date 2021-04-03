export type TrelloTransition = {
    toList: string,
    at: Date,
};

export class TrelloKanbanCard {
    public readonly name: string;
    public readonly id: string;
    public readonly transitions: TrelloTransition[] = [];
    public createdAt: Date = undefined;

    constructor(name: string, id: string) {
        this.name = name;
        this.id = id;
    }

    public addTransition(toList: string, at: Date): void {
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