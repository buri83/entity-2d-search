import { Entity2dSearch, SearchQuery, SearchResult, SearchableEntity } from "./search";
export declare class NaiveSearch<T extends SearchableEntity> implements Entity2dSearch<T> {
    private entities;
    get size(): number;
    init(): void;
    search(query: SearchQuery): SearchResult<T>;
    register(entities: T[]): void;
    delete(entities: T[]): void;
}
