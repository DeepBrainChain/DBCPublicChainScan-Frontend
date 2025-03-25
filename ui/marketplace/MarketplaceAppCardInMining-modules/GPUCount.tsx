import React, { useEffect } from 'react';
import { Skeleton } from '@chakra-ui/react';
import { useContractAddress } from '../../../lib/hooks/useContractAddress';
import stakingAbiShort from '../../../lib/hooks/useDeepLink/stakingAbi.json';
import stakingAbiLong from '../../../lib/hooks/useDeepLink/stakingLongAbi.json';
import { useReadContract } from 'wagmi';
import { useInterval } from '@reactuses/core';

function GPUCount() {
  const STAKING_CONTRACT_ADDRESS_SHORT = useContractAddress('STAKING_CONTRACT_ADDRESS_SHORT');
  const STAKING_CONTRACT_ADDRESS_LONG = useContractAddress('STAKING_CONTRACT_ADDRESS_LONG');
  // 读取 dailyRewardAmount

  const {
    data: totalStakingGpuCount_short,
    isLoading: rewardLoading_short,
    error,
    refetch: refetch_short,
  } = useReadContract({
    address: STAKING_CONTRACT_ADDRESS_SHORT,
    abi: stakingAbiShort,
    functionName: 'totalStakingGpuCount',
  });

  const {
    data: totalStakingGpuCount_long,
    isLoading: rewardLoading_long,
    refetch: refetch_long,
  } = useReadContract({
    address: STAKING_CONTRACT_ADDRESS_LONG,
    abi: stakingAbiLong,
    functionName: 'totalStakingGpuCount',
  });

  // 总gpu
  const [totalCount, setTotalCount] = React.useState<any>(0);
  useEffect(() => {
    console.log(Number(totalStakingGpuCount_short) === 0, totalStakingGpuCount_long, 'AAAAAAAAAAAAAAAAAAA', error);

    if (Number(totalStakingGpuCount_short) === 0 && Number(totalStakingGpuCount_long) === 0) {
      setTotalCount(0);
    } else {
      setTotalCount(Number(totalStakingGpuCount_short) + Number(totalStakingGpuCount_long));
    }
  }, [rewardLoading_short, rewardLoading_long, totalStakingGpuCount_short, totalStakingGpuCount_long]);

  // 每 10 秒刷新一次数据
  useInterval(() => {
    refetch_short();
    refetch_long();
  }, 60000); // 10 秒（如果你想要 1 秒，改为 1000）
  return <Skeleton isLoaded={true}>{totalCount}</Skeleton>;
}

export default GPUCount;
