import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import SegmentTree from '../utils/segmentTree';  // Make sure this path is correct

const LineChartSection = ({ chartData, volumeTree }) => {
  const [avgVolume, setAvgVolume] = useState(null);

  useEffect(() => {
    if (chartData && chartData.length > 0 && volumeTree) {
      calculateAverageVolume(0, chartData.length - 1);
    }
  }, [chartData, volumeTree]);

  const calculateAverageVolume = (start, end) => {
    console.time('Segment Tree Query');
    const segmentTreeVolume = volumeTree.rangeQuery(start, end);
    const segmentTreeAvg = segmentTreeVolume / (end - start + 1);
    console.timeEnd('Segment Tree Query');

    console.time('Naive Query');
    let naiveVolume = 0;
    for (let i = start; i <= end; i++) {
      naiveVolume += chartData[i].volume;
    }
    const naiveAvg = naiveVolume / (end - start + 1);
    console.timeEnd('Naive Query');

    console.log('Segment Tree Average:', segmentTreeAvg);
    console.log('Naive Average:', naiveAvg);

    setAvgVolume(segmentTreeAvg);
  };

  const handleMouseMove = (e) => {
    if (e && e.activeTooltipIndex !== undefined) {
      calculateAverageVolume(0, e.activeTooltipIndex);
    }
  };

  if (!chartData || chartData.length === 0) {
    return <div>No data available for the selected time period.</div>;
  }

  return (
    <div className="highlight-bar-charts" style={{ userSelect: 'none', width: '100%' }}>
      <p>Average Volume: {avgVolume ? avgVolume.toFixed(2) : 'N/A'}</p>

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={chartData}
          onMouseMove={handleMouseMove}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date"
            type="category"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            type="number"
            yAxisId="price"
            orientation="left"
          />
          <YAxis 
            type="number"
            yAxisId="volume"
            orientation="right"
          />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="volume"
            fill="#8884d8"
            opacity={0.5}
            yAxisId="volume"
            name="Volume"
          />
          <Line
            type="monotone"
            dataKey="close"
            stroke="#ff7300"
            yAxisId="price"
            name="Close Price"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="sma"
            stroke="#82ca9d"
            yAxisId="price"
            name="SMA"
            dot={false}
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
};

export default LineChartSection;