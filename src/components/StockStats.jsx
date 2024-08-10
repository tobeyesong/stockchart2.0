import PropTypes from 'prop-types';

const formatNumber = (num) => {
  if (typeof num === 'number') {
    return num.toLocaleString();
  } else if (typeof num === 'string' && !isNaN(num)) {
    return Number(num).toLocaleString();
  }
  return 'N/A';
};

const StockStats = ({ symbol, previousClose, volume, changePercent }) => {
  const stats = [
    { id: 1, name: 'Previous Close', value: `$${previousClose || 'N/A'}` },
    { id: 2, name: 'Volume', value: formatNumber(volume) },
    { id: 3, name: 'Change Percent', value: changePercent || 'N/A' },
  ];

  return (
    <div className="py-24 bg-white sm:py-32">
      <div className="px-6 mx-auto max-w-7xl lg:px-8">
        {symbol && (
          <h2 className="mb-16 text-3xl font-semibold tracking-tight text-center text-gray-900 sm:text-5xl">
            {symbol}
          </h2>
        )}
        <dl className="grid grid-cols-1 text-center gap-x-8 gap-y-16 lg:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.id} className="flex flex-col max-w-xs mx-auto gap-y-4">
              <dt className="text-base leading-7 text-gray-600">{stat.name}</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

StockStats.propTypes = {
  symbol: PropTypes.string,
  previousClose: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  volume: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  changePercent: PropTypes.string,
};

export default StockStats;