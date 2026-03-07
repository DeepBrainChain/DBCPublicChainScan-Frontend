import { Box, Flex, Skeleton, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'next-i18next';

import type { TokenDistribution } from 'ui/token/useTokenData';

interface Props {
  data: TokenDistribution | undefined;
  isLoading: boolean;
}

type Segment = {
  key: string;
  label: string;
  value: number;
  percentage: number;
  color: string;
};

const formatCompact = (value: number) => {
  const abs = Math.abs(value);

  if (abs >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${(value / 1e3).toFixed(2)}K`;

  return value.toFixed(2);
};

const toNumber = (value?: string) => {
  const parsed = Number(value ?? 0) / 1e15;
  return Number.isFinite(parsed) ? parsed : 0;
};

const DonutChart = ({ segments, size = 160 }: { segments: Array<Segment>; size?: number }) => {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 20;
  const strokeWidth = 24;
  const emptyStroke = useColorModeValue('#E2E8F0', '#4A5568');

  let cumulativePercent = 0;

  return (
    <svg width={ size } height={ size } viewBox={ `0 0 ${size} ${size}` }>
      <circle cx={ cx } cy={ cy } r={ r } fill="none" stroke={ emptyStroke } strokeWidth={ strokeWidth } />
      { segments.filter((segment) => segment.percentage > 0).map((segment) => {
        const startAngle = cumulativePercent * 3.6 * (Math.PI / 180);
        cumulativePercent += segment.percentage;
        const endAngle = cumulativePercent * 3.6 * (Math.PI / 180);
        const largeArc = segment.percentage > 50 ? 1 : 0;

        const x1 = cx + r * Math.sin(startAngle);
        const y1 = cy - r * Math.cos(startAngle);
        const x2 = cx + r * Math.sin(endAngle);
        const y2 = cy - r * Math.cos(endAngle);

        return (
          <path
            key={ segment.key }
            d={ `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}` }
            fill="none"
            stroke={ segment.color }
            strokeWidth={ strokeWidth }
            strokeLinecap="round"
          />
        );
      }) }
    </svg>
  );
};

const TokenDistributionDynamic = ({ data, isLoading }: Props) => {
  const { t } = useTranslation('common');
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const secondaryText = useColorModeValue('gray.600', 'gray.300');

  const totalIssuance = toNumber(data?.total_issuance);
  const available = toNumber(data?.available_balance);
  const staking = toNumber(data?.staking_locked);
  const treasury = toNumber(data?.treasury_balance);
  const other = toNumber(data?.other_locked);

  const toPercentage = (value: number) => {
    if (totalIssuance <= 0) {
      return 0;
    }

    return (value / totalIssuance) * 100;
  };

  const segments: Array<Segment> = [
    {
      key: 'available',
      label: t('token_distribution_available', { defaultValue: 'Available' }),
      value: available,
      percentage: toPercentage(available),
      color: '#48BB78',
    },
    {
      key: 'staking',
      label: t('token_distribution_staking', { defaultValue: 'Staking' }),
      value: staking,
      percentage: toPercentage(staking),
      color: '#4299E1',
    },
    {
      key: 'treasury',
      label: t('token_distribution_treasury', { defaultValue: 'Treasury' }),
      value: treasury,
      percentage: toPercentage(treasury),
      color: '#ED8936',
    },
    {
      key: 'other_locked',
      label: t('token_distribution_other_locked', { defaultValue: 'Other Locked' }),
      value: other,
      percentage: toPercentage(other),
      color: '#A0AEC0',
    },
  ];

  return (
    <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } p={ 6 }>
      <Text fontSize="lg" fontWeight="bold" mb={ 4 }>
        { t('token_distribution_title', { defaultValue: 'Token Distribution' }) }
      </Text>

      <Flex direction={{ base: 'column', sm: 'row' }} align="center" gap={ 6 }>
        <Skeleton isLoaded={ !isLoading } borderRadius="lg">
          <DonutChart segments={ segments }/>
        </Skeleton>

        <Box w="100%">
          { segments.map((segment) => (
            <Skeleton key={ segment.key } isLoaded={ !isLoading } mb={ 2 } borderRadius="md">
              <Flex align="center" justify="space-between" gap={ 2 }>
                <Flex align="center" minW={ 0 }>
                  <Box w="12px" h="12px" borderRadius="full" bg={ segment.color } mr={ 2 } flexShrink={ 0 }/>
                  <Text fontSize="sm" color={ secondaryText }>{ segment.label }</Text>
                </Flex>
                <Text fontSize="sm" fontWeight="bold" whiteSpace="nowrap">
                  {`${segment.percentage.toFixed(2)}% • ${formatCompact(segment.value)} DBC`}
                </Text>
              </Flex>
            </Skeleton>
          )) }
        </Box>
      </Flex>
    </Box>
  );
};

export default TokenDistributionDynamic;
