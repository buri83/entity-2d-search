import { EntityPosition, Search2D, SearchableEntity } from "../src"; // if you installed with npm, import "search2d" instead

type ExampleEntityObject = {
    name: string; // Additional field
} & SearchableEntity;

// If you want to use a class, write the following
class ExampleEntityClass implements SearchableEntity {
    constructor(
        readonly id: string, // Required
        readonly position: EntityPosition, // Required
        readonly name: string, // Additional field
    ) {}
}

const entity: ExampleEntityObject = {
    id: "001", // id must be unique
    position: new EntityPosition({ x: 10, y: 20 }),
    name: "buri",
};

// Specify field height and width
// Entity's position range: 0 <= y <= height,  0 <= x <= width
const search = new Search2D<ExampleEntityObject>({ height: 100, width: 100 });

// Register entity to search
search.register(entity);

// Search by query
const result = search.search({
    position: {
        xFrom: 10,
        yFrom: 10,
        xTo: 20,
        yTo: 20,
    },
});
console.log(result);
// {
//   entities: [ { id: '001', position: [EntityPosition], name: 'buri' } ]
// }

// Move entity position (Change x, y at the same time, it is faster)
entity.position.set({ x: 15, y: 15 });

// x, y can also be set individually
entity.position.x = 15;
entity.position.y = 15;

// You can deregister entity
search.deregister(entity);

// Deregister all entities before disposing search2D instance to prevent memory leak.
search.deregisterAll();
