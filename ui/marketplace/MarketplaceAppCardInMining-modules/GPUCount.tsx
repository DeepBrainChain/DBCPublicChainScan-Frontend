import React, { useEffect } from 'react';
import { Skeleton } from '@chakra-ui/react';
import { useContractAddress } from '../../../lib/hooks/useContractAddress';
import stakingAbiShort from '../../../lib/hooks/useDeepLink/stakingAbi.json';
import stakingLongAbi from '../../../lib/hooks/useDeepLink/stakingLongAbi.json';
import { useReadContract } from 'wagmi';
import { useInterval } from '@reactuses/core';

function GPUCount() {
  const STAKING_CONTRACT_ADDRESS_SHORT = useContractAddress('STAKING_CONTRACT_ADDRESS_SHORT');
  const STAKING_CONTRACT_ADDRESS_LONG = useContractAddress('STAKING_CONTRACT_ADDRESS_LONG');

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
    abi: stakingLongAbi,
    functionName: 'totalStakingGpuCount',
  });

  const [totalCount, setTotalCount] = React.useState(0);

  useEffect(() => {
    const shortCount = totalStakingGpuCount_short ? Number(totalStakingGpuCount_short) : 0;
    const longCount = totalStakingGpuCount_long ? Number(totalStakingGpuCount_long) : 0;
    setTotalCount(shortCount + longCount);
  }, [totalStakingGpuCount_short, totalStakingGpuCount_long]);

  useInterval(() => {
    refetch_short();
    refetch_long();
  }, 60000);

  const isLoading = rewardLoading_short || rewardLoading_long;
  return (
    <Skeleton className="w-full" isLoaded={!isLoading}>
      {totalCount}
    </Skeleton>
  );
}

export default GPUCount;
