import { Box, Heading, Text, Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import getValueWithUnit from 'lib/getValueWithUnit';
import { currencyUnits } from 'lib/units';
import CurrencyValue from 'ui/shared/CurrencyValue';
import BlobEntity from 'ui/shared/entities/blob/BlobEntity';
import LinkInternal from 'ui/shared/LinkInternal';
import TextSeparator from 'ui/shared/TextSeparator';
import TxFeeStability from 'ui/shared/tx/TxFeeStability';
import Utilization from 'ui/shared/Utilization/Utilization';
import { useTranslation } from 'next-i18next';

const TxAdditionalInfoContent = ({ tx }: { tx: Transaction }) => {
  const sectionProps = {
    borderBottom: '1px solid',
    borderColor: 'divider',
    paddingBottom: 4,
  };
  const { t } = useTranslation('common');

  const sectionTitleProps = {
    color: 'gray.500',
    fontWeight: 600,
    marginBottom: 3,
  };

  return (
    <>
      <Heading as="h4" size="sm" mb={6}>
        {t('additional-info')}{' '}
      </Heading>
      {tx.blob_versioned_hashes && tx.blob_versioned_hashes.length > 0 && (
        <Box {...sectionProps} mb={4}>
          <Flex alignItems="center" justifyContent="space-between">
            <Text {...sectionTitleProps}>Blobs: {tx.blob_versioned_hashes.length}</Text>
            {tx.blob_versioned_hashes.length > 3 && (
              <LinkInternal href={route({ pathname: '/tx/[hash]', query: { hash: tx.hash, tab: 'blobs' } })} mb={3}>
                view all
              </LinkInternal>
            )}
          </Flex>
          <Flex flexDir="column" rowGap={3}>
            {tx.blob_versioned_hashes.slice(0, 3).map((hash, index) => (
              <Flex key={hash} columnGap={2}>
                <Box fontWeight={500}>{index + 1}</Box>
                <BlobEntity hash={hash} noIcon />
              </Flex>
            ))}
          </Flex>
        </Box>
      )}
      {!config.UI.views.tx.hiddenFields?.tx_fee && (
        <Box {...sectionProps} mb={4}>
          {(tx.stability_fee !== undefined || tx.fee.value !== null) && (
            <>
              <Text {...sectionTitleProps}>{t('transaction-fee')}</Text>
              {tx.stability_fee ? (
                <TxFeeStability data={tx.stability_fee} />
              ) : (
                <Flex>
                  <CurrencyValue
                    value={tx.fee.value}
                    currency={config.UI.views.tx.hiddenFields?.fee_currency ? '' : currencyUnits.ether}
                    exchangeRate={tx.exchange_rate}
                    accuracyUsd={2}
                    flexWrap="wrap"
                    rowGap={0}
                  />
                </Flex>
              )}
            </>
          )}
        </Box>
      )}
      {tx.gas_used !== null && (
        <Box {...sectionProps} mb={4}>
          <Text {...sectionTitleProps}>{t('gas-limit-usage')}</Text>
          <Flex>
            <Text>{BigNumber(tx.gas_used).toFormat()}</Text>
            <TextSeparator />
            <Text>{BigNumber(tx.gas_limit).toFormat()}</Text>
            <Utilization ml={4} value={Number(BigNumber(tx.gas_used).dividedBy(BigNumber(tx.gas_limit)).toFixed(2))} />
          </Flex>
        </Box>
      )}
      {!config.UI.views.tx.hiddenFields?.gas_fees &&
        (tx.base_fee_per_gas !== null || tx.max_fee_per_gas !== null || tx.max_priority_fee_per_gas !== null) && (
          <Box {...sectionProps} mb={4}>
            <Text {...sectionTitleProps}>
              {t('gas-fees')} ({currencyUnits.gwei})
            </Text>
            {tx.base_fee_per_gas !== null && (
              <Box>
                <Text as="span" fontWeight="500">
                  {t('base')}:{' '}
                </Text>
                <Text fontWeight="700" as="span">
                  {getValueWithUnit(tx.base_fee_per_gas, 'gwei').toFormat()}
                </Text>
              </Box>
            )}
            {tx.max_fee_per_gas !== null && (
              <Box mt={1}>
                <Text as="span" fontWeight="500">
                  {t('max')}:{' '}
                </Text>
                <Text fontWeight="700" as="span">
                  {getValueWithUnit(tx.max_fee_per_gas, 'gwei').toFormat()}
                </Text>
              </Box>
            )}
            {tx.max_priority_fee_per_gas !== null && (
              <Box mt={1}>
                <Text as="span" fontWeight="500">
                  {t('max-priority')}:{' '}
                </Text>
                <Text fontWeight="700" as="span">
                  {getValueWithUnit(tx.max_priority_fee_per_gas, 'gwei').toFormat()}
                </Text>
              </Box>
            )}
          </Box>
        )}
      {!(tx.blob_versioned_hashes && tx.blob_versioned_hashes.length > 0) && (
        <Box {...sectionProps} mb={4}>
          <Text {...sectionTitleProps}>{t('others')}</Text>
          <Box>
            <Text as="span" fontWeight="500">
              {t('txn-type')}:{' '}
            </Text>
            <Text fontWeight="600" as="span">
              {tx.type}
            </Text>
            {tx.type === 2 && (
              <Text fontWeight="400" as="span" ml={1} color="gray.500">
                (EIP-1559)
              </Text>
            )}
          </Box>
          <Box mt={1}>
            <Text as="span" fontWeight="500">
              {t('nonce')}:{' '}
            </Text>
            <Text fontWeight="600" as="span">
              {tx.nonce}
            </Text>
          </Box>
          <Box mt={1}>
            <Text as="span" fontWeight="500">
              {t('position')}:{' '}
            </Text>
            <Text fontWeight="600" as="span">
              {tx.position}
            </Text>
          </Box>
        </Box>
      )}
      <LinkInternal href={route({ pathname: '/tx/[hash]', query: { hash: tx.hash } })}>
        {t('more-details')}
      </LinkInternal>
    </>
  );
};

export default React.memo(TxAdditionalInfoContent);
