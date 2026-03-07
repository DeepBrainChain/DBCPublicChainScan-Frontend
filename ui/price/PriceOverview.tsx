import { Badge, Box, Grid, GridItem, Skeleton, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'next-i18next';

import type { PriceHistoryResponse, PriceInfo } from 'types/api/price';

interface Props {
  current: PriceInfo | undefined;
  history: PriceHistoryResponse | undefined;
  isLoading: boolean;
}

const formatCurrency = (value: number, maximumFractionDigits = 4) => {
  if (!Number.isFinite(value)) {
    return '$0.00';
  }

  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits,
  }).format(value);
};

const formatPercent = (value: number) => {
  if (!Number.isFinite(value)) {
    return '0.00%';
  }

  return `${value.toFixed(2)}%`;
};

const toNumber = (value?: string) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const StatCard = ({ label, value, extra, isLoading }: { label: string; value: string; extra?: React.ReactNode; isLoading: boolean }) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } p={ 4 }>
      <Text fontSize="sm" color="gray.500" mb={ 1 }>{ label }</Text>
      <Skeleton isLoaded={ !isLoading }>
        <Text fontSize="xl" fontWeight="bold">{ value }</Text>
      </Skeleton>
      { extra }
    </Box>
  );
};

const PriceOverview = ({ current, history, isLoading }: Props) => {
  const { t } = useTranslation('common');

  const currentPrice = toNumber(current?.price);
  const issuance = toNumber(current?.total_issuance);
  const marketCap = (currentPrice * issuance) / 1e15;
  const inflation = toNumber(current?.inflation);
  const ema7 = toNumber(history?.ema7_average);
  const ema30 = toNumber(history?.ema30_average);
  const priceChange = toNumber(current?.price_change);

  const changeColor = priceChange >= 0 ? 'green' : 'red';
  const changePrefix = priceChange >= 0 ? '+' : '';

  return (
    <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(5, 1fr)' }} gap={ 4 } mb={ 8 }>
      <GridItem>
        <StatCard
          label={ t('price_current_price', { defaultValue: 'Current Price' }) }
          value={ formatCurrency(currentPrice) }
          extra={ (
            <Skeleton isLoaded={ !isLoading } mt={ 2 }>
              <Badge colorScheme={ changeColor } variant="subtle">
                {`${changePrefix}${formatPercent(priceChange)}`}
              </Badge>
            </Skeleton>
          ) }
          isLoading={ isLoading }
        />
      </GridItem>
      <GridItem>
        <StatCard
          label={ t('price_market_cap', { defaultValue: 'Market Cap' }) }
          value={ formatCurrency(marketCap, 2) }
          isLoading={ isLoading }
        />
      </GridItem>
      <GridItem>
        <StatCard
          label={ t('price_inflation_rate', { defaultValue: 'Inflation Rate' }) }
          value={ formatPercent(inflation) }
          isLoading={ isLoading }
        />
      </GridItem>
      <GridItem>
        <StatCard
          label={ t('price_ema_7d', { defaultValue: '7-day EMA' }) }
          value={ formatCurrency(ema7) }
          isLoading={ isLoading }
        />
      </GridItem>
      <GridItem>
        <StatCard
          label={ t('price_ema_30d', { defaultValue: '30-day EMA' }) }
          value={ formatCurrency(ema30) }
          isLoading={ isLoading }
        />
      </GridItem>
    </Grid>
  );
};

export default PriceOverview;
