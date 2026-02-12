
export interface Stock {
  id: number;
  symbol: string;
  price: string | number;
}

export interface Position {
  symbol: string;
  quantity: number;
  avg_price: number;
  current_price: string | number;
  profit_loss: number;
}

export interface Portfolio {
  balance: number;
  positions: Position[];
}

export interface TradeRequest {
  stock_id: number;
  type: 'buy' | 'sell';
  quantity: number;
}

export interface TradeResponse {
  message: string;
  trade: {
    id: number;
    user_id: number;
    stock_id: number;
    type: 'buy' | 'sell';
    quantity: number;
    price: string;
    created_at: string;
    updated_at: string;
  };
  new_balance: number;
}

export interface ApiError {
  error: string;
  messages?: Record<string, string[]>;
  required?: number;
  available?: number;
}

export interface Message {
  type: 'success' | 'error';
  text: string;
}