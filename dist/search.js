"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityPosition = void 0;
const subscribable_1 = require("./subscribable");
class EntityPosition {
    constructor(position) {
        this.position = position;
        this.subject = new subscribable_1.Subscribable();
    }
    subscribe(listener) {
        this.subject.subscribe(listener);
    }
    get() {
        return Object.assign({}, this.position);
    }
    set(position) {
        this.position = Object.assign({}, position);
        this.subject.publish(this.get());
    }
    get x() {
        return this.position.x;
    }
    set x(value) {
        this.position.x = value;
        this.subject.publish(this.get());
    }
    get y() {
        return this.position.y;
    }
    set y(value) {
        this.position.y = value;
        this.subject.publish(this.get());
    }
}
exports.EntityPosition = EntityPosition;
