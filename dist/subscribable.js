"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscribable = void 0;
class Subscribable {
    constructor() {
        this.listeners = [];
    }
    subscribe(listener) {
        this.listeners.push(listener);
    }
    publish(value) {
        for (const listener of this.listeners) {
            listener(value);
        }
    }
}
exports.Subscribable = Subscribable;
