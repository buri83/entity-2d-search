import { Entity2dSearch, EntityId, SearchQuery, SearchResult, SearchableEntity } from "./search";

export class NaiveSearch<T extends SearchableEntity> implements Entity2dSearch<T> {
    private entities: Map<EntityId, T> = new Map();

    get size(): number {
        return this.entities.size;
    }

    init(): void {
        this.entities = new Map();
    }

    search(query: SearchQuery): SearchResult<T> {
        const entities: T[] = [];
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

    register(entities: T[]): void {
        for (const entity of entities) {
            this.entities.set(entity.id, entity);
        }
    }

    delete(entities: T[]): void {
        for (const entity of entities) {
            this.entities.delete(entity.id);
        }
    }
}