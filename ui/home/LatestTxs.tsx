import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import useApiQuery from 'lib/api/useApiQuery';
import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import useIsMobile from 'lib/hooks/useIsMobile';
import useNewTxsSocket from 'lib/hooks/useNewTxsSocket';
import { TX } from 'stubs/tx';
import LinkInternal from 'ui/shared/LinkInternal';
import SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';

import LatestTxsItem from './LatestTxsItem';
import LatestTxsItemMobile from './LatestTxsItemMobile';
import { useTranslation } from 'next-i18next';

const LatestTransactions = () => {
  const isMobile = useIsMobile();
  const txsCount = isMobile ? 2 : 6;
  const { data, isPlaceholderData, isError } = useApiQuery('homepage_txs', {
    queryOptions: {
      placeholderData: Array(txsCount).fill(TX),
    },
  });
  const { t } = useTranslation('common');

  const { num, socketAlert } = useNewTxsSocket();

  if (isError) {
    return <Text mt={4}>No data. Please reload page.</Text>;
  }

  if (data) {
    const txsUrl = route({ pathname: '/txs' });
    return (
      <>
        <SocketNewItemsNotice
          borderBottomRadius={0}
          url={txsUrl}
          num={num}
          alert={socketAlert}
          isLoading={isPlaceholderData}
        />
        <Box mb={3} display={{ base: 'block', lg: 'none' }}>
          {data.slice(0, txsCount).map((tx, index) => (
            <LatestTxsItemMobile
              key={tx.hash + (isPlaceholderData ? index : '')}
              tx={tx}
              isLoading={isPlaceholderData}
            />
          ))}
        </Box>
        <AddressHighlightProvider>
          <Box mb={4} display={{ base: 'none', lg: 'block' }}>
            {data.slice(0, txsCount).map((tx, index) => (
              <LatestTxsItem key={tx.hash + (isPlaceholderData ? index : '')} tx={tx} isLoading={isPlaceholderData} />
            ))}
          </Box>
        </AddressHighlightProvider>
        <Flex justifyContent="center">
          <LinkInternal fontSize="sm" href={txsUrl}>
            {t('view-all-transactions')}
          </LinkInternal>
        </Flex>
      </>
    );
  }

  return null;
};

export default LatestTransactions;
