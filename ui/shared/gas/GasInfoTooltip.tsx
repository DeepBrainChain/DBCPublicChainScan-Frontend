import {
  Box,
  DarkMode,
  Flex,
  Grid,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

import type { HomeStats } from 'types/api/stats';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import dayjs from 'lib/date/dayjs';
import LinkInternal from 'ui/shared/LinkInternal';

import GasInfoTooltipRow from './GasInfoTooltipRow';
import GasInfoUpdateTimer from './GasInfoUpdateTimer';
import { useTranslation } from 'next-i18next';

interface Props {
  children: React.ReactNode;
  data: HomeStats;
  dataUpdatedAt: number;
  isOpen?: boolean; // for testing purposes only; the tests were flaky, i couldn't find a better way
}

const POPOVER_OFFSET: [number, number] = [0, 10];
const feature = config.features.gasTracker;

const GasInfoTooltip = ({ children, data, dataUpdatedAt, isOpen }: Props) => {
  const tooltipBg = useColorModeValue('gray.700', 'gray.900');
  const { t } = useTranslation('common');

  if (!data.gas_prices) {
    return null;
  }
  const columnNum =
    Object.values(data.gas_prices).some((price) => price?.fiat_price) &&
    Object.values(data.gas_prices).some((price) => price?.price) &&
    feature.isEnabled &&
    feature.units.length === 2
      ? 3
      : 2;

  return (
    <Popover trigger="hover" isLazy offset={POPOVER_OFFSET} isOpen={isOpen}>
      <PopoverTrigger>{children}</PopoverTrigger>
      <Portal>
        <PopoverContent bgColor={tooltipBg} w="auto">
          <PopoverBody color="white">
            <DarkMode>
              <Flex flexDir="column" fontSize="xs" lineHeight={4} rowGap={3}>
                {data.gas_price_updated_at && (
                  <Flex justifyContent="space-between">
                    <Box color="text_secondary">{t('last-update')}</Box>
                    <Flex color="text_secondary" justifyContent="flex-end" columnGap={2} ml={3}>
                      {dayjs(data.gas_price_updated_at).format('MMM DD, HH:mm:ss')}
                      {data.gas_prices_update_in !== 0 && (
                        <GasInfoUpdateTimer
                          key={dataUpdatedAt}
                          startTime={dataUpdatedAt}
                          duration={data.gas_prices_update_in}
                        />
                      )}
                    </Flex>
                  </Flex>
                )}
                <Grid
                  rowGap={2}
                  columnGap="10px"
                  gridTemplateColumns={`repeat(${columnNum}, minmax(min-content, auto))`}
                >
                  <GasInfoTooltipRow name={t('fast')} info={data.gas_prices.fast} />
                  <GasInfoTooltipRow name={t('normal')} info={data.gas_prices.average} />
                  <GasInfoTooltipRow name={t('slow')} info={data.gas_prices.slow} />
                </Grid>
                <LinkInternal href={route({ pathname: '/gas-tracker' })}>{t('gas-tracker-overview')}</LinkInternal>
              </Flex>
            </DarkMode>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default React.memo(GasInfoTooltip);
