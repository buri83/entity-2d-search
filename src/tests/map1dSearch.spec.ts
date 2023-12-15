import { Map1dSearch } from "../map1dSearch";
import { WORLD_HEIGHT, WORLD_WIDTH } from "./testUtils";
import { SearchTest } from "./searchTests";

SearchTest(Map1dSearch.name, () => new Map1dSearch({ height: WORLD_HEIGHT, width: WORLD_WIDTH }));
