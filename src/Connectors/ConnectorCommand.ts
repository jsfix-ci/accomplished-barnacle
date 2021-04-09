import { ITopLevelCommand } from "../ITopLevelCommand";

export class ConnectorCommand implements ITopLevelCommand {
    readonly name = "connect";
}