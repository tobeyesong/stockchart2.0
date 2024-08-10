import React, { useState } from 'react';
import Autocomplete from './components/Autocomplete';
import SearchProvider from './algolia/SearchProvider';
import StockDataContainer from './components/StockDataContainer';

const App = () => {
  const [selectedSymbol, setSelectedSymbol] = useState(null);

  return (
    <SearchProvider>
      <div>
        <Autocomplete onSelectSymbol={setSelectedSymbol} />
        {selectedSymbol && <StockDataContainer symbol={selectedSymbol} />}
      </div>
    </SearchProvider>
  );
};

export default App;
