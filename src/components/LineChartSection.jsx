import React, { useState } from 'react';
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
  ReferenceArea,
} from 'recharts';

const LineChartSection = ({ chartData }) => {
  const [left, setLeft] = useState('dataMin');
  const [right, setRight] = useState('dataMax');
  const [refAreaLeft, setRefAreaLeft] = useState('');
  const [refAreaRight, setRefAreaRight] = useState('');
  const [top, setTop] = useState('dataMax+1');
  const [bottom, setBottom] = useState('dataMin-1');

  if (!chartData || chartData.length === 0) {
    return <div>No data available for the selected time period.</div>;
  }

  const getAxisYDomain = (from, to, ref, offset) => {
    const refData = chartData.slice(from, to);
    let [bottom, top] = [refData[0][ref], refData[0][ref]];
    refData.forEach((d) => {
      if (d[ref] > top) top = d[ref];
      if (d[ref] < bottom) bottom = d[ref];
    });

    return [(bottom | 0) - offset, (top | 0) + offset];
  };

  const zoom = () => {
    if (refAreaLeft === refAreaRight || refAreaRight === '') {
      setRefAreaLeft('');
      setRefAreaRight('');
      return;
    }

    let leftIndex = chartData.findIndex(item => item.date === refAreaLeft);
    let rightIndex = chartData.findIndex(item => item.date === refAreaRight);

    if (leftIndex > rightIndex) 
      [leftIndex, rightIndex] = [rightIndex, leftIndex];

    const [bottomDomain, topDomain] = getAxisYDomain(leftIndex, rightIndex, 'close', 1);

    setRefAreaLeft('');
    setRefAreaRight('');
    setLeft(chartData[leftIndex].date);
    setRight(chartData[rightIndex].date);
    setBottom(bottomDomain);
    setTop(topDomain);
  };

  const zoomOut = () => {
    setLeft('dataMin');
    setRight('dataMax');
    setTop('dataMax+1');
    setBottom('dataMin-1');
    setRefAreaLeft('');
    setRefAreaRight('');
  };

  return (
    <div className="highlight-bar-charts" style={{ userSelect: 'none', width: '100%' }}>
      <button type="button" className="btn update" onClick={zoomOut}>
        Zoom Out
      </button>

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={chartData}
          onMouseDown={(e) => e && setRefAreaLeft(e.activeLabel)}
          onMouseMove={(e) => e && refAreaLeft && setRefAreaRight(e.activeLabel)}
          onMouseUp={zoom}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            allowDataOverflow
            dataKey="date"
            domain={[left, right]}
            type="category"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            allowDataOverflow
            domain={[bottom, top]}
            type="number"
            yAxisId="price"
            orientation="left"
          />
          <YAxis 
            allowDataOverflow
            domain={['auto', 'auto']}
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
          {refAreaLeft && refAreaRight ? (
            <ReferenceArea yAxisId="price" x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} />
          ) : null}
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
};

export default LineChartSection;