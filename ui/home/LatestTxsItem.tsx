import { Box, Flex, HStack, Text, Grid, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import config from 'configs/app';
import getValueWithUnit from 'lib/getValueWithUnit';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import { currencyUnits } from 'lib/units';
import AddressFromTo from 'ui/shared/address/AddressFromTo';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxStatus from 'ui/shared/statusTag/TxStatus';
import TxFeeStability from 'ui/shared/tx/TxFeeStability';
import TxWatchListTags from 'ui/shared/tx/TxWatchListTags';
import TxAdditionalInfo from 'ui/txs/TxAdditionalInfo';
import TxType from 'ui/txs/TxType';
import { useTranslation } from 'next-i18next';

type Props = {
  tx: Transaction;
  isLoading?: boolean;
};

const LatestTxsItem = ({ tx, isLoading }: Props) => {
  const dataTo = tx.to ? tx.to : tx.created_contract;
  const timeAgo = useTimeAgoIncrement(tx.timestamp || '0', true);
  const columnNum = config.UI.views.tx.hiddenFields?.value && config.UI.views.tx.hiddenFields?.tx_fee ? 2 : 3;
  const { t } = useTranslation('common');

  return (
    <Grid
      gridTemplateColumns={{
        lg: columnNum === 2 ? '3fr minmax(auto, 180px)' : '3fr minmax(auto, 180px) 150px',
        xl: columnNum === 2 ? '3fr minmax(auto, 250px)' : '3fr minmax(auto, 275px) 150px',
      }}
      gridGap={8}
      width="100%"
      minW="700px"
      borderTop="1px solid"
      borderColor="divider"
      p={4}
      _last={{ borderBottom: '1px solid', borderColor: 'divider' }}
      display={{ base: 'none', lg: 'grid' }}
    >
      <Flex overflow="hidden" w="100%">
        <TxAdditionalInfo tx={tx} isLoading={isLoading} my="3px" />
        <Box ml={3} w="calc(100% - 40px)">
          <HStack flexWrap="wrap" my="3px">
            <TxType types={tx.tx_types} isLoading={isLoading} />
            <TxStatus
              status={tx.status}
              errorText={tx.status === 'error' ? tx.result : undefined}
              isLoading={isLoading}
            />
            <TxWatchListTags tx={tx} isLoading={isLoading} />
          </HStack>
          <Flex alignItems="center" mt="7px" mb="3px">
            <TxEntity isLoading={isLoading} hash={tx.hash} fontWeight="700" />
            {tx.timestamp && (
              <Skeleton
                isLoaded={!isLoading}
                color="text_secondary"
                fontWeight="400"
                fontSize="sm"
                flexShrink={0}
                ml={2}
              >
                <span>{timeAgo}</span>
              </Skeleton>
            )}
          </Flex>
        </Box>
      </Flex>
      <AddressFromTo from={tx.from} to={dataTo} isLoading={isLoading} mode="compact" />
      <Flex flexDir="column">
        {!config.UI.views.tx.hiddenFields?.value && (
          <Skeleton isLoaded={!isLoading} my="3px">
            <Text as="span" whiteSpace="pre">
              {currencyUnits.ether}{' '}
            </Text>
            <Text as="span" variant="secondary">
              {getValueWithUnit(tx.value).dp(5).toFormat()}
            </Text>
          </Skeleton>
        )}
        {!config.UI.views.tx.hiddenFields?.tx_fee && (
          <Skeleton isLoaded={!isLoading} display="flex" whiteSpace="pre" my="3px">
            <Text as="span">{t('fee')} </Text>
            {tx.stability_fee ? (
              <TxFeeStability data={tx.stability_fee} accuracy={5} color="text_secondary" hideUsd />
            ) : (
              <Text as="span" variant="secondary">
                {tx.fee.value ? getValueWithUnit(tx.fee.value).dp(5).toFormat() : '-'}
              </Text>
            )}
          </Skeleton>
        )}
      </Flex>
    </Grid>
  );
};

export default React.memo(LatestTxsItem);
