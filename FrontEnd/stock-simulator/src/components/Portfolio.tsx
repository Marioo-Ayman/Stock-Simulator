import React from 'react';
import { useAppSelector } from '../store/hooks';
import type { Position } from '../types';

const Portfolio: React.FC = () => {
  const { positions } = useAppSelector((state) => state.portfolio);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-indigo-500 pb-3">
        Portfolio
      </h2>

      {positions.length === 0 ? (
        <p className="text-center text-gray-500 py-8 italic">
          No positions yet. Start trading!
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Symbol</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Quantity</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Avg Price</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Current Price</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">P/L</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((position: Position) => {
                const currentPrice = typeof position.current_price === 'string' 
                  ? parseFloat(position.current_price) 
                  : position.current_price;
                const isProfitable = position.profit_loss >= 0;

                return (
                  <tr key={position.symbol} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 font-bold text-indigo-600 text-lg">
                      {position.symbol}
                    </td>
                    <td className="px-4 py-4 text-gray-700">{position.quantity}</td>
                    <td className="px-4 py-4 text-gray-700">
                      ${position.avg_price.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-gray-700">
                      ${currentPrice.toFixed(2)}
                    </td>
                    <td className={`px-4 py-4 font-semibold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
                      ${position.profit_loss.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
