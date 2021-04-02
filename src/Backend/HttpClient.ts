import { IHTTPClient } from 'prime-barnacle';
import { Observable } from 'rxjs';

export class HttpClient implements IHTTPClient {
    postJson(url: string, json: any): void {
        throw new Error('Method not implemented.');
    }
    get(url: string): Observable<any> {
        throw new Error('Method not implemented.');
    }

}