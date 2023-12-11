import { Entity2dSearch, SearchQuery, SearchResult, SearchableEntity } from "./search";
export type Map1dSearchSettings = {
    height: number;
    width: number;
    divideCount?: Partial<{
        height: number;
        width: number;
    }>;
};
export declare class Map1dSearch<T extends SearchableEntity> implements Entity2dSearch<T> {
    private readonly settings;
    private entityIndexes;
    private dividedAreas;
    private divideCountHeight;
    private divideCountWidth;
    private areaHeight;
    private areaWidth;
    constructor(settings: Map1dSearchSettings);
    get size(): number;
    init(): void;
    register(entities: T[]): void;
    delete(entities: T[]): void;
    search(query: SearchQuery): SearchResult<T>;
    private updateEntity;
    private toIndexXY;
    private toIndexY;
    private toIndexX;
}
