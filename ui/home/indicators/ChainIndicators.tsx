import { Box, Flex, Skeleton, Text, useColorModeValue } from '@chakra-ui/react';
import React, { useEffect } from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { HOMEPAGE_STATS } from 'stubs/stats';
import Hint from 'ui/shared/Hint';
import IconSvg from 'ui/shared/IconSvg';

import ChainIndicatorChartContainer from './ChainIndicatorChartContainer';
import ChainIndicatorItem from './ChainIndicatorItem';
import useFetchChartData from './useFetchChartData';
// import INDICATORS from './utils/indicators';

// const indicators = INDICATORS
//   .filter(({ id }) => config.UI.homepage.charts.includes(id))
//   .sort((a, b) => {
//     if (config.UI.homepage.charts.indexOf(a.id) > config.UI.homepage.charts.indexOf(b.id)) {
//       return 1;
//     }

//     if (config.UI.homepage.charts.indexOf(a.id) < config.UI.homepage.charts.indexOf(b.id)) {
//       return -1;
//     }

//     return 0;
//   });

import { useTranslation } from 'next-i18next';
import { getIndicators } from './utils/indicators'; // 导入 getIndicators

const ChainIndicators = () => {
  const { t } = useTranslation('common');

  // 价格
  const [dbcInfo, setDbcInfo] = React.useState({
    price: 0,
    change: 0,
  });

  async function fetchDbcInfo() {
    const url = 'https://dbchaininfo.congtu.cloud/query/dbc_info';

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data: any = await response.json();
      setDbcInfo({
        price: data.content.dbc_price,
        change: data.content.percent_change_24h,
      });
      return data;
    } catch (error) {
      console.error('Error fetching DBC info:', error);
    }
  }

  const { data, isPlaceholderData, isError, refetch, dataUpdatedAt } = useApiQuery('stats', {
    queryOptions: {
      placeholderData: HOMEPAGE_STATS,
      refetchOnMount: false,
    },
  });

  React.useEffect(() => {
    if (isPlaceholderData || !data?.gas_price_updated_at) {
      return;
    }
    fetchDbcInfo();
  }, [isPlaceholderData, data?.gas_price_updated_at, dataUpdatedAt, data?.gas_prices_update_in, refetch]);

  const indicators = getIndicators(t, dbcInfo)
    .filter(({ id }) => config.UI.homepage.charts.includes(id))
    .sort((a, b) => {
      if (config.UI.homepage.charts.indexOf(a.id) > config.UI.homepage.charts.indexOf(b.id)) {
        return 1;
      }

      if (config.UI.homepage.charts.indexOf(a.id) < config.UI.homepage.charts.indexOf(b.id)) {
        return -1;
      }

      return 0;
    });

  const [selectedIndicator, selectIndicator] = React.useState(indicators[0]?.id);
  const indicator = indicators.find(({ id }) => id === selectedIndicator);

  const queryResult = useFetchChartData(indicator);

  const statsQueryResult = useApiQuery('stats', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: HOMEPAGE_STATS,
    },
  });
  // console.log(statsQueryResult, 'statsQueryResultstatsQueryResultstatsQueryResultstatsQueryResult');
  const bgColorDesktop = useColorModeValue('white', 'gray.900');
  const bgColorMobile = useColorModeValue('white', 'black');
  const listBgColorDesktop = useColorModeValue('gray.50', 'black');
  const listBgColorMobile = useColorModeValue('gray.50', 'gray.900');

  if (indicators.length === 0) {
    return null;
  }

  const valueTitle = (() => {
    if (statsQueryResult.isPlaceholderData) {
      return <Skeleton h="48px" w="215px" mt={3} mb={4} />;
    }

    if (!statsQueryResult.data) {
      return (
        <Text mt={3} mb={4}>
          There is no data
        </Text>
      );
    }

    return (
      <Text fontWeight={600} fontFamily="heading" fontSize="48px" lineHeight="48px" mt={3}>
        {indicator?.value(statsQueryResult.data)}
      </Text>
    );
  })();

  const valueDiff = (() => {
    if (!statsQueryResult.data || !indicator?.valueDiff) {
      return null;
    }

    const diff = indicator.valueDiff(statsQueryResult.data);
    if (diff === undefined || diff === null) {
      return null;
    }

    const diffColor = diff >= 0 ? 'green.500' : 'red.500';

    return (
      <Skeleton
        isLoaded={!statsQueryResult.isPlaceholderData}
        display="flex"
        alignItems="center"
        color={diffColor}
        mt={2}
      >
        <IconSvg name="up" boxSize={5} mr={1} transform={diff < 0 ? 'rotate(180deg)' : 'rotate(0)'} />
        <Text color={diffColor} fontWeight={600}>
          {diff}%
        </Text>
      </Skeleton>
    );
  })();

  return (
    <Flex
      p={{ base: 0, lg: 8 }}
      borderRadius={{ base: 'none', lg: 'lg' }}
      boxShadow={{ base: 'none', lg: 'xl' }}
      bgColor={{ base: bgColorMobile, lg: bgColorDesktop }}
      columnGap={6}
      rowGap={0}
      flexDir={{ base: 'column', lg: 'row' }}
      w="100%"
      alignItems="stretch"
      mt={8}
    >
      <Flex flexGrow={1} flexDir="column" order={{ base: 2, lg: 1 }} p={{ base: 6, lg: 0 }}>
        <Flex alignItems="center">
          <Text fontWeight={500} fontFamily="heading" fontSize="lg">
            {indicator?.title}
          </Text>
          {indicator?.hint && <Hint label={indicator.hint} ml={1} />}
        </Flex>
        <Box mb={4}>
          {valueTitle}
          {valueDiff}
        </Box>
        <ChainIndicatorChartContainer {...queryResult} />
      </Flex>
      {indicators.length > 1 && (
        <Flex
          flexShrink={0}
          flexDir="column"
          as="ul"
          p={3}
          borderRadius="lg"
          bgColor={{ base: listBgColorMobile, lg: listBgColorDesktop }}
          rowGap={3}
          order={{ base: 1, lg: 2 }}
        >
          {indicators.map((indicator) => (
            <ChainIndicatorItem
              key={indicator.id}
              {...indicator}
              isSelected={selectedIndicator === indicator.id}
              onClick={selectIndicator}
              stats={statsQueryResult}
            />
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default ChainIndicators;
