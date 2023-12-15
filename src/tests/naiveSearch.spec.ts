import { NaiveSearch } from "../naiveSearch";
import { SearchTest } from "./searchTests";

SearchTest(NaiveSearch.name, () => new NaiveSearch());