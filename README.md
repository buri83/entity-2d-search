# Search 2D

Sorry ! This package is WIP. I published for testing.

## Install

```bash
$ npm i search2d
```

## Usage

```typescript
import { EntityPosition, EntitySearch, SearchQuery, SearchableEntity } from "search2d";

class ExampleEntityClass implements SearchableEntity {
    constructor(
        readonly id: string,  // Required
        readonly position: EntityPosition,  // Required
        readonly name: string,  // Additional fields
    ) { }
}

type ExampleEntityObject = {
    age: number;  // Additional fields
} & SearchableEntity;

const search = new EntitySearch<ExampleEntityClass | ExampleEntityObject>({ height: 100, width: 100 });

const entity1 = new ExampleEntityClass("001", new EntityPosition({ x: 5, y: 5 }), "entity-1");
const entity2: ExampleEntityObject = { id: "002", position: new EntityPosition({ x: 20, y: 20 }), age: 18 };

const query: SearchQuery = {
    position: {
        xFrom: 10, xTo: 20,
        yFrom: 10, yTo: 20,
    }
}


// "001" entity is not found because it is outside the query position
search.register([entity1, entity2]);
console.log(search.search(query));
/*
    { 
        entities: [ 
            { id: '002', position: [EntityPosition], age: 18 } 
        ] 
    }
*/


// Moved "001" entity to inside the query location, it will be automatically applied and will be searchable.
entity1.position.set({ x: 15, y: 15 });
console.log(search.search(query));
/*
    {
        entities: [
            ExampleEntityClass {
                id: '001',
                position: [EntityPosition],
                name: 'entity-1'
            },
            { id: '002', position: [EntityPosition], age: 18 }
        ]
    }
*/


// Delete registered entities
search.delete([entity1, entity2]);
console.log(search.search(query));
/*
    { entities: [] }
*/
```
