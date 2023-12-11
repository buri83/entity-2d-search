"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("..");
class ExampleEntity {
    constructor(id, name, location) {
        this.id = id;
        this.name = name;
        this.location = location;
    }
}
const search = new src_1.EntitySearch({ height: 100, width: 100 });
const query = {
    location: {
        xFrom: 10, xTo: 20,
        yFrom: 10, yTo: 20,
    }
};
const entity1 = new ExampleEntity("001", "entity-1", new src_1.EntityLocation({ x: 10, y: 20 }));
const entity2 = new ExampleEntity("002", "entity-2", new src_1.EntityLocation({ x: 10, y: 30 }));
search.register([entity1, entity2]);
console.log(search.search(query));
