import { Map1dSearch } from "../map1dSearch";
import { WORLD_HEIGHT, WORLD_WIDTH, generateRandomEntity } from "./testUtils";
import { SearchQuery } from "../search";

const generateSearch = () => new Map1dSearch({ height: WORLD_HEIGHT, width: WORLD_WIDTH });

describe(Map1dSearch.name, () => {
    describe("Entity registration and deletion", () => {
        it("Search instance created, size=0", () => {
            const search = generateSearch();
            expect(search.size).toBe(0);
        })

        it("Registered 1 entity, size=1", () => {
            const search = generateSearch();
            const entity1 = generateRandomEntity();
            search.register([entity1]);
            expect(search.size).toBe(1);
        })

        it("Registered 1 entity and delete it, size=0", () => {
            const search = generateSearch();
            const entity1 = generateRandomEntity();
            search.register([entity1]);
            search.delete([entity1]);
            expect(search.size).toBe(0);
        })
    })

    describe("Searching", () => {
        const query: SearchQuery = {
            location: {
                xFrom: 10, xTo: 20,
                yFrom: 10, yTo: 20,
            }
        }
        describe.each`
            locations                               | resultCount
            ${[{ x: 9, y: 9 }]}                     | ${0}
            ${[{ x: 10, y: 10 }]}                   | ${1}
            ${[{ x: 10, y: 15 }]}                   | ${1}
            ${[{ x: 20, y: 20 }]}                   | ${1}
            ${[{ x: 21, y: 21 }]}                   | ${0}
            ${[{ x: 9, y: 9 }, { x: 21, y: 21 }]}   | ${0}
            ${[{ x: 9, y: 9 }, { x: 20, y: 20 }]}   | ${1}
            ${[{ x: 10, y: 10 }, { x: 20, y: 20 }]} | ${2}
        `(`Registered entity at $locations`, ({ locations, resultCount }) => {
            it(`requestCount = ${resultCount}`, () => {
                const search = generateSearch();
                const entities = locations.map((l: { x: number, y: number }) => generateRandomEntity(l.x, l.y));

                for (const e of entities) {
                    search.register([e]);
                }

                expect(search.search(query).entities).toHaveLength(resultCount);
            })
        })

        it("Can be traced move entity", () => {
            const search = generateSearch();
            const entity1 = generateRandomEntity(9, 9);
            search.register([entity1]);
            expect(entity1.location.get()).toEqual({ x: 9, y: 9 });
            expect(search.search(query).entities).toHaveLength(0);

            entity1.location.x = 10;
            expect(entity1.location.get()).toEqual({ x: 10, y: 9 });
            expect(search.search(query).entities).toHaveLength(0);

            entity1.location.y = 15;
            expect(entity1.location.get()).toEqual({ x: 10, y: 15 });
            expect(search.search(query).entities).toHaveLength(1);

            entity1.location.set({ x: 21, y: 21 });
            expect(entity1.location.get()).toEqual({ x: 21, y: 21 });
            expect(search.search(query).entities).toHaveLength(0);
        })
    })
})
