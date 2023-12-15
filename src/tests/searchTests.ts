import { DuplicateRegistrationError } from "../errors";
import { EntitySearch2D, SearchQuery } from "../search";
import { TestEntity, generateRandomEntity } from "./testUtils";

export function SearchTest(description: string, generateSearch: () => EntitySearch2D<TestEntity>): void {
    describe(description, () => {
        describe("Entity registration and deletion", () => {
            it("Search instance created, size=0", () => {
                const search = generateSearch();
                expect(search.size).toBe(0);
            });

            it("Registered 1 entity, size=1", () => {
                const search = generateSearch();
                const entity1 = generateRandomEntity();
                search.register(entity1);
                expect(search.size).toBe(1);
            });

            it("Registered 1 entity and delete it, size=0", () => {
                const search = generateSearch();
                const entity1 = generateRandomEntity();
                search.register(entity1);
                search.deregister(entity1);
                expect(search.size).toBe(0);
            });

            describe("Register some entity 2 times", () => {
                it(`Should throw ${DuplicateRegistrationError.name} error`, () => {
                    const search = generateSearch();
                    const entity = generateRandomEntity();
                    search.register(entity);
                    expect(() => search.register(entity)).toThrow(DuplicateRegistrationError);
                });
            });

            describe("Register entity then deregisterAll() called", () => {
                it("size = 0", () => {
                    const search = generateSearch();
                    const entity = generateRandomEntity();
                    search.register(entity);
                    search.deregisterAll();

                    expect(search.size).toBe(0);
                });
            });
        });

        describe("Searching", () => {
            const query: SearchQuery = {
                position: {
                    xFrom: 100,
                    xTo: 200,
                    yFrom: 100,
                    yTo: 200,
                },
            };
            describe.each`
                positions                                   | resultCount
                ${[{ x: 90, y: 90 }]}                       | ${0}
                ${[{ x: 100, y: 100 }]}                     | ${1}
                ${[{ x: 100, y: 150 }]}                     | ${1}
                ${[{ x: 150, y: 150 }]}                     | ${1}
                ${[{ x: 200, y: 150 }]}                     | ${1}
                ${[{ x: 200, y: 200 }]}                     | ${1}
                ${[{ x: 210, y: 210 }]}                     | ${0}
                ${[{ x: 90, y: 90 }, { x: 210, y: 210 }]}   | ${0}
                ${[{ x: 90, y: 90 }, { x: 200, y: 200 }]}   | ${1}
                ${[{ x: 100, y: 100 }, { x: 200, y: 200 }]} | ${2}
            `(`Registered entity at $positions`, ({ positions, resultCount }) => {
                it(`requestCount = ${resultCount}`, () => {
                    const search = generateSearch();
                    const entities = positions.map((l: { x: number; y: number }) => generateRandomEntity(l.x, l.y));

                    for (const e of entities) {
                        search.register(e);
                    }

                    expect(search.search(query).entities).toHaveLength(resultCount);
                });
            });

            describe("When moved entity", () => {
                describe("Can trace and search", () => {
                    const search = generateSearch();
                    const entity1 = generateRandomEntity(90, 90);

                    it("1. Initial position, should NOT be found.", () => {
                        search.register(entity1);
                        expect(entity1.position.get()).toEqual({ x: 90, y: 90 });
                        expect(search.search(query).entities).toHaveLength(0);
                    });

                    it("2. Position x changed to 100, should NOT be found.", () => {
                        entity1.position.x = 100;
                        expect(entity1.position.get()).toEqual({ x: 100, y: 90 });
                        expect(search.search(query).entities).toHaveLength(0);
                    });

                    it("3. Position y changed to 150, should be found", () => {
                        entity1.position.y = 150;
                        expect(entity1.position.get()).toEqual({ x: 100, y: 150 });
                        expect(search.search(query).entities).toHaveLength(1);
                    });

                    it("4. Position {x, y} changed to {210, 210}, should not be found", () => {
                        entity1.position.set({ x: 210, y: 210 });
                        expect(entity1.position.get()).toEqual({ x: 210, y: 210 });
                        expect(search.search(query).entities).toHaveLength(0);
                    });
                });
            });

            describe("Search range is smaller than divided size", () => {
                it("Can search successfully", () => {
                    const search = generateSearch();
                    const entity = generateRandomEntity(10, 10);
                    search.register(entity);
                    search.register(generateRandomEntity(10, 11)); // should not be found
                    search.register(generateRandomEntity(11, 11)); // should not be found

                    const result = search.search({
                        position: {
                            xFrom: 10,
                            xTo: 10,
                            yFrom: 10,
                            yTo: 10,
                        },
                    });
                    expect(result.entities).toHaveLength(1);
                    expect(result.entities[0]).toEqual(entity);
                });
            });
        });
    });
}
