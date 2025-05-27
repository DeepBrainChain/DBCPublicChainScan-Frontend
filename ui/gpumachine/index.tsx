import { Card, CardBody, CardHeader, Heading, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import MymachineSearchTop from './modules/mymachine-search-top';
import { useTranslation } from 'next-i18next';
import MymachineTable from './modules/MymachineTable';
import { useDebounceFn } from '@reactuses/core';
import { formatEther } from 'viem';
import { useAccount } from 'wagmi';

function Index() {
  const { t } = useTranslation('common');
  const [loading, setLoading] = useState(true); // 加载状态
  const [error, setError] = useState<string | null>(null); // 错误状态
  const [machineData, setMachineData] = useState<any[]>([]); // 存储请求数据
  const { address, isConnected } = useAccount();
  const toast = useToast();
  //  获取当前钱包下的列表数据
  const fetchMachineInfoData = async (v = '') => {
    try {
      setLoading(true);
      const endpoint = 'https://dbcswap.io/subgraph/name/bandwidth-staking-state';
      // 动态构建 where 条件
      const whereClause = {
        holder: '$holderAddress',
        ...(v && { machineId: `"${v}"` }), // 当 v 不为空时添加 machineId 过滤
      };

      const skip = v ? 0 : (currentPage - 1) * pageSize; // 搜索时忽略 skip
      const fetchSize = v ? 1000 : pageSize; // 搜索时获取更多数据
      const query = `
        query($holderAddress: String!) {
          machineInfos(where: { ${Object.entries(whereClause)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ')} },first: ${fetchSize}, skip: ${skip}) {
            id
            holder
            holderRef {
              id
              holder
            }
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: {
            holderAddress: address, // Ensure address is lowercase
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const res: any = await response.json();
      console.log(res, 'KKK');
      if (res.errors) {
        setError(res.errors.map((e: any) => e.message).join(', '));
      }

      if (res.data.machineInfos.length > 0) {
        let arr: any = [];
        arr = res.data.machineInfos.map((item) => {
          return {
            machineId: item.machineId,
            isStaking: item.isStaking,
            online: item.online,
            region: item.region,
            registered: item.registered,
            totalCalcPoint: item.totalCalcPoint,
            totalCalcPointWithNFT: item.totalCalcPointWithNFT,
            fullTotalCalcPoint: item.fullTotalCalcPoint,
            totalReservedAmount: Number(formatEther(item.totalReservedAmount)).toFixed(5),
            totalClaimedRewardAmount: Number(formatEther(item.totalClaimedRewardAmount)).toFixed(5),
            totalReleasedRewardAmount: Number(formatEther(item.totalReleasedRewardAmount)).toFixed(5),
            Locked: (
              Number(formatEther(item.totalClaimedRewardAmount)) - Number(formatEther(item.totalReleasedRewardAmount))
            ).toFixed(5),
          };
        });
        setMachineData(arr); // Return all matching MachineInfo records
        console.log(machineData, 'machineDatamachineData');
      } else {
        setMachineData([]); // No machines found for this address
      }
    } catch (error) {
      console.error('Error fetching GraphQL data:', error);
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
