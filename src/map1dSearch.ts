import { Search2D, EntityId, SearchQuery, SearchResult, SearchableEntity, EntityPosition } from "./search";

const DEFAULT_DIVIDE_COUNT = 32;

export type Map1dSearchSettings = {
    height: number;
    width: number;
    divideCount?: Partial<{
        height: number;
        width: number;
    }>;
};

export class Map1dSearch<T extends SearchableEntity> implements Search2D<T> {
    private readonly subscriberId = Symbol();

    private entityIndexes: Map<EntityId, number> = new Map();
    private dividedAreas: Map<EntityId, T>[] = [];

    private divideCountHeight: number;
    private divideCountWidth: number;

    private areaHeight: number;
    private areaWidth: number;

    constructor(private readonly settings: Map1dSearchSettings) {
        this.divideCountHeight = settings.divideCount?.height ?? DEFAULT_DIVIDE_COUNT;
        this.divideCountWidth = settings.divideCount?.width ?? DEFAULT_DIVIDE_COUNT;

        this.areaHeight = settings.height / this.divideCountHeight;
        this.areaWidth = settings.width / this.divideCountWidth;

        this.dividedAreas = [...Array(this.divideCountWidth * this.divideCountHeight)].map(() => new Map<EntityId, T>());
    }

    get size(): number {
        return this.entityIndexes.size;
    }

    register(entity: T): void {
        if (this.entityIndexes.has(entity.id)) {
            return;
        }

        // initialize
        this.updateEntity(entity);

        // UpdateEntity on position updated
        EntityPosition.subscribe(entity.position, this.subscriberId, () => {
            this.updateEntity(entity);
        });
    }

    deregister(entity: T): void {
        const index = this.entityIndexes.get(entity.id);
        if (!index) {
            return;
        }
        this.dividedAreas[index].delete(entity.id);
        this.entityIndexes.delete(entity.id);
        EntityPosition.unsubscribe(entity.position, this.subscriberId);
    }

    deregisterAll(): void {
        for (const dividedArea of this.dividedAreas) {
            for (const entity of dividedArea.values()) {
                this.deregister(entity);
            }
        }
    }

    private updateEntity(entity: T): void {
        const newIndex = this.toIndexXY(this.toIndexX(entity.position.x), this.toIndexY(entity.position.y));
        const oldIndex = this.entityIndexes.get(entity.id);
        if (newIndex === oldIndex) {
            return;
        }

        if (oldIndex) {
            this.dividedAreas[oldIndex].delete(entity.id);
        }
        this.entityIndexes.set(entity.id, newIndex);
        this.dividedAreas[newIndex].set(entity.id, entity);
    }

    search(query: SearchQuery): SearchResult<T> {
        const isFulfilled = (entity: T): boolean => {
            return (
                entity.position.x >= query.position.xFrom &&
                entity.position.x <= query.position.xTo &&
                entity.position.y >= query.position.yFrom &&
                entity.position.y <= query.position.yTo
            );
        };

        const yIndexFrom = this.toIndexY(query.position.yFrom);
        const yIndexTo = this.toIndexY(query.position.yTo);

        const xIndexFrom = this.toIndexX(query.position.xFrom);
        const xIndexTo = this.toIndexX(query.position.xTo);

        const result: SearchResult<T> = {
            entities: [],
        };

        // 検索範囲が1マスに収まる場合、そのマスだけを単純に検索する
        if (yIndexFrom === yIndexTo && xIndexFrom === xIndexTo) {
            for (const entity of this.dividedAreas[this.toIndexXY(xIndexFrom, yIndexFrom)].values()) {
                if (isFulfilled(entity)) {
                    result.entities.push(entity);
                }
            }
            return result;
        }

        // 絶対範囲の内側なので isFulfilled() チェックはしない
        for (let y = yIndexFrom + 1; y <= yIndexTo - 1; y++) {
            for (let x = xIndexFrom + 1; x <= xIndexTo - 1; x++) {
                for (const target of this.dividedAreas[this.toIndexXY(x, y)].values()) {
                    result.entities.push(target);
                }
            }
        }

        // 範囲内に存在するかどうかわからないので isFulfilled() チェックが必要
        for (let x = xIndexFrom; x <= xIndexTo; x++) {
            // top 一列
            for (const target of this.dividedAreas[this.toIndexXY(x, yIndexFrom)].values()) {
                if (isFulfilled(target)) {
                    result.entities.push(target);
                }
            }

            // bottom 一列
            for (const target of this.dividedAreas[this.toIndexXY(x, yIndexTo)].values()) {
                if (isFulfilled(target)) {
                    result.entities.push(target);
                }
            }
        }
        for (let y = yIndexFrom + 1; y <= yIndexTo - 1; y++) {
            // left 一列
            for (const target of this.dividedAreas[this.toIndexXY(xIndexFrom, y)].values()) {
                if (isFulfilled(target)) {
                    result.entities.push(target);
                }
            }

            // right 一列
            for (const target of this.dividedAreas[this.toIndexXY(xIndexTo, y)].values()) {
                if (isFulfilled(target)) {
                    result.entities.push(target);
                }
            }
        }

        return result;
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
