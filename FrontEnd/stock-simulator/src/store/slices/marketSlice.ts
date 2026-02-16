// src/store/slices/marketSlice.ts

import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Stock } from '../../types';
import { fetchMarketData, updateStockPrices } from '../../services/api';

interface MarketState {
  stocks: Stock[];
  loading: boolean;
  error: string | null;
}

const initialState: MarketState = {
  stocks: [],
  loading: false,
  error: null,
};

export const fetchMarket = createAsyncThunk(
  'market/fetchMarket',
  async () => {
    const response = await fetchMarketData();
    return response;
  }
);

export const updatePrices = createAsyncThunk(
  'market/updatePrices',
  async () => {
    const response = await updateStockPrices();
    return response.stocks;
  }
);

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    setStocks: (state, action: PayloadAction<Stock[]>) => {
      state.stocks = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarket.fulfilled, (state, action) => {
        state.loading = false;
        state.stocks = action.payload;
      })
      .addCase(fetchMarket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch market data';
      })
      // Update prices
      .addCase(updatePrices.pending, (state) => {
        state.error = null;
      })
      .addCase(updatePrices.fulfilled, (state, action) => {
        state.stocks = action.payload;
      })
      .addCase(updatePrices.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update prices';
      });
  },
});

export const { setStocks } = marketSlice.actions;
export default marketSlice.reducer;