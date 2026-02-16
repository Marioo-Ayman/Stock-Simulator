// src/App.tsx

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchMarket, updatePrices } from './store/slices/marketSlice';
import { fetchPortfolio } from './store/slices/portfolioSlice';
import Header from './components/Header';
import Message from './components/Message';
import MarketTable from './components/MarketTable';
import Portfolio from './components/Portfolio';
import Footer from './components/Footer';
import Loading from './components/Loading';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading: marketLoading } = useAppSelector((state) => state.market);
  const { loading: portfolioLoading } = useAppSelector((state) => state.portfolio);

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        dispatch(fetchMarket()),
        dispatch(fetchPortfolio()),
      ]);
    };

    loadInitialData();
  }, [dispatch]);

  // Auto-refresh prices every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      await dispatch(updatePrices());
      await dispatch(fetchPortfolio());
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const isLoading = marketLoading || portfolioLoading;
  const stocksLength = useAppSelector((state) => state.market.stocks.length);
  if (isLoading && !stocksLength) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header/>
      <Message />
      
      <main className="flex-1 container mx-auto px-4 py-8 ">
        <div className="max-w-7xl mx-auto space-y-8">
          <MarketTable />
          <Portfolio />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;