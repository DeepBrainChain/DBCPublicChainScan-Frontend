import React, { useState, useEffect } from 'react';
import { Skeleton } from '@chakra-ui/react';
import { useContractAddress } from '../../../lib/hooks/useContractAddress';
import stakingAbiShort from '../../../lib/hooks/useDeepLink/stakingAbi.json';
import { useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { useInterval } from '@reactuses/core';

function DailyMiningReward() {
  const STAKING_CONTRACT_ADDRESS_SHORT = useContractAddress('STAKING_CONTRACT_ADDRESS_SHORT');

  const {
    data: dailyRewardAmount_short,
    refetch: refetch_short,
    isLoading: rewardLoading_short,
  } = useReadContract({
    address: STAKING_CONTRACT_ADDRESS_SHORT,
    abi: stakingAbiShort,
    functionName: 'dailyRewardAmount',
  });

  const [totalCount, setTotalCount] = useState<number>(0.0);

  useEffect(() => {
    if (dailyRewardAmount_short === undefined) return;
    const shortAmount = dailyRewardAmount_short ? parseFloat(formatEther(dailyRewardAmount_short as any)) : 0;
    setTotalCount(shortAmount);
  }, [dailyRewardAmount_short]);

  useInterval(() => {
    refetch_short();
  }, 60000);

  return <Skeleton isLoaded={!rewardLoading_short}>{totalCount}</Skeleton>;
}

export default DailyMiningReward;
