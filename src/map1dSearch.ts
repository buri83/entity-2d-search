import { Entity2dSearch, EntityId, SearchQuery, SearchResult, SearchableEntity } from "./search";

const DEFAULT_DIVIDE_COUNT = 64;

export type Map1dSearchSettings = {
    height: number;
    width: number;
    divideCount?: Partial<{
        height: number;
        width: number;
    }>;
};

export class Map1dSearch<T extends SearchableEntity> implements Entity2dSearch<T> {
    private entityIndexes: Map<EntityId, number> = new Map();
    private dividedAreas: Map<EntityId, T>[] = [];

    private divideCountHeight: number;
    private divideCountWidth: number;

    private areaHeight: number;
    private areaWidth: number;

    constructor(private readonly settings: Map1dSearchSettings) {
        this.divideCountHeight = (settings.divideCount?.height ?? DEFAULT_DIVIDE_COUNT)
        this.divideCountWidth = (settings.divideCount?.width ?? DEFAULT_DIVIDE_COUNT)

        this.areaHeight = settings.height / this.divideCountHeight;
        this.areaWidth = settings.width / this.divideCountWidth;

        this.init();
    }

    get size(): number {
        return this.entityIndexes.size;
    }

    init(): void {
        this.entityIndexes = new Map();
        this.dividedAreas = [...Array(this.divideCountWidth * this.divideCountHeight)].map(
            () => new Map<EntityId, T>()
        );
    }

    register(entities: T[]): void {
        for (const entity of entities) {
            // initialize
            this.updateEntity(entity);

            // UpdateEntity on position updated
            entity.position.subscribe(() => {
                this.updateEntity(entity);
            })
        }
    }

    delete(entities: T[]): void {
        for (const entity of entities) {
            const index = this.entityIndexes.get(entity.id);
            if (!index) {
                return;
            }
            this.dividedAreas[index].delete(entity.id);
            this.entityIndexes.delete(entity.id);
        }
    }


    search(query: SearchQuery): SearchResult<T> {
        const result: SearchResult<T> = {
            entities: []
        }

        const isFulfilled = (entity: T): boolean => {
            return (
                entity.position.x >= query.position.xFrom &&
                entity.position.x <= query.position.xTo &&
                entity.position.y >= query.position.yFrom &&
                entity.position.y <= query.position.yTo
            );
        };

        const yVisibleIndexFrom = this.toIndexY(query.position.yFrom);
        const yVisibleIndexTo = this.toIndexY(query.position.yTo);

        const xVisibleIndexFrom = this.toIndexX(query.position.xFrom);
        const xVisibleIndexTo = this.toIndexX(query.position.xTo);

        // 絶対範囲の内側なので isFulfilled() チェックはしない
        for (let y = yVisibleIndexFrom + 1; y <= yVisibleIndexTo - 1; y++) {
            for (let x = xVisibleIndexFrom + 1; x <= xVisibleIndexTo - 1; x++) {
                for (const target of this.dividedAreas[this.toIndexXY(x, y)].values()) {
                    result.entities.push(target)
                }
            }
        }

        // 範囲内に存在するかどうかわからないので isFulfilled() チェックが必要
        for (let x = xVisibleIndexFrom; x <= xVisibleIndexTo; x++) {
            // top 一列
            for (const target of this.dividedAreas[this.toIndexXY(x, yVisibleIndexFrom)].values()) {
                if (isFulfilled(target)) {
                    result.entities.push(target)
                }
            }

            // bottom 一列
            for (const target of this.dividedAreas[this.toIndexXY(x, yVisibleIndexTo)].values()) {
                if (isFulfilled(target)) {
                    result.entities.push(target)
                }
            }
        }
        for (let y = yVisibleIndexFrom + 1; y <= yVisibleIndexTo - 1; y++) {
            // left 一列
            for (const target of this.dividedAreas[this.toIndexXY(xVisibleIndexFrom, y)].values()) {
                if (isFulfilled(target)) {
                    result.entities.push(target)
                }
            }

            // right 一列
            for (const target of this.dividedAreas[this.toIndexXY(xVisibleIndexTo, y)].values()) {
                if (isFulfilled(target)) {
                    result.entities.push(target)
                }
            }
        }

        return result;
    }

    private updateEntity(entity: T): void {
        const newIndex = this.toIndexXY(this.toIndexX(entity.position.x), this.toIndexY(entity.position.y));
        const oldIndex = this.entityIndexes.get(entity.id);
        if (oldIndex) {
            this.dividedAreas[oldIndex].delete(entity.id);
        }
        this.entityIndexes.set(entity.id, newIndex);
        this.dividedAreas[newIndex].set(entity.id, entity);
    }


    private toIndexXY(xIndex: number, yIndex: number): number {
        return yIndex * this.divideCountWidth + xIndex;
    }

    private toIndexY(y: number): number {
        if (y <= 0) {
            return 0;
        }
        if (y >= this.settings.height) {
            return this.divideCountHeight - 1;
        }
        return Math.floor(y / this.areaHeight);
    }

    private toIndexX(x: number): number {
        if (x <= 0) {
            return 0;
        }
        if (x >= this.settings.width) {
            return this.divideCountWidth - 1;
        }
        return Math.floor(x / this.areaWidth);
    }
}
