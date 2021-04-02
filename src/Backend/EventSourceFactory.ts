import { IEventSourceFactory } from 'prime-barnacle/dist/IEventSourceFactory';
import EventSource = require('eventsource');

export class EventSourceFactory implements IEventSourceFactory {
    createEventSource(url: string): EventSource {
        return new EventSource(url);
    }
}