import { Box } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import getCurrencyValue from 'lib/getCurrencyValue';
import { thinsp } from 'lib/html-entities';
import { HOMEPAGE_STATS } from 'stubs/stats';
import { TXS_STATS } from 'stubs/tx';
import StatsWidget from 'ui/shared/stats/StatsWidget';
import { useTranslation } from 'next-i18next';

const TxsStats = () => {
  const txsStatsQuery = useApiQuery('txs_stats', {
    queryOptions: {
      placeholderData: TXS_STATS,
    },
  });

  const statsQuery = useApiQuery('stats', {
    queryOptions: {
      placeholderData: HOMEPAGE_STATS,
    },
  });

  if (!txsStatsQuery.data) {
    return null;
  }

  const txFeeAvg = getCurrencyValue({
    value: txsStatsQuery.data.transaction_fees_avg_24h,
    exchangeRate: statsQuery.data?.coin_price,
    decimals: String(config.chain.currency.decimals),
    accuracyUsd: 2,
  });
  const { t, i18n } = useTranslation('common');

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: '1fr', lg: 'repeat(4, calc(25% - 9px))' }}
      rowGap={3}
      columnGap={3}
      mb={6}
    >
      <StatsWidget
        label={t('transactions')}
        value={Number(txsStatsQuery.data?.transactions_count_24h).toLocaleString()}
        period="24h"
        isLoading={txsStatsQuery.isPlaceholderData}
        href={{ pathname: '/stats', query: { chartId: 'newTxns' } }}
      />
      <StatsWidget
        label={t('pending_transactions')}
        value={Number(txsStatsQuery.data?.pending_transactions_count).toLocaleString()}
        period="1h"
        isLoading={txsStatsQuery.isPlaceholderData}
      />
      <StatsWidget
        label={t('transaction_fees')}
        value={(
          Number(txsStatsQuery.data?.transaction_fees_sum_24h) /
          10 ** config.chain.currency.decimals
        ).toLocaleString(undefined, { maximumFractionDigits: 2 })}
        valuePostfix={thinsp + config.chain.currency.symbol}
        period="24h"
        isLoading={txsStatsQuery.isPlaceholderData}
        href={{ pathname: '/stats', query: { chartId: 'txnsFee' } }}
      />
      <StatsWidget
        label={t('avg_transaction_fee')}
        value={txFeeAvg.usd ? txFeeAvg.usd : txFeeAvg.valueStr}
        valuePrefix={txFeeAvg.usd ? '$' : undefined}
        valuePostfix={txFeeAvg.usd ? undefined : thinsp + config.chain.currency.symbol}
        period="24h"
        isLoading={txsStatsQuery.isPlaceholderData}
        href={{ pathname: '/stats', query: { chartId: 'averageTxnFee' } }}
      />
    </Box>
  );
};

export default React.memo(TxsStats);
