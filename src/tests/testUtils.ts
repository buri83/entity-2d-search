import { SearchableEntity, EntityPosition } from "../search";

export const WORLD_HEIGHT = 1000;
export const WORLD_WIDTH = 1000;

export class TestEntity implements SearchableEntity {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly position: EntityPosition,
    ) {}
}

export function randomString(): string {
    return Math.random().toString(32).substring(2);
}

export function generateRandomEntity(x?: number, y?: number): TestEntity {
    return new TestEntity(
        randomString(),
        randomString(),
        new EntityPosition({
            x: x ?? Math.round(Math.random() * WORLD_WIDTH),
            y: y ?? Math.round(Math.random() * WORLD_HEIGHT),
        }),
    );
}
