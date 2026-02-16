import type { Stock, Portfolio, TradeRequest, TradeResponse } from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

// Fetch market data
export const fetchMarketData = async (): Promise<Stock[]> => {
  const response = await fetch(`${API_BASE_URL}/market`);
  if (!response.ok) {
    throw new Error('Failed to fetch market data');
  }
  return response.json();
};

// Update stock prices
export const updateStockPrices = async (): Promise<{ message: string; stocks: Stock[] }> => {
  const response = await fetch(`${API_BASE_URL}/market/update-prices`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to update prices');
  }
  return response.json();
};

// Fetch portfolio
export const fetchPortfolioData = async (): Promise<Portfolio> => {
  const response = await fetch(`${API_BASE_URL}/portfolio`);
  if (!response.ok) {
    throw new Error('Failed to fetch portfolio');
  }
  return response.json();
};

// Execute trade
export const executeTrade = async (tradeData: TradeRequest): Promise<TradeResponse> => {
  const response = await fetch(`${API_BASE_URL}/trade`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tradeData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw { response: { data } };
  }

  return data;
};