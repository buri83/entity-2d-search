export type EntityId = string;
export type Position = {
    x: number;
    y: number;
};
export type SearchableEntity = {
    id: Readonly<EntityId>;
    position: EntityPosition;
};
export declare class EntityPosition {
    private position;
    constructor(position: Position);
    private subject;
    subscribe(listener: Parameters<typeof this.subject.subscribe>[0]): void;
    get(): Position;
    set(position: Position): void;
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
}
export type SearchQuery = {
    position: {
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
