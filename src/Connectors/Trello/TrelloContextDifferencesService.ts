import { Topic, ObjectEvent } from "choicest-barnacle";
import { Logger } from 'sitka';
import { Context, ContextEventFactory, HeijunkaBoard } from "outstanding-barnacle";
import { TrelloConfiguration } from "./TrelloConfiguration";
import { DifferencesService } from "../DifferencesService";
import { HttpClient } from "../../Backend/HttpClient";
import { Observable, from } from "rxjs";
import { map, mergeAll, reduce } from 'rxjs/operators';

class TrelloLabel {
    public readonly id: string;
    public readonly name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
}

class TrelloLabelResponse {
    id: string;
    name: string;
}

class TrelloJointContextState {
    private definedContexts: Context[];
    private topic: Topic;
    private eventFactory: ContextEventFactory = new ContextEventFactory();
    private reconciliationEvents: ObjectEvent[] = [];
    private logger: Logger;

    constructor(definedContexts: Context[], topic: Topic, logger: Logger) {
        this.definedContexts = definedContexts;
        this.topic = topic;
        this.logger = logger;
    }

    public getReconciliationEvents(): ObjectEvent[] {
        return [];
    }

    public has(contextName: string): boolean {
        return this.definedContexts.some(context => context.name === contextName);
    }

    public createContext(contextName: string): void {
        this.logger.info('creating context ' + contextName);
        this.reconciliationEvents.push(this.eventFactory.create(this.topic, contextName));
    }
}

export class TrelloContextDifferencesService extends DifferencesService {
    private configuration: TrelloConfiguration;

    constructor(configuration: TrelloConfiguration) {
        super();
        this.configuration = configuration;
    }

    public reconciliate(topic: Topic, board: HeijunkaBoard, logger: Logger): Observable<ObjectEvent> {
        const httpClient = new HttpClient(logger, true);
        const jointContextState = new TrelloJointContextState(board.contexts.getContexts(), topic, logger);

        return this.fetchContextsFromTrelloService(httpClient)
            .pipe(
                reduce<TrelloLabel, TrelloJointContextState>(
                    (acc: TrelloJointContextState, value: TrelloLabel) => {
                        return this.mergeTrelloLabel(value, acc);
                    },
                    jointContextState
                ),
                map<TrelloJointContextState, Observable<ObjectEvent>>(
                    value => { return from(value.getReconciliationEvents()) }
                ),
                mergeAll<ObjectEvent>()
            );
    }

    private fetchContextsFromTrelloService(httpClient: HttpClient): Observable<TrelloLabel> {
        return httpClient.get(this.configuration.labelURL()).pipe(map<TrelloLabelResponse, TrelloLabel>(
            (value: TrelloLabelResponse) => {
                return new TrelloLabel(value.id, value.name);
            })
        );
    }

    private mergeTrelloLabel(value: TrelloLabel, acc: TrelloJointContextState): TrelloJointContextState {
        if (!acc.has(value.name)) {
            acc.createContext(value.name);
        }
        return acc;
    }
}