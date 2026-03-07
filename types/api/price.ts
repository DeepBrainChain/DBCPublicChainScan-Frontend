export interface PriceInfo {
  price: string;
  price_change: string;
  symbol: string;
  total_issuance: string;
  inflation: string;
}

export interface PriceHistoryItem {
  feed_at: number;
  price: string;
}

export interface PriceHistoryResponse {
  items: Array<PriceHistoryItem>;
  ema7_average: string;
  ema30_average: string;
}

export interface DailyStatsItem {
  time_utc: string;
  total: number;
  transfer_amount_total: string;
}

export interface DailyStatsResponse {
  items: Array<DailyStatsItem>;
}
