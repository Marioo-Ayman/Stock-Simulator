import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { executeTrade, fetchPortfolio } from '../store/slices/portfolioSlice';
import { fetchMarket } from '../store/slices/marketSlice';
import { setMessage, setTradeQuantity, resetTradeQuantity } from '../store/slices/uiSlice';
import type { Stock } from '../types';

const MarketTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stocks } = useAppSelector((state) => state.market);
  const { balance, positions } = useAppSelector((state) => state.portfolio);
  const { tradeQuantities } = useAppSelector((state) => state.ui);

  const getOwnedQuantity = (symbol: string): number => {
    const position = positions.find((p) => p.symbol === symbol);
    return position ? position.quantity : 0;
  };

  const getTradeQuantity = (stockId: number, type: 'buy' | 'sell'): number => {
    return tradeQuantities[`${stockId}-${type}`] || 1;
  };

  const handleQuantityChange = (stockId: number, type: 'buy' | 'sell', value: string) => {
    const numValue = parseInt(value) || 1;
    dispatch(setTradeQuantity({
      key: `${stockId}-${type}`,
      quantity: Math.max(1, numValue),
    }));
  };

  const handleTrade = async (stockId: number, type: 'buy' | 'sell') => {
    const quantity = getTradeQuantity(stockId, type);

    try {
      await dispatch(executeTrade({ stock_id: stockId, type, quantity })).unwrap();
      
      dispatch(setMessage({
        type: 'success',
        text: `${type.toUpperCase()} executed: ${quantity} shares`,
      }));

      // Refresh data
      dispatch(fetchPortfolio());
      dispatch(fetchMarket());

      // Reset quantity
      dispatch(resetTradeQuantity(`${stockId}-${type}`));

      // Clear message after 3 seconds
      setTimeout(() => {
        dispatch(setMessage(null));
      }, 3000);
    } catch (error: any) {
      dispatch(setMessage({
        type: 'error',
        text: error.error || 'Trade failed',
      }));

      setTimeout(() => {
        dispatch(setMessage(null));
      }, 3000);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-indigo-500 pb-3">
        Market
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Symbol</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Price</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Owned</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Buy</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Sell</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock: Stock) => {
              const owned = getOwnedQuantity(stock.symbol);
              const buyQuantity = getTradeQuantity(stock.id, 'buy');
              const sellQuantity = getTradeQuantity(stock.id, 'sell');
              const stockPrice = typeof stock.price === 'string' ? parseFloat(stock.price) : stock.price;
              const canBuy = balance >= stockPrice * buyQuantity;
              const canSell = owned >= sellQuantity;

              return (
                <tr key={stock.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 font-bold text-indigo-600 text-lg">
                    {stock.symbol}
                  </td>
                  <td className="px-4 py-4 font-semibold text-gray-800">
                    ${stockPrice.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 text-gray-700">{owned}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        value={buyQuantity}
                        onChange={(e) => handleQuantityChange(stock.id, 'buy', e.target.value)}
                        className="w-16 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center"
                      />
                      <button
                        onClick={() => handleTrade(stock.id, 'buy')}
                        disabled={!canBuy}
                        className={`px-4 py-2 rounded-md font-semibold transition-all ${
                          canBuy
                            ? 'bg-green-500 hover:bg-green-600 text-white hover:shadow-lg hover:-translate-y-0.5'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Buy
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        value={sellQuantity}
                        onChange={(e) => handleQuantityChange(stock.id, 'sell', e.target.value)}
                        className="w-16 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-center"
                      />
                      <button
                        onClick={() => handleTrade(stock.id, 'sell')}
                        disabled={!canSell}
                        className={`px-4 py-2 rounded-md font-semibold transition-all ${
                          canSell
                            ? 'bg-red-500 hover:bg-red-600 text-white hover:shadow-lg hover:-translate-y-0.5'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Sell
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketTable;