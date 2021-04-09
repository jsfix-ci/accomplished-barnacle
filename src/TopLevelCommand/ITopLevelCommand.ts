import { ISettings } from './ISettings';
import { CommandLineParameter } from './CommandLineParameter';
import { Logger } from 'sitka';

export interface ITopLevelCommand {
    readonly name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    commandLineParameters(): { key: string, parameter: CommandLineParameter<any> }[];

    run(settings: ISettings, logger: Logger): void;
}