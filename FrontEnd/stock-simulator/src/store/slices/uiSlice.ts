import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Message } from '../../types';

interface UiState {
  message: Message | null;
  tradeQuantities: Record<string, number>;
}

const initialState: UiState = {
  message: null,
  tradeQuantities: {},
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<Message | null>) => {
      state.message = action.payload;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    setTradeQuantity: (state, action: PayloadAction<{ key: string; quantity: number }>) => {
      state.tradeQuantities[action.payload.key] = action.payload.quantity;
    },
    resetTradeQuantity: (state, action: PayloadAction<string>) => {
      state.tradeQuantities[action.payload] = 1;
    },
  },
});

export const { setMessage, clearMessage, setTradeQuantity, resetTradeQuantity } = uiSlice.actions;
export default uiSlice.reducer;