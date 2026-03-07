import { Box, Skeleton, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'next-i18next';

import type { DailyStatsResponse } from 'types/api/price';

interface Props {
  data: DailyStatsResponse | undefined;
  isLoading: boolean;
}

const CHART_WIDTH = 900;
const CHART_HEIGHT = 300;
const PADDING = { top: 24, right: 24, bottom: 44, left: 60 };

const formatDate = (value: string) => new Date(value).toLocaleDateString();
const formatAmount = (value?: string) => Number(value ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 });

const DailyStatsChart = ({ data, isLoading }: Props) => {
  const { t } = useTranslation('common');
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const axisColor = useColorModeValue('#A0AEC0', '#718096');
  const labelColor = useColorModeValue('#4A5568', '#CBD5E0');
  const barColor = useColorModeValue('#3182CE', '#63B3ED');

  const items = data?.items ?? [];
  const hasEnoughData = items.length > 0;

  const totals = items.map((item) => item.total);
  const maxTotal = hasEnoughData ? Math.max(...totals, 1) : 1;

  const innerWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const innerHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const barGroupWidth = innerWidth / Math.max(items.length, 1);
  const barWidth = Math.max(4, barGroupWidth * 0.65);

  const firstLabel = items[0] ? formatDate(items[0].time_utc) : '';
  const midLabel = items[Math.floor(items.length / 2)] ? formatDate(items[Math.floor(items.length / 2)].time_utc) : '';
  const lastLabel = items[items.length - 1] ? formatDate(items[items.length - 1].time_utc) : '';

  return (
    <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } p={ 6 }>
      <Text fontSize="lg" fontWeight="bold" mb={ 4 }>
        { t('price_daily_stats_title', { defaultValue: 'Daily Transfer Stats' }) }
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

              { items.map((item, index) => {
                const value = item.total;
                const barHeight = (value / maxTotal) * innerHeight;
                const x = PADDING.left + index * barGroupWidth + (barGroupWidth - barWidth) / 2;
                const y = PADDING.top + innerHeight - barHeight;

                return (
                  <rect
                    key={ `${item.time_utc}-${index}` }
                    x={ x }
                    y={ y }
                    width={ barWidth }
                    height={ Math.max(1, barHeight) }
                    fill={ barColor }
                    rx="2"
                  >
                    <title>
                      {`${t('price_transfer_count', { defaultValue: 'Transfer count' })}: ${value.toLocaleString()}\n${t('price_transfer_amount', { defaultValue: 'Transfer amount' })}: ${formatAmount(item.transfer_amount_total)}`}
                    </title>
                  </rect>
                );
              }) }

              <text x={ PADDING.left - 8 } y={ PADDING.top + 4 } textAnchor="end" fontSize="11" fill={ labelColor }>
                { maxTotal.toLocaleString() }
              </text>
              <text x={ PADDING.left - 8 } y={ PADDING.top + innerHeight + 4 } textAnchor="end" fontSize="11" fill={ labelColor }>
                0
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

export default DailyStatsChart;
