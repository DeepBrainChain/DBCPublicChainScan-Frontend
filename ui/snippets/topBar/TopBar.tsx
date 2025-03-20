import { Flex, Divider, useColorModeValue, Button } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import LanguageSwitcher from './lang';
import { useRouter } from 'next/router';
import Settings from './settings/Settings';
import SwapButton from './SwapButton';
import TopBarStats from './TopBarStats';
import MyUser from './user';

const feature = config.features.swapButton;

const TopBar = () => {
  const bgColor = useColorModeValue('gray.50', 'whiteAlpha.100');
  const router = useRouter();
  return (
    <Flex py={2} px={6} bgColor={bgColor} justifyContent="space-between" alignItems="center">
      <TopBarStats />
      <Flex alignItems="center" gap={2}>
        {feature.isEnabled && (
          <>
            <SwapButton />
            <Divider mr={3} ml={{ base: 2, sm: 3 }} height={4} orientation="vertical" />
          </>
        )}
        <LanguageSwitcher />
        <Settings />
        {router.asPath === '/mining/DeepLink' ? <MyUser /> : null}
      </Flex>
    </Flex>
  );
};

export default React.memo(TopBar);
