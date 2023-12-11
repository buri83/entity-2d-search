import { EntityLocation, EntitySearch, SearchQuery, SearchableEntity } from "..";

class ExampleEntity implements SearchableEntity {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly location: EntityLocation
    ) { }
}

const search = new EntitySearch({ height: 100, width: 100 });
const query: SearchQuery = {
    location: {
        xFrom: 10, xTo: 20,
        yFrom: 10, yTo: 20,
    }
}

const entity1 = new ExampleEntity("001", "entity-1", new EntityLocation({ x: 5, y: 5 }));
const entity2 = new ExampleEntity("002", "entity-2", new EntityLocation({ x: 20, y: 20 }));

search.register([entity1, entity2]);
console.log(search.search(query));

entity1.location.set({ x: 15, y: 15 });
console.log(search.search(query));
