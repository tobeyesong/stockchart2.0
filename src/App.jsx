import { useState } from 'react';
import Autocomplete from './components/Autocomplete';
import SearchProvider from './algolia/SearchProvider';
import StockDataContainer from './components/StockDataContainer';

const App = () => {
  const [selectedSymbol, setSelectedSymbol] = useState(null);

  return (
    <SearchProvider>
      <div className="container p-4 mx-auto">
        <div className="relative z-20 mb-4">
          <Autocomplete onSelectSymbol={setSelectedSymbol} />
        </div>
        <div className="relative z-10">
          {selectedSymbol && <StockDataContainer symbol={selectedSymbol} />}
        </div>
      </div>
    </SearchProvider>
  );
};

export default App;