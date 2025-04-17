import React, { useState, useEffect } from 'react'; // 确保导入 useState
import { Skeleton } from '@chakra-ui/react';
import { useContractAddress } from '../../../lib/hooks/useContractAddress';
import { useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { useInterval } from '@reactuses/core';
import ABI from './gpt/abi.json';

function GPUCountGpt() {
  const GPT_CONTRACT_ADDRESS_CARD = useContractAddress('GPT_CONTRACT_ADDRESS_CARD');
  // 获取gpt合约的dailyRewardAmount

  const {
    data: gptDailyRewardAmount,
    refetch,
    isLoading,
    error,
  } = useReadContract({
    address: GPT_CONTRACT_ADDRESS_CARD,
    abi: ABI,
    functionName: 'infos',
  });

  const [gpuCount, setGpuCount] = useState<number>(0.0); // 明确类型为 number

  useEffect(() => {
    if (gptDailyRewardAmount === undefined) return;

    console.log(gptDailyRewardAmount, 'gpt总回报???????????????????????????', error);
    let obj: any = gptDailyRewardAmount;
    // // 安全处理 BigInt 数据
    const gpuCount = obj ? parseFloat(formatEther(obj.gpuCount as any)) : 0;

    if (gpuCount === 0) {
      setGpuCount(0);
    } else {
      setGpuCount(gpuCount);
    }
  }, [gptDailyRewardAmount, isLoading]);

  // 每 10 秒刷新一次数据
  useInterval(() => {
    refetch();
  }, 60000); // 10 秒（如果你想要 1 秒，改为 1000）

  return (
    <Skeleton className="w-full" isLoaded={!isLoading}>
      {gpuCount}
    </Skeleton>
  );
}

export default GPUCountGpt;
