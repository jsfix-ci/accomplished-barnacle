import { ObjectEvent, Topic } from "choicest-barnacle";
import { HeijunkaBoard } from "outstanding-barnacle";
import { Observable } from "rxjs";
import { Logger } from "sitka";

export abstract class DifferencesService {
    abstract reconciliate(topic: Topic, board: HeijunkaBoard, logger: Logger): Observable<ObjectEvent>;
}