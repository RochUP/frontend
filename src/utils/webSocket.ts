import { EventEmitter } from 'events';

export default class Socket {
    public ws;
    private ee;

    constructor(ws: WebSocket, ee = new EventEmitter()) {
        this.ws = ws;
        this.ee = ee;
        ws.onmessage = this.message.bind(this);
        ws.onopen = this.open.bind(this);
        ws.onclose = this.close.bind(this);
        ws.onerror = this.error.bind(this);
    }

    on(name: string, fn: any) {
        this.ee.on(name, fn);
    }

    off(name: string, fn: any) {
        this.ee.removeListener(name, fn);
    }

    open() {
        this.ee.emit('connect');
    }

    close() {
        this.ee.emit('disconnect');
    }

    error(e: any) {
        console.log('websocket error: ', e);
    }

    emit(data: any) {
        this.ws.send(data);
    }

    message(e: any) {
        try {
            this.ee.emit('message', e);
        } catch (err) {
            this.ee.emit('error', err);
            console.log(Date().toString() + ': ', err);
        }
    }
}
