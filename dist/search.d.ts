export type EntityId = string;
export type SearchableEntity = {
    id: Readonly<EntityId>;
    location: EntityLocation;
};
export declare class EntityLocation {
    private location;
    constructor(location: {
        x: number;
        y: number;
    });
    private subject;
    subscribe(listener: Parameters<typeof this.subject.subscribe>[0]): void;
    get(): EntityLocation["location"];
    set(location: EntityLocation["location"]): void;
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
}
export type SearchQuery = {
    location: {
        xFrom: number;
        xTo: number;
        yFrom: number;
        yTo: number;
    };
};
export type SearchResult<T> = {
    entities: T[];
};
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
