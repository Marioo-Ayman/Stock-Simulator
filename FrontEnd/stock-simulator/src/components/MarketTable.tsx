import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { executeTrade, fetchPortfolio } from '../store/slices/portfolioSlice';
import { fetchMarket } from '../store/slices/marketSlice';
import { setMessage, setTradeQuantity, resetTradeQuantity } from '../store/slices/uiSlice';
import type { Stock } from '../types';


export default function MarketTable() {

  const dispatch = useAppDispatch();
  const { stocks } = useAppSelector((state) => state.market);
  const { balance, positions } = useAppSelector((state) => state.portfolio);
  const { tradeQuantities } = useAppSelector((state) => state.ui);
  const prevPricesRef = useRef<Record<number, number>>({});
  const [priceChanges, setPriceChanges] = useState<Record<number, { change: number; percentChange: number; isPositive: boolean }>>({});
  const [flashingIds, setFlashingIds] = useState<Set<number>>(new Set());
  useEffect(() => {
    stocks.forEach((stock) => {
      const currentPrice = typeof stock.price === 'string' ? parseFloat(stock.price) : stock.price;
      const previousPrice = prevPricesRef.current[stock.id];
            if (previousPrice === undefined) {
        prevPricesRef.current[stock.id] = currentPrice;
        setPriceChanges((prev) => ({
          ...prev,
          [stock.id]: { change: 0, percentChange: 0, isPositive: false }
        }));
        return;
      }
     if (previousPrice !== currentPrice) {
        const change = currentPrice - previousPrice;
        const percentChange = previousPrice > 0 ? (change / previousPrice) * 100 : 0;
                setPriceChanges((prev) => ({
          ...prev,
          [stock.id]: {
            change,
            percentChange,
            isPositive: change > 0
          }
        }));
               setFlashingIds((prev) => new Set(prev).add(stock.id));
            prevPricesRef.current[stock.id] = currentPrice;
                setTimeout(() => {
          setFlashingIds((prev) => {
            const next = new Set(prev);
            next.delete(stock.id);
            return next;
          });
        }, 600);
      }
    });
  }, [stocks]);

  const getOwnedQuantity = (symbol: string): number => {
    const position = positions.find((p) => p.symbol === symbol);
    return position ? position.quantity : 0;
  };

  const getTradeQuantity = (stockId: number, type: 'buy' | 'sell'): number => {
    return tradeQuantities[`${stockId}-${type}`] || 0;
  };

  const handleQuantityChange = (stockId: number, type: 'buy' | 'sell', value: string) => {
    const numValue = parseInt(value) || 0;
    dispatch(setTradeQuantity({
      key: `${stockId}-${type}`,
      quantity: Math.max(0, numValue),
    }));
  };

  const handleTrade = async (stockId: number, type: 'buy' | 'sell') => {
    const quantity = getTradeQuantity(stockId, type);

    if (quantity <= 0) {
      dispatch(setMessage({
        type: 'error',
        text: 'Please enter a valid quantity',
      }));
      setTimeout(() => dispatch(setMessage(null)), 3000);
      return;
    }

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
      }, 2000);
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

  const calculatePriceChange = (stock: Stock) => {
    return priceChanges[stock.id] || { change: 0, percentChange: 0, isPositive: false };
  };

  return (
    <div className="bg-white backdrop-blur-xl border border-white/40 shadow-xl rounded-3xl p-6">
      <h2 className="mb-6 text-xl font-bold text-gray-900">Market Overview</h2>
      
      <div className="overflow-x-auto ">
        <table className="w-full ">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Symbol</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Price</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Change</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">% Change</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Quantity</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock: Stock) => {
              const stockPrice = typeof stock.price === 'string' ? parseFloat(stock.price) : stock.price;
              const owned = getOwnedQuantity(stock.symbol);
              const buyQuantity = getTradeQuantity(stock.id, 'buy');
              const sellQuantity = getTradeQuantity(stock.id, 'sell');
              const canBuy = balance >= stockPrice * buyQuantity && buyQuantity > 0;
              const canSell = owned >= sellQuantity && sellQuantity > 0;
              
              const isFlashing = flashingIds.has(stock.id);
              const { change, percentChange, isPositive } = calculatePriceChange(stock);

              return (
                <motion.tr
                  key={stock.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">{stock.symbol}</span>
                      {owned > 0 && (
                        <span className="text-xs text-gray-500">
                          Owned: {owned} shares
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-4 py-4 text-right">
                    <motion.span
                      className={`font-semibold ${
                        isFlashing
                          ? isPositive
                            ? 'text-green-600'
                            : 'text-red-600'
                          : 'text-gray-900'
                      }`}
                      animate={{
                        scale: isFlashing ? [1, 1.05, 1] : 1,
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      ${stockPrice.toFixed(2)}
                    </motion.span>
                  </td>
                  
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <motion.span
                        className={`font-medium ${
                          Math.abs(change) < 0.01 
                            ? 'text-gray-500' 
                            : isPositive 
                              ? 'text-green-600' 
                              : 'text-red-600'
                        }`}
                        animate={{
                          x: isFlashing ? [0, 8, 0] : 0,
                        }}
                        transition={{ duration: 0.4 }}
                      >
                        {isPositive ? '+' : ''}{change.toFixed(2)}
                      </motion.span>
                      <AnimatePresence>
                        {isFlashing && Math.abs(change) >= 0.01 && (
                          <motion.div
                            initial={{ opacity: 0, y: isPositive ? 8 : -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: isPositive ? -8 : 8 }}
                            transition={{ duration: 0.4 }}
                          >
                            {isPositive ? (
                              <ArrowUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <ArrowDown className="h-4 w-4 text-red-600" />
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>
                  
                  <td className={`px-4 py-4 text-right font-medium ${
                    Math.abs(percentChange) < 0.01 
                      ? 'text-gray-500' 
                      : isPositive 
                        ? 'text-green-600' 
                        : 'text-red-600'
                  }`}>
                    {isPositive ? '+' : ''}{percentChange.toFixed(2)}%
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="flex gap-2 justify-center">
                      <input
                        type="number"
                        min="0"
                        value={buyQuantity || ''}
                        onChange={(e) => handleQuantityChange(stock.id, 'buy', e.target.value)}
                        placeholder="0"
                        className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        min="0"
                        value={sellQuantity || ''}
                        onChange={(e) => handleQuantityChange(stock.id, 'sell', e.target.value)}
                        placeholder="0"
                        className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleTrade(stock.id, 'buy')}
                        disabled={!canBuy}
                        className={`px-4 py-2 rounded-md font-semibold text-sm transition-all ${
                          canBuy
                            ? 'bg-green-500 hover:bg-green-600 text-white hover:shadow-md hover:-translate-y-0.5'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Buy
                      </button>
                      <button
                        onClick={() => handleTrade(stock.id, 'sell')}
                        disabled={!canSell}
                        className={`px-4 py-2 rounded-md font-semibold text-sm transition-all ${
                          canSell
                            ? 'bg-red-500 hover:bg-red-600 text-white hover:shadow-md hover:-translate-y-0.5'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Sell
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};