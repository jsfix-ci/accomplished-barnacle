import http from 'http';
import url from 'url';

import { Logger } from 'sitka';
import { IHTTPClient } from 'prime-barnacle';
import { Observable } from 'rxjs';
import { ObjectEventREST } from 'choicest-barnacle';

export class HttpClient implements IHTTPClient {
    private logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }

    postJson(clientUrl: string, json: ObjectEventREST): void {
        try {
            this.logger.debug('POST Json ' + clientUrl + ' ' + json);
            const asString = JSON.stringify(json);
            const urlObject = new url.URL(clientUrl);
            const options = {
                hostname: urlObject.hostname,
                port: urlObject.port,
                path: urlObject.pathname,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': asString.length
                }
            }

            const req = http.request(options);

            req.write(asString);
            req.end();
        } catch (e) {
            console.log(e);
        }
    }

    get(clientUrl: string): Observable<ObjectEventREST> {
        this.logger.debug('GET ' + clientUrl);
        const urlObject = new url.URL(clientUrl);

        return new Observable<ObjectEventREST>(subscriber => {
            http.get(urlObject,
                (res) => {
                    const statusCode = res.statusCode;
                    if (statusCode !== 200) {
                        subscriber.error(statusCode);
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

                            parsedData.map((aObject: ObjectEventREST) => subscriber.next(aObject));
                            subscriber.complete();

                        } catch (e) {
                            subscriber.error(statusCode);
                        }
                    });
                }).on('error', (e) => {
                    subscriber.error(e.message);
                });
        });
    }
}