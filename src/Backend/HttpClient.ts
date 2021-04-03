import http from 'http';
import https from 'https';

import url from 'url';

import { Logger } from 'sitka';
import { IHTTPClient } from 'prime-barnacle';
import { Observable } from 'rxjs';
import { ObjectEventREST } from 'choicest-barnacle';

export class HttpClient implements IHTTPClient {
    private readonly logger: Logger;
    private readonly getHttp;
    private readonly requestHttp;

    constructor(logger: Logger, isHttps = true) {
        this.logger = logger;
        if (isHttps) {
            this.getHttp = https.get;
            this.requestHttp = https.request;
        } else {
            this.getHttp = http.get;
            this.requestHttp = http.request;
        }
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
            const req = this.requestHttp(options);

            req.write(asString);
            req.end();
        } catch (e) {
            console.log(e);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(clientUrl: string): Observable<any> {
        this.logger.debug('GET ' + clientUrl);
        const urlObject = new url.URL(clientUrl);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new Observable<any>(subscriber => {
            this.getHttp(urlObject,
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
                            if (parsedData instanceof Array) {
                                parsedData.map((aObject: ObjectEventREST) => subscriber.next(aObject));
                            } else {
                                subscriber.next(parsedData);
                            }
                            subscriber.complete();

                        } catch (e) {
                            subscriber.error(e.message);
                        }
                    });
                }).on('error', (e) => {
                    subscriber.error(e.message);
                });
        });
    }
}