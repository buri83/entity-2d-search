"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityLocation = void 0;
const rxjs_1 = require("rxjs");
class EntityLocation {
    constructor(location) {
        this.location = location;
        this.subject = new rxjs_1.Subject();
    }
    subscribe(listener) {
        this.subject.subscribe(listener);
    }
    get() {
        return Object.assign({}, this.location);
    }
    set(location) {
        this.location = Object.assign({}, location);
        this.subject.next(this.get());
    }
    get x() {
        return this.location.x;
    }
    set x(value) {
        this.location.x = value;
        this.subject.next(this.get());
    }
    get y() {
        return this.location.y;
    }
    set y(value) {
        this.location.y = value;
        this.subject.next(this.get());
    }
}
exports.EntityLocation = EntityLocation;
