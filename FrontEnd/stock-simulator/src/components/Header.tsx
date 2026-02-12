import React from 'react';
import { useAppSelector } from '../store/hooks';

const Header: React.FC = () => {
  const { balance } = useAppSelector((state) => state.portfolio);

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600  shadow-lg">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <span className="text-4xl text-white">📈</span>
          Stock Trading Simulator
        </h1>
        <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg px-6 py-3">
          <div className="text-sm opacity-90">Balance</div>
          <div className="text-2xl font-bold text">
            ${balance}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
