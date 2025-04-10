import { Box, Flex, chakra, useBoolean } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import useApiQuery from 'lib/api/useApiQuery';
import { STATS_CHARTS } from 'stubs/stats';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import LinkInternal from 'ui/shared/LinkInternal';
import ChartWidgetContainer from 'ui/stats/ChartWidgetContainer';
import { useTranslation } from 'next-i18next';

const GAS_PRICE_CHART_ID = 'averageGasPrice';

const GasTrackerChart = () => {
  const [isChartLoadingError, setChartLoadingError] = useBoolean(false);
  const { data, isPlaceholderData, isError } = useApiQuery('stats_lines', {
    queryOptions: {
      placeholderData: STATS_CHARTS,
    },
  });
  const { t } = useTranslation('common');

  const content = (() => {
    if (isPlaceholderData) {
      return <ContentLoader />;
    }

    if (isChartLoadingError || isError) {
      return <DataFetchAlert />;
    }

    const chart = data?.sections
      .map((section) => section.charts.find((chart) => chart.id === GAS_PRICE_CHART_ID))
      .filter(Boolean)?.[0];

    if (!chart) {
      return <DataFetchAlert />;
    }

    return (
      <ChartWidgetContainer
        id={GAS_PRICE_CHART_ID}
        title={chart.title}
        description={chart.description}
        interval="oneMonth"
        units={chart.units || undefined}
        isPlaceholderData={isPlaceholderData}
        onLoadingError={setChartLoadingError.on}
        h="320px"
      />
    );
  })();

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <chakra.h3 textStyle="h3">{t('deep_gas_price_history')}</chakra.h3>
        <LinkInternal href={route({ pathname: '/stats', hash: 'gas' })}>
          {t('deep_charts')} & {t('deep_stats')}
        </LinkInternal>
      </Flex>
      {content}
    </Box>
  );
};

export default React.memo(GasTrackerChart);
