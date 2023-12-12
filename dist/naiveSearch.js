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
            const isContained = (query.position.xFrom <= entity.position.x && entity.position.x <= query.position.xTo)
                && (query.position.yFrom <= entity.position.y && entity.position.y <= query.position.yTo);
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
