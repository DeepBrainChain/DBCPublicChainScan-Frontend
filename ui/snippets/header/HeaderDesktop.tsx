import { HStack, Box, Tooltip, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import config from 'configs/app';
import NetworkLogo from 'ui/snippets/networkMenu/NetworkLogo';
import ProfileMenuDesktop from 'ui/snippets/profileMenu/ProfileMenuDesktop';
import SearchBar from 'ui/snippets/searchBar/SearchBar';
import WalletMenuDesktop from 'ui/snippets/walletMenu/WalletMenuDesktop';

import Burger from './Burger';

type Props = {
  renderSearchBar?: () => React.ReactNode;
  isMarketplaceAppPage?: boolean;
};

const HeaderDesktop = ({ renderSearchBar, isMarketplaceAppPage }: Props) => {
  const searchBar = renderSearchBar ? renderSearchBar() : <SearchBar/>;
  const router = useRouter();
  const routerH = () => {
    if (router.pathname !== '/mymachine') {
      router.push('/mymachine');
    }
  };
  return (
    <HStack
      as="header"
      display={{ base: 'none', lg: 'flex' }}
      width="100%"
      alignItems="center"
      justifyContent="center"
      gap={ 12 }
    >
      { isMarketplaceAppPage && (
        <Box display="flex" alignItems="center" gap={ 3 }>
          <Burger isMarketplaceAppPage/>
          <NetworkLogo isCollapsed/>
        </Box>
      ) }
      <Box width="100%">{ searchBar }</Box>
      <Box display="flex" alignItems="center" gap={ 3 }>
        <Tooltip label="My machine" className="hidden md:block">
          <Button fontSize="sm" colorScheme="blue" onClick={ routerH }>
            My machine
          </Button>
        </Tooltip>
        { config.features.account.isEnabled && <ProfileMenuDesktop/> }
        { config.features.blockchainInteraction.isEnabled && <WalletMenuDesktop/> }
      </Box>
    </HStack>
  );
};

export default React.memo(HeaderDesktop);
