import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { useAppSelector } from '../store/hooks';
import type { Position } from '../types';

const Portfolio: React.FC = () => {
  const { balance, positions } = useAppSelector((state) => state.portfolio);
  const totalValue = positions.reduce((sum, position) => {
    const currentPrice = typeof position.current_price === 'string' 
      ? parseFloat(position.current_price) 
      : position.current_price;
    return sum + currentPrice * position.quantity;
  }, 0);

  const totalCost = positions.reduce((sum, position) => {
    return sum + position.avg_price * position.quantity;
  }, 0);

  const totalProfitLoss = positions.reduce((sum, position) => {
    return sum + position.profit_loss;
  }, 0);

  const totalProfitLossPercent = totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0;

  const getColorScheme = (isProfitable: boolean) => {
    if (isProfitable) {
      return {
        bg: 'from-blue-50 to-cyan-50',
        border: 'border-blue-200',
        accent: 'text-blue-600',
        badge: 'bg-emerald-100 text-emerald-700',
        hover: 'hover:border-blue-300'
      };
    } else {
      return {
        bg: 'from-rose-50 to-red-50',
        border: 'border-rose-200',
        accent: 'text-rose-600',
        badge: 'bg-rose-100 text-rose-700',
        hover: 'hover:border-rose-300'
      };
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-hidden rounded-2xl border-2 border-indigo-200 bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 shadow-lg"
      >
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/80 p-3 shadow-sm">
              <PieChart className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Portfolio Overview</p>
              <h2 className="text-2xl font-bold text-gray-900">Your Holdings</h2>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="space-y-2 rounded-xl bg-white/60 p-4 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">Cash Balance</p>
              </div>
              <motion.p
                className="text-2xl font-bold text-gray-900"
                key={balance}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
              className="space-y-2 rounded-xl bg-white/60 p-4 backdrop-blur-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">Holdings Value</p>
              <motion.p
                className="text-2xl font-bold text-indigo-600"
                key={totalValue}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="space-y-2 rounded-xl bg-white/60 p-4 backdrop-blur-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">Total Invested</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.25, type: 'spring', stiffness: 200 }}
              className="space-y-2 rounded-xl bg-white/60 p-4 backdrop-blur-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">Total P/L</p>
              <div className="flex items-baseline gap-2">
                <motion.p
                  className={`text-2xl font-bold ${totalProfitLoss >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}
                  key={totalProfitLoss}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {totalProfitLoss >= 0 ? '+' : ''}${Math.abs(totalProfitLoss).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </motion.p>
                <motion.span
                  className={`text-sm font-bold ${totalProfitLoss >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  ({totalProfitLoss >= 0 ? '+' : ''}{totalProfitLossPercent.toFixed(2)}%)
                </motion.span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className=" p-6 shadow-sm">
        <h3 className="mb-5 text-lg font-bold text-white">Your Positions</h3>

        {positions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center"
          >
            <p className="text-base font-medium text-gray-600">No positions yet</p>
            <p className="mt-2 text-sm text-gray-500">Start trading to build your portfolio!</p>
          </motion.div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {positions.map((position: Position, index: number) => {
              const currentPrice = typeof position.current_price === 'string' 
                ? parseFloat(position.current_price) 
                : position.current_price;
              const isProfitable = position.profit_loss >= 0;
              const colors = getColorScheme(isProfitable);
              const positionValue = currentPrice * position.quantity;
              const profitLossPercent = position.avg_price > 0 
                ? ((currentPrice - position.avg_price) / position.avg_price) * 100 
                : 0;

              return (
                <motion.div
                  key={position.symbol}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ 
                    translateY: -4, 
                    boxShadow: '0 12px 24px -4px rgba(0, 0, 0, 0.1)',
                    transition: { duration: 0.2 }
                  }}
                  className={`relative overflow-hidden rounded-xl border-2 bg-linear-to-br ${colors.bg} ${colors.border} ${colors.hover} p-5 transition-all duration-200`}
                >
                  <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/40 blur-2xl" />
                  <div className="relative space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className={`text-2xl font-bold ${colors.accent}`}>{position.symbol}</h4>
                        <p className="mt-1 text-xs font-medium text-gray-600">
                          {position.quantity} {position.quantity === 1 ? 'share' : 'shares'}
                        </p>
                      </div>
                      <motion.div
                        className={`rounded-lg ${colors.badge} px-2.5 py-1 text-xs font-bold uppercase tracking-wider`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, delay: 0.1 }}
                      >
                        {isProfitable ? 'Gain' : 'Loss'}
                      </motion.div>
                    </div>
                    <div className="space-y-2 rounded-lg bg-white/70 p-3 backdrop-blur-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-600">Current</span>
                        <span className={`text-lg font-bold ${colors.accent}`}>
                          ${currentPrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-600">Avg Cost</span>
                        <span className="text-sm font-semibold text-gray-700">
                          ${position.avg_price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-gray-600">Position Value</p>
                      <p className="text-xl font-bold text-gray-900">
                        ${positionValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>

                    <motion.div
                      className={`flex items-center justify-between rounded-xl px-3 py-2.5 ${
                        isProfitable
                          ? 'bg-emerald-100/80 text-emerald-900'
                          : 'bg-rose-100/80 text-rose-900'
                      }`}
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, delay: 0.15 }}
                    >
                      <span className="text-xs font-semibold">P&L</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">
                          {isProfitable ? '+' : ''}${Math.abs(position.profit_loss).toFixed(2)}
                        </span>
                        {isProfitable ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                      </div>
                    </motion.div>

                    {/* Return Percentage */}
                    <div className="text-center pt-1">
                      <p className={`text-xs font-bold uppercase tracking-wider ${
                        isProfitable ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {isProfitable ? '+' : ''}{profitLossPercent.toFixed(2)}% Return
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;