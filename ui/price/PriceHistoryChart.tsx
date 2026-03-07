import { Box, Skeleton, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'next-i18next';

import type { PriceHistoryResponse } from 'types/api/price';

interface Props {
  data: PriceHistoryResponse | undefined;
  isLoading: boolean;
}

const CHART_WIDTH = 900;
const CHART_HEIGHT = 300;
const PADDING = { top: 24, right: 24, bottom: 44, left: 60 };

const toNumber = (value?: string) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatDate = (timestamp: number) => {
  const value = timestamp > 1e12 ? timestamp : timestamp * 1000;
  return new Date(value).toLocaleDateString();
};

const formatPrice = (value: number) => `$${value.toFixed(4)}`;

const PriceHistoryChart = ({ data, isLoading }: Props) => {
  const { t } = useTranslation('common');
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const axisColor = useColorModeValue('#A0AEC0', '#718096');
  const labelColor = useColorModeValue('#4A5568', '#CBD5E0');
  const lineColor = useColorModeValue('#2B6CB0', '#63B3ED');
  const ema7Color = useColorModeValue('#38A169', '#68D391');
  const ema30Color = useColorModeValue('#DD6B20', '#F6AD55');

  const items = data?.items ?? [];
  const hasEnoughData = items.length >= 2;

  const prices = items.map((item) => toNumber(item.price));
  const minPrice = hasEnoughData ? Math.min(...prices) : 0;
  const maxPrice = hasEnoughData ? Math.max(...prices) : 0;
  const priceRange = Math.max(maxPrice - minPrice, 1e-8);

  const innerWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const innerHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  const xForIndex = (index: number) => PADDING.left + (index / Math.max(items.length - 1, 1)) * innerWidth;
  const yForPrice = (value: number) => PADDING.top + ((maxPrice - value) / priceRange) * innerHeight;

  const pathData = hasEnoughData
    ? items.map((item, index) => `${index === 0 ? 'M' : 'L'} ${xForIndex(index)} ${yForPrice(toNumber(item.price))}`).join(' ')
    : '';

  const ema7 = toNumber(data?.ema7_average);
  const ema30 = toNumber(data?.ema30_average);
  const ema7Y = yForPrice(ema7);
  const ema30Y = yForPrice(ema30);

  const firstLabel = items[0] ? formatDate(items[0].feed_at) : '';
  const midLabel = items[Math.floor(items.length / 2)] ? formatDate(items[Math.floor(items.length / 2)].feed_at) : '';
  const lastLabel = items[items.length - 1] ? formatDate(items[items.length - 1].feed_at) : '';

  return (
    <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } p={ 6 }>
      <Text fontSize="lg" fontWeight="bold" mb={ 4 }>
        { t('price_history_title', { defaultValue: 'Price History' }) }
      </Text>

      <Skeleton isLoaded={ !isLoading } borderRadius="md">
        <Box w="100%" h="300px">
          { !hasEnoughData ? (
            <Box display="flex" alignItems="center" justifyContent="center" h="100%">
              <Text color={ labelColor }>{ t('chart_no_data', { defaultValue: 'No data available' }) }</Text>
            </Box>
          ) : (
            <svg width="100%" height="100%" viewBox={ `0 0 ${CHART_WIDTH} ${CHART_HEIGHT}` } preserveAspectRatio="none">
              <line
                x1={ PADDING.left }
                y1={ PADDING.top + innerHeight }
                x2={ PADDING.left + innerWidth }
                y2={ PADDING.top + innerHeight }
                stroke={ axisColor }
              />
              <line
                x1={ PADDING.left }
                y1={ PADDING.top }
                x2={ PADDING.left }
                y2={ PADDING.top + innerHeight }
                stroke={ axisColor }
              />

              <line
                x1={ PADDING.left }
                y1={ ema7Y }
                x2={ PADDING.left + innerWidth }
                y2={ ema7Y }
                stroke={ ema7Color }
                strokeDasharray="6 4"
                opacity={ 0.9 }
              />
              <line
                x1={ PADDING.left }
                y1={ ema30Y }
                x2={ PADDING.left + innerWidth }
                y2={ ema30Y }
                stroke={ ema30Color }
                strokeDasharray="6 4"
                opacity={ 0.9 }
              />

              <path d={ pathData } fill="none" stroke={ lineColor } strokeWidth="2.5" />

              <text x={ PADDING.left - 8 } y={ PADDING.top + 4 } textAnchor="end" fontSize="11" fill={ labelColor }>
                { formatPrice(maxPrice) }
              </text>
              <text x={ PADDING.left - 8 } y={ PADDING.top + innerHeight + 4 } textAnchor="end" fontSize="11" fill={ labelColor }>
                { formatPrice(minPrice) }
              </text>

              <text x={ PADDING.left } y={ CHART_HEIGHT - 12 } textAnchor="start" fontSize="11" fill={ labelColor }>
                { firstLabel }
              </text>
              <text x={ PADDING.left + innerWidth / 2 } y={ CHART_HEIGHT - 12 } textAnchor="middle" fontSize="11" fill={ labelColor }>
                { midLabel }
              </text>
              <text x={ PADDING.left + innerWidth } y={ CHART_HEIGHT - 12 } textAnchor="end" fontSize="11" fill={ labelColor }>
                { lastLabel }
              </text>
            </svg>
          ) }
        </Box>
      </Skeleton>
    </Box>
  );
};

export default PriceHistoryChart;
