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

    delete(clientUrl: string): void {
        try {
            this.logger.debug('DELETE ' + clientUrl);
            const urlObject = new url.URL(clientUrl);
            const options = {
                hostname: urlObject.hostname,
                port: urlObject.port,
                path: urlObject.pathname,
                method: 'DELETE',
            }
            const req = this.requestHttp(options, (res: http.IncomingMessage) => {
                if (res.statusCode !== undefined && res.statusCode !== 200) {
                    this.logger.error('could not transmit message to ' + clientUrl);
                    this.logger.error(' request returned with HTTP result code ' + res.statusCode);
                }
            });
            req.end();
        } catch (e) {
            this.logger.error(e);
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
                    'Content-Type': 'application/json; charset=utf-8',
                    "Accept-Encoding": "gzip"
                }
            }
            const req = this.requestHttp(options, (res: http.IncomingMessage) => {
                if (res.statusCode !== undefined && res.statusCode !== 200) {
                    this.logger.error('could not transmit message to ' + clientUrl);
                    this.logger.error(' request returned with HTTP result code ' + res.statusCode);
                    this.logger.error(' transferred json ' + JSON.stringify(json));
                }
            });

            req.write(asString);
            req.end();
        } catch (e) {
            console.log(e.message);
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