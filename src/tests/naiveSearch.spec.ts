import { NaiveSearch } from "../naiveSearch";
import { SearchTest } from "./search-tests";

SearchTest(NaiveSearch.name, () => new NaiveSearch());