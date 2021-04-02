import http from 'http';
import url from 'url';

import { Logger } from 'sitka';
import { IHTTPClient } from 'prime-barnacle';
import { Observable, Subject } from 'rxjs';
import { ObjectEventREST } from 'choicest-barnacle';

export class HttpClient implements IHTTPClient {
    private logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }

    postJson(clientUrl: string, json: ObjectEventREST): void {
        this.logger.info('POST Json' + clientUrl + ' ' + json);
        throw new Error('Method not implemented.');
    }

    get(clientUrl: string): Observable<ObjectEventREST> {
        this.logger.info('GET ' + clientUrl);
        const reporter = new Subject<ObjectEventREST>();
        const urlObject = new url.URL(clientUrl);

        http.get(urlObject,
            (res) => {
                const statusCode = res.statusCode;
                if (statusCode !== 200) {
                    reporter.error(statusCode);
                    // consume response data to free up memory
                    res.resume;
                    return;
                }

                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', (chunk) => rawData += chunk);
                res.on('end', () => {
                    try {
                        const parsedData = JSON.parse(rawData);
                        rawData = '';
                        reporter.next(parsedData);
                        reporter.complete();

                    } catch (e) {
                        reporter.error(statusCode);
                    }
                });
            }).on('error', (e) => {
                reporter.error(e.message);
            });

        return reporter;
    }

}