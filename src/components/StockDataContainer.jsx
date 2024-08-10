import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import StockData from './StockData';
import fetchAlphaVantageData from '../utils/fetchAlphaVantageData';

const StockDataContainer = ({ symbol }) => {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchAlphaVantageData(symbol);
        setStockData(data);
      } catch (err) {
        setError('Error fetching stock data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!stockData) return null;

  return <StockData data={stockData} />;
};

StockDataContainer.propTypes = {
  symbol: PropTypes.string.isRequired,
};

export default StockDataContainer;