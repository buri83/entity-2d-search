"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Map1dSearch = void 0;
const DEFAULT_DIVIDE_COUNT = 64;
class Map1dSearch {
    constructor(settings) {
        var _a, _b, _c, _d;
        this.settings = settings;
        this.entityIndexes = new Map();
        this.dividedAreas = [];
        this.divideCountHeight = ((_b = (_a = settings.divideCount) === null || _a === void 0 ? void 0 : _a.height) !== null && _b !== void 0 ? _b : DEFAULT_DIVIDE_COUNT);
        this.divideCountWidth = ((_d = (_c = settings.divideCount) === null || _c === void 0 ? void 0 : _c.width) !== null && _d !== void 0 ? _d : DEFAULT_DIVIDE_COUNT);
        this.areaHeight = settings.height / this.divideCountHeight;
        this.areaWidth = settings.width / this.divideCountWidth;
        this.init();
    }
    get size() {
        return this.entityIndexes.size;
    }
    init() {
        this.entityIndexes = new Map();
        this.dividedAreas = [...Array(this.divideCountWidth * this.divideCountHeight)].map(() => new Map());
    }
    register(entities) {
        for (const entity of entities) {
            // initialize
            this.updateEntity(entity);
            // UpdateEntity on location updated
            entity.location.subscribe(() => {
                this.updateEntity(entity);
            });
        }
    }
    delete(entities) {
        for (const entity of entities) {
            const index = this.entityIndexes.get(entity.id);
            if (!index) {
                return;
            }
            this.dividedAreas[index].delete(entity.id);
            this.entityIndexes.delete(entity.id);
        }
    }
    search(query) {
        const result = {
            entities: []
        };
        const isFulfilled = (entity) => {
            return (entity.location.x >= query.location.xFrom &&
                entity.location.x <= query.location.xTo &&
                entity.location.y >= query.location.yFrom &&
                entity.location.y <= query.location.yTo);
        };
        const yVisibleIndexFrom = this.toIndexY(query.location.yFrom);
        const yVisibleIndexTo = this.toIndexY(query.location.yTo);
        const xVisibleIndexFrom = this.toIndexX(query.location.xFrom);
        const xVisibleIndexTo = this.toIndexX(query.location.xTo);
        // 絶対範囲の内側なので isFulfilled() チェックはしない
        for (let y = yVisibleIndexFrom + 1; y <= yVisibleIndexTo - 1; y++) {
            for (let x = xVisibleIndexFrom + 1; x <= xVisibleIndexTo - 1; x++) {
                for (const target of this.dividedAreas[this.toIndexXY(x, y)].values()) {
                    result.entities.push(target);
                }
            }
        }
        // 範囲内に存在するかどうかわからないので isFulfilled() チェックが必要
        for (let x = xVisibleIndexFrom; x <= xVisibleIndexTo; x++) {
            // top 一列
            for (const target of this.dividedAreas[this.toIndexXY(x, yVisibleIndexFrom)].values()) {
                if (isFulfilled(target)) {
                    result.entities.push(target);
                }
            }
            // bottom 一列
            for (const target of this.dividedAreas[this.toIndexXY(x, yVisibleIndexTo)].values()) {
                if (isFulfilled(target)) {
                    result.entities.push(target);
                }
            }
        }
        for (let y = yVisibleIndexFrom + 1; y <= yVisibleIndexTo - 1; y++) {
            // left 一列
            for (const target of this.dividedAreas[this.toIndexXY(xVisibleIndexFrom, y)].values()) {
                if (isFulfilled(target)) {
                    result.entities.push(target);
                }
            }
            // right 一列
            for (const target of this.dividedAreas[this.toIndexXY(xVisibleIndexTo, y)].values()) {
                if (isFulfilled(target)) {
                    result.entities.push(target);
                }
            }
        }
        return result;
    }
    updateEntity(entity) {
        const newIndex = this.toIndexXY(this.toIndexX(entity.location.x), this.toIndexY(entity.location.y));
        const oldIndex = this.entityIndexes.get(entity.id);
        if (oldIndex) {
            this.dividedAreas[oldIndex].delete(entity.id);
        }
        this.entityIndexes.set(entity.id, newIndex);
        this.dividedAreas[newIndex].set(entity.id, entity);
    }
    toIndexXY(xIndex, yIndex) {
        return yIndex * this.divideCountWidth + xIndex;
    }
    toIndexY(y) {
        if (y <= 0) {
            return 0;
        }
        if (y >= this.settings.height) {
            return this.divideCountHeight - 1;
        }
        return Math.floor(y / this.areaHeight);
    }
    toIndexX(x) {
        if (x <= 0) {
            return 0;
        }
        if (x >= this.settings.width) {
            return this.divideCountWidth - 1;
        }
        return Math.floor(x / this.areaWidth);
    }
}
exports.Map1dSearch = Map1dSearch;
