# Entity 2D Search

Sorry ! This package is WIP. I published for testing.

```typescript
import { EntityLocation, EntitySearch, SearchQuery, SearchableEntity } from "entity-2d-search";

class ExampleEntityClass implements SearchableEntity {
    constructor(
        readonly id: string, // Required
        readonly location: EntityLocation,  // Required
        readonly name: string,  // Additional fields
    ) { }
}

type ExampleEntityObject = {
    age: number;  // Additional fields
} & SearchableEntity;

const search = new EntitySearch<ExampleEntityClass | ExampleEntityObject>({ height: 100, width: 100 });

const entity1 = new ExampleEntityClass("001", new EntityLocation({ x: 5, y: 5 }), "entity-1");
const entity2: ExampleEntityObject = { id: "002", location: new EntityLocation({ x: 20, y: 20 }), age: 18 };

const query: SearchQuery = {
    location: {
        xFrom: 10, yFrom: 10,
        xTo: 20, yTo: 20,
    }
}

// "001" entity is not found because it is outside the query location
search.register([entity1, entity2]);
console.log(search.search(query));
/*
    { 
        entities: [ 
            { id: '002', location: [EntityLocation], age: 18 } 
        ] 
    }
*/

// Moved "001" entity to inside the query location, it will be automatically applied and will be searchable.
entity1.location.set({ x: 15, y: 15 });
console.log(search.search(query));
/*
    {
        entities: [
            ExampleEntityClass {
                id: '001',
                location: [EntityLocation],
                name: 'entity-1'
            },
            { id: '002', location: [EntityLocation], age: 18 }
        ]
    }
*/
```