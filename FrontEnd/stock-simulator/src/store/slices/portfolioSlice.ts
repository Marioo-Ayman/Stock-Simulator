import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Portfolio, TradeRequest } from '../../types';
import { fetchPortfolioData, executeTrade as executeTradeApi } from '../../services/api';

interface PortfolioState {
  balance: number;
  positions: Portfolio['positions'];
  loading: boolean;
  error: string | null;
}

const initialState: PortfolioState = {
  balance: 0,
  positions: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchPortfolio = createAsyncThunk(
  'portfolio/fetchPortfolio',
  async () => {
    const response = await fetchPortfolioData();
    return response;
  }
);

export const executeTrade = createAsyncThunk(
  'portfolio/executeTrade',
  async (tradeData: TradeRequest, { rejectWithValue }) => {
    try {
      const response = await executeTradeApi(tradeData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { error: 'Trade failed' });
    }
  }
);

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    setBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    },
    setPositions: (state, action: PayloadAction<Portfolio['positions']>) => {
      state.positions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch portfolio
      .addCase(fetchPortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.balance;
        state.positions = action.payload.positions;
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch portfolio';
      })
      // Execute trade
      .addCase(executeTrade.pending, (state) => {
        state.error = null;
      })
      .addCase(executeTrade.fulfilled, (state, action) => {
        state.balance = action.payload.new_balance;
      })
      .addCase(executeTrade.rejected, (state, action) => {
        state.error = (action.payload as any)?.error || 'Trade execution failed';
      });
  },
});

export const { setBalance, setPositions } = portfolioSlice.actions;
export default portfolioSlice.reducer;