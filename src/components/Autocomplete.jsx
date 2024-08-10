import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connectAutoComplete } from 'react-instantsearch-dom';

const Autocomplete = ({ hits, currentRefinement, refine, onSelectSymbol }) => {
  const [inputValue, setInputValue] = useState(currentRefinement);
  const [showHits, setShowHits] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowHits(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

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
    <div ref={wrapperRef} className="relative w-full max-w-xl mx-auto">
      <div className="p-2 bg-white shadow-lg rounded-xl ring-1 ring-black ring-opacity-5">
        <input
          type="search"
          value={inputValue}
          onChange={handleChange}
          placeholder="Search for a ticker..."
          onFocus={() => setShowHits(true)}
          className="w-full rounded-md border-0 bg-gray-100 px-4 py-2.5 text-gray-900 focus:ring-0 sm:text-sm"
        />
      </div>
      {inputValue && Array.isArray(hits) && hits.length > 0 && showHits && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
          <ul className="py-1 overflow-auto text-base max-h-60 sm:text-sm">
            {hits.slice(0, 5).map(hit => (
              <li
                key={hit.objectID}
                onClick={() => handleSelect(hit)}
                className="px-4 py-2 cursor-pointer select-none hover:bg-indigo-600 hover:text-white"
              >
                {hit.symbol} - {hit.name}
              </li>
            ))}
          </ul>
        </div>
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