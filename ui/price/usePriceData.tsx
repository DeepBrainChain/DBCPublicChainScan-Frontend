import useApiQuery from 'lib/api/useApiQuery';

import type { DailyStatsResponse, PriceHistoryResponse, PriceInfo } from 'types/api/price';

const PRICE_INFO_PLACEHOLDER: PriceInfo = {
  price: '0',
  price_change: '0',
  symbol: 'DBC',
  total_issuance: '0',
  inflation: '0',
};

const PRICE_HISTORY_PLACEHOLDER: PriceHistoryResponse = {
  items: [],
  ema7_average: '0',
  ema30_average: '0',
};

const PRICE_DAILY_PLACEHOLDER: DailyStatsResponse = {
  items: [],
};

export default function usePriceData() {
  const currentQuery = useApiQuery('price_current', {
    queryOptions: {
      placeholderData: PRICE_INFO_PLACEHOLDER,
      refetchInterval: 60000,
    },
  });

  const historyQuery = useApiQuery('price_history', {
    queryOptions: {
      placeholderData: PRICE_HISTORY_PLACEHOLDER,
      refetchInterval: 300000,
    },
  });

  const dailyQuery = useApiQuery('price_daily', {
    queryOptions: {
      placeholderData: PRICE_DAILY_PLACEHOLDER,
      refetchInterval: 300000,
    },
  });

  return {
    current: currentQuery,
    history: historyQuery,
    daily: dailyQuery,
  };
}
