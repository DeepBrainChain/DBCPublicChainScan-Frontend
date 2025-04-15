import React, { useState, useEffect } from 'react'; // 确保导入 useState
import { Skeleton } from '@chakra-ui/react';
import { useContractAddress } from '../../../lib/hooks/useContractAddress';
import stakingAbiShort from '../../../lib/hooks/useDeepLink/stakingAbi.json';
import stakingLongAbi from '../../../lib/hooks/useDeepLink/stakingLongAbi.json';
import { useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { useInterval } from '@reactuses/core';

function DailyMiningReward() {
  const STAKING_CONTRACT_ADDRESS_SHORT = useContractAddress('STAKING_CONTRACT_ADDRESS_SHORT');
  const STAKING_CONTRACT_ADDRESS_LONG = useContractAddress('STAKING_CONTRACT_ADDRESS_LONG');

  const {
    data: dailyRewardAmount_short,
    refetch: refetch_short,
    isLoading: rewardLoading_short,
  } = useReadContract({
    address: STAKING_CONTRACT_ADDRESS_SHORT,
    abi: stakingAbiShort,
    functionName: 'dailyRewardAmount',
  });

  const {
    data: dailyRewardAmount_long,
    refetch: refetch_long,
    isLoading: rewardLoading_long,
  } = useReadContract({
    address: STAKING_CONTRACT_ADDRESS_LONG,
    abi: stakingLongAbi,
    functionName: 'dailyRewardAmount',
  });

  const [totalCount, setTotalCount] = useState<number>(0.0); // 明确类型为 number

  useEffect(() => {
    if (dailyRewardAmount_short === undefined || dailyRewardAmount_long === undefined) return;

    console.log(dailyRewardAmount_short, dailyRewardAmount_long, '总回报');

    // 安全处理 BigInt 数据
    const shortAmount = dailyRewardAmount_short ? parseFloat(formatEther(dailyRewardAmount_short as any)) : 0;
    const longAmount = dailyRewardAmount_long ? parseFloat(formatEther(dailyRewardAmount_long as any)) : 0;

    if (shortAmount === 0 && longAmount === 0) {
      setTotalCount(0.0);
    } else {
      setTotalCount(shortAmount + longAmount);
    }
  }, [dailyRewardAmount_short, dailyRewardAmount_long]);

  // 每 10 秒刷新一次数据
  useInterval(() => {
    refetch_short();
    refetch_long();
  }, 60000); // 10 秒（如果你想要 1 秒，改为 1000）

  return <Skeleton isLoaded={!rewardLoading_short && !rewardLoading_long}>{totalCount}</Skeleton>;
}

export default DailyMiningReward;
