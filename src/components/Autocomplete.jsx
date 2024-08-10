// src/components/Autocomplete.jsx

import { useState } from 'react';
import { connectAutoComplete } from 'react-instantsearch-dom';
import StockData from './StockData';
import fetchAlphaVantageData from '../utils/fetchAplhaVantageData';

const Autocomplete = ({ hits, currentRefinement, refine }) => {
  const [inputValue, setInputValue] = useState(currentRefinement);
  const [showHits, setShowHits] = useState(true);
  const [stockData, setStockData] = useState(null);

  const handleSelect = async (hit) => {
    setInputValue(hit.symbol);
    setShowHits(false);
    refine(hit.symbol);

    try {
      const data = await fetchAlphaVantageData(hit.symbol);
      setStockData(data);
    } catch (error) {
      console.error("Error fetching Alpha Vantage data:", error);
    }
  };

  const handleChange = (event) => {
    const value = event.currentTarget.value;
    setInputValue(value);
    setShowHits(true);
    refine(value);
  };

  return (
    <div>
      <input
        type="search"
        value={inputValue}
        onChange={handleChange}
        placeholder="Search for a ticker..."
        onFocus={() => setShowHits(true)}
        style={{ padding: '10px', width: '300px', marginBottom: '20px' }}
      />
      {inputValue && hits.length > 0 && showHits && (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {hits.slice(0, 5).map(hit => (
            <li
              key={hit.objectID}
              onClick={() => handleSelect(hit)}
              style={{
                padding: '10px',
                borderBottom: '1px solid #ccc',
                cursor: 'pointer',
              }}
            >
              {hit.symbol} - {hit.name}
            </li>
          ))}
        </ul>
      )}
      <StockData data={stockData} />
    </div>
  );
};

export default connectAutoComplete(Autocomplete);
