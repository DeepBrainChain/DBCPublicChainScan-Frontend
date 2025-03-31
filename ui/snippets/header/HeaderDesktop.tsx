import { HStack, Box, Tooltip, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import config from 'configs/app';
import NetworkLogo from 'ui/snippets/networkMenu/NetworkLogo';
import ProfileMenuDesktop from 'ui/snippets/profileMenu/ProfileMenuDesktop';
import SearchBar from 'ui/snippets/searchBar/SearchBar';
import WalletMenuDesktop from 'ui/snippets/walletMenu/WalletMenuDesktop';
import { useTranslation } from 'next-i18next';

import Burger from './Burger';

type Props = {
  renderSearchBar?: () => React.ReactNode;
  isMarketplaceAppPage?: boolean;
};

const HeaderDesktop = ({ renderSearchBar, isMarketplaceAppPage }: Props) => {
  const searchBar = renderSearchBar ? renderSearchBar() : <SearchBar />;
  const router = useRouter();
  const { query } = router;
  const routerH = () => {
    console.log(query.tab, 'Current tab from URL');

    if (query.tab === 'cpu-mining') {
      // 跳转到带宽挖矿机器列表
      router.push('/gpumachine');
    } else {
      // 跳转到长租机器列表
      router.push('/mymachine');
    }
  };
  const { t, i18n } = useTranslation('common');
  return (
    <HStack
      as="header"
      display={{ base: 'none', lg: 'flex' }}
      width="100%"
      alignItems="center"
      justifyContent="center"
      gap={12}
    >
      {isMarketplaceAppPage && (
        <Box display="flex" alignItems="center" gap={3}>
          <Burger isMarketplaceAppPage />
          <NetworkLogo isCollapsed />
        </Box>
      )}

      <Box width="100%">{searchBar}</Box>
      <Box display="flex" alignItems="center" gap={3}>
        {router.query.id === 'DeepLink' ? (
          <Tooltip label={t('my_machine')} className="hidden md:block">
            <Button fontSize="sm" colorScheme="blue" onClick={routerH}>
              {t('my_machine')}
            </Button>
          </Tooltip>
        ) : undefined}
        {config.features.account.isEnabled && <ProfileMenuDesktop />}
        {config.features.blockchainInteraction.isEnabled && <WalletMenuDesktop />}
      </Box>
    </HStack>
  );
};

export default React.memo(HeaderDesktop);
