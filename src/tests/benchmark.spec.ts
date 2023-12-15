import { Map1dSearch } from "../map1dSearch";
import { NaiveSearch } from "../naiveSearch";
import { EntitySearch2D } from "../search";
import { TestEntity, WORLD_HEIGHT, WORLD_WIDTH, generateRandomEntity } from "./testUtils";

type GenerateSearch = () => EntitySearch2D<TestEntity>;
type BenchmarkResult = {
    name: string;
    registerTimeMs: number;
    searchTimeMs: number;
    deregisterTimeMs: number;
};

const entityCount = 10_000;
const searchRange = 100;
const testEntities = [...Array(entityCount)].map((_) => generateRandomEntity());

function timeMs(func: () => void): number {
    const startTimeMs = new Date().getTime();
    func();
    return new Date().getTime() - startTimeMs;
}

function executeBenchmark(name: string, generateSearch: GenerateSearch): BenchmarkResult {
    const search = generateSearch();

    const registerTimeMs = timeMs(() => {
        for (const e of testEntities) {
            search.register(e);
        }
    });

    const searchTimeMs = timeMs(() => {
        for (const e of testEntities) {
            search.search({
                position: {
                    xFrom: e.position.x - searchRange,
                    yFrom: e.position.y - searchRange,
                    xTo: e.position.x + searchRange,
                    yTo: e.position.y + searchRange,
                },
            });
        }
    });

    const deregisterTimeMs = timeMs(() => {
        for (const e of testEntities) {
            search.deregister(e);
        }
    });

    return {
        name,
        registerTimeMs,
        searchTimeMs,
        deregisterTimeMs,
    };
}

const searches: [string, GenerateSearch][] = [
    [NaiveSearch.name, () => new NaiveSearch()],
    [Map1dSearch.name, () => new Map1dSearch({ height: WORLD_HEIGHT, width: WORLD_WIDTH })],
];

describe("Benchmark", () => {
    const results = searches.map(([name, generateSearch]) => {
        return executeBenchmark(name, generateSearch);
    });

    const naiveSearchResult = results.find((r) => r.name === NaiveSearch.name);
    const otherMethodResults = results.filter((r) => r.name !== NaiveSearch.name);
    if (!naiveSearchResult) throw "naiveSearchResult is not found";

    for (const result of otherMethodResults) {
        it(`${result.name} is faster than ${naiveSearchResult.name}`, () => {
            expect(result.searchTimeMs).toBeLessThan(naiveSearchResult.searchTimeMs);
        });
    }

    console.log(results);
});
