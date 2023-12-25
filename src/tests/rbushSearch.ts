import { Search2D, SearchQuery, SearchResult, SearchableEntity } from "../search";
import RBush from "rbush";

export class RBushSearch<T extends SearchableEntity> implements Search2D<T> {
    private tree = new RBush<T>();

    get size(): number {
        return this.tree.all().length;
    }

    search(query: SearchQuery): SearchResult<T> {
        const entities: T[] = this.tree.search({
            minX: query.position.xFrom,
            minY: query.position.yFrom,
            maxX: query.position.xTo,
            maxY: query.position.yTo,
        });

        return {
            entities,
        };
    }

    register(entity: T): void {
        this.tree.insert({
            minX: entity.position.x,
            minY: entity.position.y,
            maxX: entity.position.x,
            maxY: entity.position.y,
            ...entity,
        });
    }

    deregister(entity: T): void {
        this.tree.remove(entity);
    }

    deregisterAll(): void {
        this.tree.clear();
    }
}
