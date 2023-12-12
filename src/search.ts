import { Subscribable } from "./subscribable";

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
    subscribe(listener: Parameters<typeof this.subject.subscribe>[0]): void {
        this.subject.subscribe(listener);
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

export interface Entity2dSearch<T> {
    /**
     * Initialize internal state and delete registered entities.
     */
    init(): void;

    /**
     * Search registered entity with react angle range.
     * @param query 
     */
    search(query: SearchQuery): SearchResult<T>;

    /**
     * Register entity to internal state.
     * @param entity 
     */
    register(entities: T[]): void;

    /**
     * Delete entity from internal state.
     * @param entity 
     */
    delete(entities: T[]): void;

    /**
     * Get number of registered entities.
     */
    size: Readonly<number>;
}
