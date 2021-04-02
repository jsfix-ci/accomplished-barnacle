import http from 'https';
import { Logger } from 'sitka';
import { IHTTPClient } from 'prime-barnacle';
import { Observable, Subject } from 'rxjs';
import { ObjectEventREST } from 'choicest-barnacle';

export class HttpClient implements IHTTPClient {
    private logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }

    postJson(url: string, json: ObjectEventREST): void {
        this.logger.info('POST Json' + url + ' ' + json);
        throw new Error('Method not implemented.');
    }

    get(url: string): Observable<ObjectEventREST> {
        this.logger.info('GET ' + url);
        const reporter = new Subject<ObjectEventREST>();
        const requestLogger = this.logger;

        http.get(url, (res) => {
            const statusCode = res.statusCode;

            if (statusCode !== 200) {
                reporter.error(statusCode);
                requestLogger.error(statusCode);
                // consume response data to free up memory
                res.resume;
                return;
            }

            res.setEncoding('utf8');
            let rawData: string;
            res.on('data', (chunk) => rawData += chunk);
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);
                    requestLogger.info(rawData);
                    reporter.next(parsedData);
                    reporter.complete();

                } catch (e) {
                    requestLogger.error(e);
                    reporter.error(statusCode);
                }
            });
        }).on('error', (e) => {
            requestLogger.error(e.message);
            reporter.error(e.message);
        });

        return reporter;
    }

}