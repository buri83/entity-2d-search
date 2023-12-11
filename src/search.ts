import { Subject } from "rxjs";

export type EntityId = string;

export type SearchableEntity = {
    id: Readonly<EntityId>;
    location: EntityLocation
}

export class EntityLocation {
    constructor(private location: { x: number, y: number }) { }

    private subject = new Subject<EntityLocation["location"]>()
    subscribe(listener: Parameters<typeof this.subject.subscribe>[0]): void {
        this.subject.subscribe(listener);
    }

    get(): EntityLocation["location"] {
        return { ... this.location };
    }

    set(location: EntityLocation["location"]): void {
        this.location = { ...location };
        this.subject.next(this.get());
    }

    get x(): number {
        return this.location.x;
    }
    set x(value: number) {
        this.location.x = value;
        this.subject.next(this.get());
    }

    get y(): number {
        return this.location.y;
    }
    set y(value: number) {
        this.location.y = value;
        this.subject.next(this.get());
    }
}


export type SearchQuery = {
    location: {
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
