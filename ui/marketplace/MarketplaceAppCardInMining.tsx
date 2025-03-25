import { Box, Flex, Image, Skeleton, useColorModeValue, chakra, Text, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import type { MouseEvent } from 'react';
import React, { useEffect } from 'react';
import stakingAbi from '../../lib/hooks/useDeepLink/stakingAbi.json';
import { useReadContract } from 'wagmi';
import { useContractAddress } from '../../lib/hooks/useContractAddress';
import DailyMiningReward from './MarketplaceAppCardInMining-modules/DailyMiningReward';
import GPUCount from './MarketplaceAppCardInMining-modules/GPUCount';
import DailyMiningRewardGpt from './MarketplaceAppCardInMining-modules/DailyMiningRewardGpt';
import GPUCountGpt from './MarketplaceAppCardInMining-modules/GPUCountGpt';
import { useInterval } from '@reactuses/core';

interface Props {
  id: string;
  url: string;
  title: string;
  logo: string;
  miningInfo: {
    dailyReward: string;
    gpuCount: string;
  };
  tokenInfo: {
    symbol: string;
    price: string;
    priceChange: string;
  };
  isLoading: boolean;
  onAppClick: (event: MouseEvent, id: string) => void;
  className?: string;
}

const MarketplaceAppCard = ({
  id,
  url,
  title,
  logo,
  miningInfo,
  tokenInfo,
  isLoading,
  onAppClick,
  className,
}: Props) => {
  const href = {
    pathname: '/mining/[id]' as const,
    query: { id },
  };

  // 总的loading
  const [loading, setLoading] = React.useState(true);

  const [dlcData, setDlcData] = React.useState({
    price: 0,
    change: 0,
  });
  // 获取dlc的价格
  const getDlcPrice = async () => {
    setLoading(true);
    const response = await fetch('https://dbchaininfo.congtu.cloud/query/dlc_info?language=CN', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data: any = await response.json();
    setDlcData({
      price: data.content.dlc_price,
      change: data.content.percent_change_24h,
    });
    setLoading(false);
  };
  // 每 10 秒刷新一次数据
  useInterval(
    () => {
      getDlcPrice();
    },
    60000,
    { immediate: true }
  ); // 10 秒（如果你想要 1 秒，改为 1000）
  return (
    <NextLink href={href} passHref legacyBehavior>
      <Link
        as="article"
        className={className}
        _hover={{
          boxShadow: isLoading ? 'none' : 'lg',
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out',
          textDecoration: 'none',
        }}
        borderRadius="lg"
        padding={6}
        border="1px"
        borderColor={useColorModeValue('gray.200', 'gray.600')}
        bg={useColorModeValue('white', 'gray.800')}
        onClick={(e: any) => onAppClick(e, id)}
        display="block"
      >
        <Flex direction="column" gap={4}>
          <Flex justify="space-between" align="start">
            <Skeleton isLoaded={!loading} w="80px" h="80px" borderRadius="lg" flexShrink={0}>
              <Image src={logo} alt={`${title} logo`} borderRadius="lg" w="80px" h="80px" objectFit="cover" />
            </Skeleton>

            <Flex direction="column" gap={1}>
              <Skeleton isLoaded={!loading}>
                <Box
                  border="1px"
                  borderColor={useColorModeValue('gray.200', 'gray.600')}
                  borderRadius="md"
                  px={2}
                  py={1}
                >
                  <Text fontSize="md" fontWeight="medium">
                    ${tokenInfo?.symbol}: {title === 'DecentralGPT' ? 0 : dlcData.price}
                  </Text>
                </Box>
              </Skeleton>
              <Skeleton isLoaded={!loading}>
                <Text color="green.500" fontWeight="medium" fontSize="sm">
                  {title === 'DecentralGPT' ? `${0}%` : `${dlcData.change}%`}
                </Text>
              </Skeleton>
            </Flex>
          </Flex>

          <Skeleton isLoaded={!loading}>
            <Text fontSize="xl" fontWeight="bold">
              {title}
            </Text>
          </Skeleton>

          <Skeleton isLoaded={!loading}>
            <Flex direction="column" gap={2} bg={useColorModeValue('gray.50', 'gray.700')} p={3} borderRadius="md">
              <Text fontSize="sm" fontWeight="medium">
                Daily Mining Reward:
                {title === 'DecentralGPT' ? <DailyMiningRewardGpt /> : <DailyMiningReward />}
              </Text>
              <Text fontSize="sm" fontWeight="medium">
                GPU Count:
                {title === 'DecentralGPT' ? <GPUCountGpt /> : <GPUCount />}
              </Text>
            </Flex>
          </Skeleton>
        </Flex>
      </Link>
    </NextLink>
  );
};

export default React.memo(chakra(MarketplaceAppCard));
