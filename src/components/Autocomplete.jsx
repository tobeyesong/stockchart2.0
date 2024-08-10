import { useState } from 'react';
import PropTypes from 'prop-types';
import { connectAutoComplete } from 'react-instantsearch-dom';

const Autocomplete = ({ hits, currentRefinement, refine, onSelectSymbol }) => {
  const [inputValue, setInputValue] = useState(currentRefinement);
  const [showHits, setShowHits] = useState(true);

  const handleSelect = (hit) => {
    setInputValue(hit.symbol);
    setShowHits(false);
    refine(hit.symbol);
    onSelectSymbol(hit.symbol);
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
      {inputValue && Array.isArray(hits) && hits.length > 0 && showHits && (
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
    </div>
  );
};

Autocomplete.propTypes = {
  hits: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  currentRefinement: PropTypes.string.isRequired,
  refine: PropTypes.func.isRequired,
  onSelectSymbol: PropTypes.func.isRequired,
};

export default connectAutoComplete(Autocomplete);