import { Grid, GridItem } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'next-i18next';

import DailyStatsChart from 'ui/price/DailyStatsChart';
import PriceHistoryChart from 'ui/price/PriceHistoryChart';
import PriceOverview from 'ui/price/PriceOverview';
import usePriceData from 'ui/price/usePriceData';
import PageTitle from 'ui/shared/Page/PageTitle';

const PriceOracleDashboard = () => {
  const { t } = useTranslation('common');
  const { current, history, daily } = usePriceData();

  return (
    <>
      <PageTitle title={ t('price_oracle_title', { defaultValue: 'DBC Price Oracle' }) }/>

      <PriceOverview
        current={ current.data }
        history={ history.data }
        isLoading={ current.isPlaceholderData || history.isPlaceholderData }
      />

      <Grid templateColumns={{ base: '1fr', xl: '1fr 1fr' }} gap={ 6 }>
        <GridItem>
          <PriceHistoryChart data={ history.data } isLoading={ history.isPlaceholderData }/>
        </GridItem>
        <GridItem>
          <DailyStatsChart data={ daily.data } isLoading={ daily.isPlaceholderData }/>
        </GridItem>
      </Grid>
    </>
  );
};

export default PriceOracleDashboard;
