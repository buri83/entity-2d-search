import { Subscribable, Subscriber } from "./subscribable";

export type EntityId = string;

export type Position = {
    x: number;
    y: number;
}

export type SearchableEntity = {
    id: Readonly<EntityId>;
    position: EntityPosition
}

export class EntityPosition {
    constructor(private position: Position) { }

    private subject = new Subscribable<Position>()
    static subscribe(entityPosition: EntityPosition, id: string | Symbol, subscriber: Subscriber<Position>): void {
        entityPosition.subject.subscribe(id, subscriber);
    }

    static unsubscribe(entityPosition: EntityPosition, id: string | Symbol): void {
        entityPosition.subject.unsubscribe(id);
    }

    get(): Position {
        return { ... this.position };
    }

    set(position: Position): void {
        this.position = { ...position };
        this.subject.publish(this.get());
    }

    get x(): number {
        return this.position.x;
    }
    set x(value: number) {
        this.position.x = value;
        this.subject.publish(this.get());
    }

    get y(): number {
        return this.position.y;
    }
    set y(value: number) {
        this.position.y = value;
        this.subject.publish(this.get());
    }
}


export type SearchQuery = {
    position: {
        xFrom: number;
        xTo: number;
        yFrom: number;
        yTo: number;
    }
}

export type SearchResult<T> = {
    entities: T[]
}

export type EntitySearch2D<T> = {
    /**
     * Get number of registered entities.
     */
    size: Readonly<number>;

    /**
     * Register entity to internal state.
     * @param entity 
     */
    register(entity: T): void;

    /**
     * Deregister entity from internal state.
     * @param entity 
     */
    deregister(entity: T): void;

    /**
     * Deregister all entities from internal state.
     * Please call before dispose it instance to prevent memory leak.
     */
    deregisterAll(): void;

    /**
     * Search registered entity with react angle range.
     * @param query 
     */
    search(query: SearchQuery): SearchResult<T>;
}
