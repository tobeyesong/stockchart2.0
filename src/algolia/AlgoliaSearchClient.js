import algoliasearch from 'algoliasearch/lite';

const ALGOLIA_APP_ID = "J21PJLOH40";
const ALGOLIA_ADMIN_API_KEY = "6556fe7f4eaf9e76f8ce43f9952a6f9b";

const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY);

export default searchClient;
