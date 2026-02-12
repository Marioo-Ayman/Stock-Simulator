import { configureStore } from '@reduxjs/toolkit';
import marketReducer from './slices/marketSlice';
import portfolioReducer from './slices/portfolioSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    market: marketReducer,
    portfolio: portfolioReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;