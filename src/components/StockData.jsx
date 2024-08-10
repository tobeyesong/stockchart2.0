import React, { useState } from 'react';
import LineChartSection from './LineChartSection';

const StockData = ({ data }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  if (!data) {
    return <div>No data available</div>;
  }

  const getChartData = () => {
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
      volume: item.volume, // Make sure this is included
    }));
  };

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

      <LineChartSection chartData={getChartData()} />
    </div>
  );
};

export default StockData;