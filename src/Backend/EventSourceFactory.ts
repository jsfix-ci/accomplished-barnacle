import { IEventSourceFactory } from 'prime-barnacle';
import EventSource from 'eventsource';

export class EventSourceFactory implements IEventSourceFactory {
    createEventSource(url: string): EventSource {
        return new EventSource(url);
    }
}