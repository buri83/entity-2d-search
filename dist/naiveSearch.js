"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NaiveSearch = void 0;
class NaiveSearch {
    constructor() {
        this.entities = new Map();
    }
    get size() {
        return this.entities.size;
    }
    init() {
        this.entities = new Map();
    }
    search(query) {
        const entities = [];
        for (const entity of this.entities.values()) {
            const isContained = (query.location.xFrom <= entity.location.x && entity.location.x <= query.location.xTo)
                && (query.location.yFrom <= entity.location.y && entity.location.y <= query.location.yTo);
            if (isContained) {
                entities.push(entity);
            }
        }
        return {
            entities,
        };
    }
    register(entities) {
        for (const entity of entities) {
            this.entities.set(entity.id, entity);
        }
    }
    delete(entities) {
        for (const entity of entities) {
            this.entities.delete(entity.id);
        }
    }
}
exports.NaiveSearch = NaiveSearch;
