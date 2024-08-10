import axios from "axios";
import SegmentTree from "./segmentTree";

const instance = axios.create({
  baseURL: "https://alpha-vantage.p.rapidapi.com",
  headers: {
    "x-rapidapi-host": "alpha-vantage.p.rapidapi.com",
    "x-rapidapi-key": "267254c439msh2de2a4f20e34018p127169jsn2d3c662440d9",
  },
});

const fetchAlphaVantageData = async (symbol) => {
  try {
    const [globalQuote, dailyData, weeklyData, monthlyData, smaDaily, smaWeekly, smaMonthly] = await Promise.all([
      fetchGlobalQuote(symbol),
      fetchTimeSeries(symbol, "TIME_SERIES_DAILY", "Time Series (Daily)"),
      fetchTimeSeries(symbol, "TIME_SERIES_WEEKLY", "Weekly Time Series"),
      fetchTimeSeries(symbol, "TIME_SERIES_MONTHLY", "Monthly Time Series"),
      fetchSMA(symbol, "daily", 50),
      fetchSMA(symbol, "weekly", 10),
      fetchSMA(symbol, "monthly", 10)
    ]);

    const data = {
      ...globalQuote,
      dailySeries: dailyData,
      weeklySeries: weeklyData,
      monthlySeries: monthlyData,
      yearlySeries: aggregateYearlyData(monthlyData),
      smaDaily: smaDaily,
      smaWeekly: smaWeekly,
      smaMonthly: smaMonthly
    };

    // Build segment trees
    data.dailyVolumeTree = SegmentTree.build(data.dailySeries.map(item => item.volume), 0, data.dailySeries.length - 1);
    data.weeklyVolumeTree = SegmentTree.build(data.weeklySeries.map(item => item.volume), 0, data.weeklySeries.length - 1);
    data.monthlyVolumeTree = SegmentTree.build(data.monthlySeries.map(item => item.volume), 0, data.monthlySeries.length - 1);

    console.log("Fetched data:", data); // Debug log
    return data;
  } catch (error) {
    console.error("Error fetching data from Alpha Vantage:", error);
    throw error;
  }
};

const fetchGlobalQuote = async (symbol) => {
  const response = await instance({
    method: "GET",
    url: "/query",
    params: { function: "GLOBAL_QUOTE", symbol: symbol.toUpperCase(), datatype: "json" },
  });
  const quote = response.data["Global Quote"];
  return {
    previousClose: Number(quote["08. previous close"]),
    weekRange: `${quote["03. high"]} - ${quote["04. low"]}`,
    volume: Number(quote["06. volume"]),
    changePercent: quote["10. change percent"],
  };
};

const fetchTimeSeries = async (symbol, function_name, series_key) => {
  const response = await instance({
    method: "GET",
    url: "/query",
    params: { function: function_name, symbol: symbol.toUpperCase(), datatype: "json", outputsize: "full" },
  });
  const seriesData = response.data[series_key];
  return Object.entries(seriesData).map(([date, values]) => ({
    date,
    close: Number(values["4. close"]),
    volume: Number(values["5. volume"]),
  })).reverse();
};

const fetchSMA = async (symbol, interval, time_period) => {
  const response = await instance({
    method: "GET",
    url: "/query",
    params: {
      function: "SMA",
      symbol: symbol.toUpperCase(),
      interval: interval,
      time_period: time_period.toString(),
      series_type: "close",
      datatype: "json",
    },
  });
  const smaData = response.data["Technical Analysis: SMA"];
  return Object.entries(smaData).map(([date, values]) => ({
    date,
    sma: Number(values["SMA"]),
  })).reverse();
};

const aggregateYearlyData = (monthlySeries) => {
  const yearlyDataMap = {};
  monthlySeries.forEach(({ date, close, volume }) => {
    const year = new Date(date).getFullYear();
    if (!yearlyDataMap[year]) {
      yearlyDataMap[year] = { totalClose: 0, totalVolume: 0, count: 0 };
    }
    yearlyDataMap[year].totalClose += close;
    yearlyDataMap[year].totalVolume += volume;
    yearlyDataMap[year].count += 1;
  });

  return Object.entries(yearlyDataMap).map(([year, data]) => ({
    date: `${year}-12-31`,
    close: Number((data.totalClose / data.count).toFixed(2)),
    volume: Math.round(data.totalVolume / data.count),
  })).sort((a, b) => new Date(a.date) - new Date(b.date));
};

export default fetchAlphaVantageData;