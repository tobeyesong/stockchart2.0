import { useState, useEffect } from 'react';
import fetchAlphaVantageData from '../utils/fetchAlphaVantageData'; // Adjust the import path as needed

const useStockData = (symbol) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      const startTime = performance.now();
      
      try {
        const stockData = await fetchAlphaVantageData(symbol);
        setData(stockData);
        
        const endTime = performance.now();
        console.log(`API fetch time for ${symbol}: ${endTime - startTime} ms`);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching stock data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (symbol) {
      fetchData();
    }
  }, [symbol]);

  return { data, isLoading, error };
};

export default useStockData;
