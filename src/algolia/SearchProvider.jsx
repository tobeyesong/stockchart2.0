
import React from 'react';
import { InstantSearch } from 'react-instantsearch-dom';
import searchClient from './AlgoliaSearchClient';

const SearchProvider = ({ children }) => {
  return (
    <InstantSearch indexName="nasdaq" searchClient={searchClient}>
      {children}
    </InstantSearch>
  );
};

export default SearchProvider;
