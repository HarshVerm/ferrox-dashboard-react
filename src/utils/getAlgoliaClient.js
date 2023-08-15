import algoliasearch from "algoliasearch";
import { Models } from "../firebase/models";

const algoliaAppId = process.env.REACT_APP_ALGOLIA_APP_ID || "";
const algoliaApiKey = process.env.REACT_APP_ALGOLIA_API_KEY || "";
const algoliaClient = algoliasearch(algoliaAppId, algoliaApiKey);
const algoliaIndex = algoliaClient.initIndex(Models.PRODUCTS);

export default algoliaIndex;
