import { DuplicateRegistrationError } from "./errors";
import { EntitySearch2D, EntityId, SearchQuery, SearchResult, SearchableEntity } from "./search";

export class NaiveSearch<T extends SearchableEntity> implements EntitySearch2D<T> {
    private entities: Map<EntityId, T> = new Map();

    get size(): number {
        return this.entities.size;
    }

    search(query: SearchQuery): SearchResult<T> {
        const entities: T[] = [];
        for (const entity of this.entities.values()) {
            const isContained =
                query.position.xFrom <= entity.position.x &&
                entity.position.x <= query.position.xTo &&
                query.position.yFrom <= entity.position.y &&
                entity.position.y <= query.position.yTo;
            if (isContained) {
                entities.push(entity);
            }
        }

        return {
            entities,
        };
    }

    register(entity: T): void {
        if (this.entities.has(entity.id)) {
            throw new DuplicateRegistrationError(`Could not register entity because it id=${entity.id} is already registered.`);
        }

        this.entities.set(entity.id, entity);
    }

    deregister(entity: T): void {
        this.entities.delete(entity.id);
    }

    deregisterAll(): void {
        this.entities = new Map();
    }
}
