import { Card, CardBody, CardHeader, Heading, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import MymachineSearchTop from './modules/mymachine-search-top';
import { useTranslation } from 'next-i18next';
import MymachineTable from './modules/MymachineTable';
import { useDebounceFn } from '@reactuses/core';
import { formatEther } from 'viem';
import { useAccount, useConfig } from 'wagmi';
import { formatWithThousandSeparator } from 'lib/utils/formatNumber';
import { useContractAddress } from 'lib/hooks/useContractAddress';
import stakingAbi from './abi/stakeaib.json';
import { readContract } from 'wagmi/actions';
// import { config } from 'lib/web3/mainnetConf';

function Index() {
  const { t } = useTranslation('common');
  const [loading, setLoading] = useState(true); // 加载状态
  const [error, setError] = useState<string | null>(null); // 错误状态
  const [machineData, setMachineData] = useState<any[]>([]); // 存储请求数据
  const { address, isConnected } = useAccount();
  const toast = useToast();
  const CPU_CONTRACT_ADDRESS_STAKING = useContractAddress('CPU_CONTRACT_ADDRESS_STAKING');
  const config = useConfig();

  // 定义读取函数
  async function getRewardInfoH(machineId: string) {
    console.log(config, 'configconfigconfigconfigconfig');
    try {
      const balance = await readContract(config, {
        address: CPU_CONTRACT_ADDRESS_STAKING,
        abi: stakingAbi,
        functionName: 'machineId2LockedRewardDetail',
        args: [machineId],
      });
      return balance;
    } catch (error) {
      console.error('读取合约失败:', error);
      throw error;
    }
  }

  // 合约调用 + 锁仓值计算（返回字符串）
  async function getLockedValue(machineId: string): Promise<string> {
    try {
      const rewardDetail: any = await getRewardInfoH(machineId);
      if (!rewardDetail || rewardDetail.length < 3) return '0';

      const total = parseFloat(formatEther(rewardDetail[0]));
      const released = parseFloat(formatEther(rewardDetail[3]));
      const locked = total - released;
      return locked.toFixed(2); // 返回小数保留位数
    } catch (error) {
      console.error(`读取锁仓失败: ${machineId}`, error);
      return '0';
    }
  }

  // 主函数：获取 machineInfos 并补充 Locked 字段
  const fetchMachineInfoData = async (v = '') => {
    try {
      setLoading(true);

      const endpoint = 'https://dbcswap.io/subgraph/name/bandwidth-staking-state';

      const whereClause = {
        holder: '$holderAddress',
        ...(v && { machineId: `"${v}"` }),
      };

      const skip = v ? 0 : (currentPage - 1) * pageSize;
      const fetchSize = v ? 1000 : pageSize;

      const query = `
      query($holderAddress: String!) {
        machineInfos(where: { ${Object.entries(whereClause)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ')} }, first: ${fetchSize}, skip: ${skip}) {
          id
          holder
          machineId
          totalCalcPoint
          totalCalcPointWithNFT
          fullTotalCalcPoint
          totalReservedAmount
          blockNumber
          blockTimestamp
          transactionHash
          isStaking
          online
          registered
          totalClaimedRewardAmount
          totalReleasedRewardAmount
          region
        }
      }
    `;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          variables: {
            holderAddress: address, // 注意小写地址格式
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`GraphQL 请求失败，状态码: ${response.status}`);
      }

      const res: any = await response.json();

      if (res.errors) {
        setError(res.errors.map((e: any) => e.message).join(', '));
        return;
      }

      const machineInfos = res.data.machineInfos;
      if (!machineInfos || machineInfos.length === 0) {
        setMachineData([]);
        return;
      }

      // 并发获取 Locked 数据
      const resultList = await Promise.all(
        machineInfos.map(async (item: any) => {
          const locked = await getLockedValue(item.machineId);

          return {
            machineId: item.machineId,
            isStaking: item.isStaking,
            online: item.online,
            region: item.region,
            registered: item.registered,
            totalCalcPoint: formatWithThousandSeparator(item.totalCalcPoint),
            totalCalcPointWithNFT: formatWithThousandSeparator(item.totalCalcPointWithNFT),
            fullTotalCalcPoint: formatWithThousandSeparator(item.fullTotalCalcPoint),
            totalReservedAmount: formatWithThousandSeparator(Number(formatEther(item.totalReservedAmount)).toFixed(2)),
            totalClaimedRewardAmount: formatWithThousandSeparator(
              Number(Number(formatEther(item.totalReleasedRewardAmount)) + Number(locked)).toFixed(2)
            ),
            totalReleasedRewardAmount: formatWithThousandSeparator(
              Number(formatEther(item.totalReleasedRewardAmount)).toFixed(2)
            ),
            Locked: formatWithThousandSeparator(locked),
          };
        })
      );

      // ✅ 所有数据 Promise 全部解析完后再设置到状态中
      setMachineData(resultList);
    } catch (error) {
      console.error('fetchMachineInfoData 出错:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 分页
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0); // 总条数
  const [pageSize, setPageSize] = useState(30); // 每页条数
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  // 搜索数据
  const { run } = useDebounceFn((v) => {
    fetchMachineInfoData(v);
  }, 500);
  // 获取总数
  const fetchMachineInfoData2 = async (walletAddress: string) => {
    try {
      setLoading(true);
      const endpoint = 'https://dbcswap.io/subgraph/name/bandwidth-staking-state';

      const query = `
        query($holderAddress: String!) {
          machineInfos(where: { holder: $holderAddress }) {
            id
            holder
            holderRef {
              id
              holder
            }
            machineId
          }
        }
      `;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: {
            holderAddress: walletAddress.toLowerCase(), // Ensure address is lowercase
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const res: any = await response.json();
      console.log(res, 'KKK222222');
      setTotalItems(res.data.machineInfos.length);
    } catch (error) {
      console.error('Error fetching GraphQL data:', error);
    }
  };

  // 初始化数据
  useEffect(() => {
    if (!isConnected) {
      toast({
        position: 'top',
        title: t('hint'),
        description: t('cpudbc_connect_wallet'),
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    } else {
      fetchMachineInfoData();
    }
  }, [currentPage, pageSize, isConnected]);

  useEffect(() => {
    if (isConnected) {
      fetchMachineInfoData2(address as string);
    }
  }, [isConnected]);

  return (
    <Card variant="subtle">
      <div className="flex flex-col gap-4">
        <CardHeader>
          <div className="flex flex-col w-full gap-4">
            <Heading size="md">{t('machine_List')}</Heading>
            <MymachineSearchTop
              currentPage={currentPage}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              searchH={(v) => {
                run(v);
              }}
            />
          </div>
        </CardHeader>
        <CardBody>
          <MymachineTable
            fetchMachineInfoData={fetchMachineInfoData}
            machineData={machineData}
            loading={loading}
            error={error}
          />
        </CardBody>
      </div>
    </Card>
  );
}

export default Index;
