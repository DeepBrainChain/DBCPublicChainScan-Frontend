import { Box, Text, Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'next-i18next';

const DISTRIBUTION = [
  { key: 'staking_transferable', value: 77.96, color: '#4299E1' },
  { key: 'block_staking', value: 19.48, color: '#48BB78' },
  { key: 'staking_treasury', value: 0.59, color: '#ECC94B' },
  { key: 'staking_others', value: 1.97, color: '#A0AEC0' },
];

const DonutChart = ({ size = 160 }: { size?: number }) => {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 20;
  const strokeWidth = 24;

  let cumulativePercent = 0;

  return (
    <svg width={ size } height={ size } viewBox={ `0 0 ${size} ${size}` }>
      { DISTRIBUTION.map((segment) => {
        const startAngle = cumulativePercent * 3.6 * (Math.PI / 180);
        cumulativePercent += segment.value;
        const endAngle = cumulativePercent * 3.6 * (Math.PI / 180);

        const largeArc = segment.value > 50 ? 1 : 0;

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

const StakingTokenDistribution = () => {
  const { t } = useTranslation('common');
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } p={ 6 }>
      <Text fontSize="lg" fontWeight="bold" mb={ 4 }>{ t('staking_token_distribution') }</Text>

      <Flex direction={{ base: 'column', sm: 'row' }} align="center" gap={ 6 }>
        <DonutChart/>

        <Box>
          { DISTRIBUTION.map((item) => (
            <Flex key={ item.key } align="center" mb={ 2 }>
              <Box w="12px" h="12px" borderRadius="full" bg={ item.color } mr={ 2 } flexShrink={ 0 }/>
              <Text fontSize="sm" mr={ 2 }>{ t(item.key) }</Text>
              <Text fontSize="sm" fontWeight="bold">{ item.value }%</Text>
            </Flex>
          )) }
        </Box>
      </Flex>
    </Box>
  );
};

export default StakingTokenDistribution;
