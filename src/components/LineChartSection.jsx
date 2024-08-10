import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import SegmentTree from '../utils/segmentTree';

const formatNumber = (num) => {
  if (typeof num === 'number') {
    // Round to nearest integer and format with commas
    return Math.round(num).toLocaleString();
  } else if (typeof num === 'string' && !isNaN(num)) {
    return Math.round(Number(num)).toLocaleString();
  }
  return 'N/A';
};

const LineChartSection = ({ chartData, volumeTree, selectedPeriod, setSelectedPeriod }) => {
  const [avgVolume, setAvgVolume] = useState(null);
  const prevVolumeSum = useRef(0);
  const prevIndex = useRef(-1);

  useEffect(() => {
    if (chartData && chartData.length > 0 && volumeTree) {
      const totalVolume = volumeTree.rangeQuery(0, chartData.length - 1);
      const avg = totalVolume / chartData.length;
      setAvgVolume(avg);
      prevVolumeSum.current = totalVolume;
      prevIndex.current = chartData.length - 1;
    }
  }, [chartData, volumeTree]);

  const calculateAverageVolume = (end) => {
    if (volumeTree) {
      if (end > prevIndex.current) {
        const additionalVolume = volumeTree.rangeQuery(prevIndex.current + 1, end);
        prevVolumeSum.current += additionalVolume;
      } else if (end < prevIndex.current) {
        const removedVolume = volumeTree.rangeQuery(end + 1, prevIndex.current);
        prevVolumeSum.current -= removedVolume;
      }
      prevIndex.current = end;
      const newAvg = prevVolumeSum.current / (end + 1);
      setAvgVolume(newAvg);
    }
  };

  const handleMouseMove = (e) => {
    if (e && e.activeTooltipIndex !== undefined) {
      calculateAverageVolume(e.activeTooltipIndex);
    }
  };

  if (!chartData || chartData.length === 0) {
    return <div className="text-white">No data available for the selected time period.</div>;
  }

  return (
    <div className="bg-[#0f172a] p-4 rounded-lg" style={{ userSelect: 'none', width: '100%' }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-white">Average Volume: {avgVolume ? formatNumber(avgVolume) : 'N/A'}</p>
        <div className="flex space-x-2">
          {['weekly', 'monthly', 'yearly'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 rounded ${
                selectedPeriod === period
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={chartData}
          onMouseMove={handleMouseMove}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <XAxis 
            dataKey="date"
            axisLine={false}
            tick={false}
          />
          <YAxis 
            yAxisId="price"
            orientation="left"
            axisLine={false}
            tick={false}
          />
          <YAxis 
            yAxisId="volume"
            orientation="right"
            axisLine={false}
            tick={false}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: 'none' }}
            itemStyle={{ color: '#fff' }}
            labelStyle={{ color: '#fff' }}
          />
          <Bar
            dataKey="volume"
            fill="#cffafe"
            opacity={0.5}
            yAxisId="volume"
          />
          <Line
            type="monotone"
            dataKey="close"
            stroke="#86efac"
            strokeWidth={2}
            yAxisId="price"
            dot={false}
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="sma"
            stroke="#ffffff"
            yAxisId="price"
            dot={false}
            activeDot={{ r: 8 }}
            strokeDasharray="5 5"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

LineChartSection.propTypes = {
  chartData: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      close: PropTypes.number.isRequired,
      sma: PropTypes.number,
      volume: PropTypes.number.isRequired,
    })
  ).isRequired,
  volumeTree: PropTypes.instanceOf(SegmentTree).isRequired,
  selectedPeriod: PropTypes.string.isRequired,
  setSelectedPeriod: PropTypes.func.isRequired,
};

export default LineChartSection;
