import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import LineChartSection from './LineChartSection';
import SegmentTree from '../utils/segmentTree'; 
const StockData = ({ data }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const chartData = useMemo(() => {
    if (!data) return [];

    let seriesData;
    let smaData;
  
    switch (selectedPeriod) {
      case 'daily':
        seriesData = data.dailySeries || [];
        smaData = data.smaDaily || [];
        break;
      case 'weekly':
        seriesData = data.weeklySeries || [];
        smaData = data.smaWeekly || [];
        break;
      case 'monthly':
        seriesData = data.monthlySeries || [];
        smaData = data.smaMonthly || [];
        break;
      case 'yearly':
        seriesData = data.yearlySeries || [];
        smaData = data.smaMonthly || []; // Use monthly SMA for yearly view
        break;
      default:
        seriesData = data.dailySeries || [];
        smaData = data.smaDaily || [];
    }
  
    const smaMap = new Map(smaData.map(item => [item.date, item.sma]));
  
    return seriesData.map(item => ({
      date: item.date,
      close: item.close,
      sma: smaMap.get(item.date) || null,
      volume: item.volume,
    }));
  }, [data, selectedPeriod]);

  const volumeTree = useMemo(() => {
    if (chartData.length === 0) return null;
    const volumes = chartData.map(item => item.volume);
    return SegmentTree.build(volumes, 0, volumes.length - 1);
  }, [chartData]);

  if (!data) {
    return <div>No data available</div>;
  }

  const ButtonStyle = ({ isSelected }) => ({
    marginRight: '10px',
    padding: '10px',
    backgroundColor: isSelected ? '#4CAF50' : '#e7e7e7',
    color: isSelected ? 'white' : 'black',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  });

  return (
    <div>
      <h2>Stock Information</h2>
      <p><strong>Previous Close:</strong> ${data.previousClose || 'N/A'}</p>
      <p><strong>52 Week Range:</strong> {data.weekRange || 'N/A'}</p>
      <p><strong>Volume:</strong> {data.volume || 'N/A'}</p>
      <p><strong>Change Percent:</strong> {data.changePercent || 'N/A'}</p>

      <h3>Price Chart</h3>

      <div style={{ marginBottom: '20px' }}>
        {['weekly', 'monthly', 'yearly'].map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            style={ButtonStyle({ isSelected: selectedPeriod === period })}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>

      {volumeTree && <LineChartSection chartData={chartData} volumeTree={volumeTree} />}
    </div>
  );
};

StockData.propTypes = {
  data: PropTypes.shape({
    previousClose: PropTypes.number,
    weekRange: PropTypes.string,
    volume: PropTypes.number,
    changePercent: PropTypes.string,
    dailySeries: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.string.isRequired,
      close: PropTypes.number.isRequired,
      volume: PropTypes.number.isRequired,
    })),
    weeklySeries: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.string.isRequired,
      close: PropTypes.number.isRequired,
      volume: PropTypes.number.isRequired,
    })),
    monthlySeries: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.string.isRequired,
      close: PropTypes.number.isRequired,
      volume: PropTypes.number.isRequired,
    })),
    yearlySeries: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.string.isRequired,
      close: PropTypes.number.isRequired,
      volume: PropTypes.number.isRequired,
    })),
    smaDaily: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.string.isRequired,
      sma: PropTypes.number.isRequired,
    })),
    smaWeekly: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.string.isRequired,
      sma: PropTypes.number.isRequired,
    })),
    smaMonthly: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.string.isRequired,
      sma: PropTypes.number.isRequired,
    })),
  }),
};

export default StockData;