import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import LineChartSection from './LineChartSection';
import SegmentTree from '../utils/segmentTree'; 
import StockStats from './StockStats';

const StockData = ({ data }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');

  const chartData = useMemo(() => {
    if (!data) return [];

    let seriesData;
    let smaData;
  
    switch (selectedPeriod) {
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
        seriesData = data.weeklySeries || [];
        smaData = data.smaWeekly || [];
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
      <StockStats 
        
        previousClose={data.previousClose}
        volume={data.volume}
        changePercent={data.changePercent}
      />

     

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

      {volumeTree && (
        <LineChartSection 
          chartData={chartData} 
          volumeTree={volumeTree} 
          selectedPeriod={selectedPeriod}
        />
      )}
    </div>
  );
};

StockData.propTypes = {
  data: PropTypes.shape({
    previousClose: PropTypes.number,
    weekRange: PropTypes.string,
    volume: PropTypes.number,
    changePercent: PropTypes.string,
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
    smaWeekly: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.string.isRequired,
      sma: PropTypes.number.isRequired,
    })),
    smaMonthly: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.string.isRequired,
      sma: PropTypes.number.isRequired,
    })),
  }),
  symbol: PropTypes.string.isRequired,
};

export default StockData;
