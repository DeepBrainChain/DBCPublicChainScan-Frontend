import {
  Card,
  CardBody,
  Table,
  Thead,
  Tbody,
  Text,
  Tr,
  Th,
  Td,
  Tooltip,
  TableContainer,
  CardHeader,
  Heading,
  Skeleton,
  Button,
  useToast,
  HStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import useIsMobile from 'lib/hooks/useIsMobile';
import MymachineSearchTop from './modules/mymachine-search-top';
import WithdrawBtn from './modules/WithdrawBtn-btn-dialog';
import AddNft from './modules/AddNft-btn-dialog';
import { IoCopy, IoCheckmark } from 'react-icons/io5';
import { IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';
import { useAccount } from 'wagmi';
import { getEnvValue } from '../../configs/app/utils';
import { useTranslation } from 'next-i18next';
import { FaPiggyBank, FaLock, FaHandHoldingUsd } from 'react-icons/fa';
import { useDebounceFn } from '@reactuses/core';

function Index() {
  const isMobile = useIsMobile();
  const [machineData, setMachineData] = useState([]); // 存储请求数据
  const [loading, setLoading] = useState(true); // 加载状态
  const [error, setError] = useState(null); // 错误状态
  const { address, isConnected } = useAccount();
  const { t } = useTranslation('common');
  const toast = useToast();

  // 重新渲染
  const [key, setKey] = useState(0);

  // 格式化时间
  function formatStakeEndTime(isoString: string) {
    const date = new Date(isoString);
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  //  获取当前钱包下的列表数据
  const fetchGraphQLData = async (currentPage, pageSize, v = '') => {
    setLoading(true);
    const machineIdFilter = v ? `, where: { machineId: "${v}" }` : '';

    const skip = v ? 0 : (currentPage - 1) * pageSize; // 搜索时忽略 skip
    const fetchSize = v ? 1000 : pageSize; // 搜索时获取更多数据
    const endpoint = 'https://dbcswap.io/subgraph/name/long-staking-state';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
        query {
          stateSummaries(first: 1) {
            totalCalcPoint
          }
          stakeHolders(where: {
            holder: "${address}"
          }) {
            holder
            totalClaimedRewardAmount
            totalReleasedRewardAmount
            machineInfos(first: ${fetchSize}, skip: ${skip}${machineIdFilter}) {
              machineId
              totalCalcPoint
              fullTotalCalcPoint
              isStaking
              stakeEndTime
              totalReservedAmount
              totalClaimedRewardAmount
              totalReleasedRewardAmount
            }
          }
        }
      `,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const res: any = await response.json();
    console.log(res, 'resresresresres');
    if (res.data?.stakeHolders.length !== 0) {
      console.log(res.data.stakeHolders[0].machineInfos, res);
      setMachineData(res.data.stakeHolders[0].machineInfos); // 设置数据
    } else {
      setMachineData([]); // 设置数据
    }
    setLoading(false);
  };

  // thead 数据
  const thead = [
    { t: t('withdrawDialog_machineId'), pcW: '300px' },

    { t: t('withdrawDialog_isStaking'), pcW: '100px' },
    { t: t('stakeEndTime'), pcW: '170px' },

    { t: t('withdrawDialog_totalRewards'), pcW: '150px' },
    { t: t('withdrawDialog_claimedRewards'), pcW: '150px' },
    { t: t('withdrawDialog_lockedRewards'), pcW: '150px' },
    { t: t('withdrawDialog_action') },
  ];

  // 从 machineData 映射到表格数据
  const tableBodyData =
    machineData.length > 0
      ? machineData.map((item: any) => {
          return {
            machineId: item.machineId, //机器ID
            v0: item.isStaking, // 是否在质押
            v1: formatStakeEndTime(item.stakeEndTime), // 质押结束时间
            v5: item.totalReservedAmount, // 总奖励数量
            v6: item.totalClaimedRewardAmount, // 已领取奖励数量
            v7: item.totalReleasedRewardAmount, // 锁仓奖励数量
            v11: [WithdrawBtn, AddNft], // 操作按钮
          };
        })
      : [];

  // 复制组件
  const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2秒后恢复

      // 复制逻辑（假设要复制 "Hello, World!"）
      navigator.clipboard.writeText(text).catch((err) => {
        console.error('复制失败:', err);
      });
    };

    return (
      <span className="cursor-pointer" onClick={handleCopy}>
        {copied ? <IoCheckmark size={18} className="text-green-600" /> : <IoCopy size={18} />}
      </span>
    );
  };

  // 分页
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0); // 总条数
  const [pageSize, setPageSize] = useState(30); // 每页条数
  //计算总页数
  const fetchGraphQLData2 = async () => {
    setLoading(true);

    const endpoint = 'https://dbcswap.io/subgraph/name/long-staking-state';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
        query {
          stateSummaries(first: 1) {
            totalCalcPoint
          }
          stakeHolders(where: {
            holder: "${address}"
          }) {
            holder
            totalClaimedRewardAmount
            totalReleasedRewardAmount
            machineInfos(first: 1000) {
             machineId
            }
          }
        }
      `,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const res: any = await response.json();
    console.log(res, 'resresresresres2222222222222');
    if (res.data.stakeHolders.length !== 0) {
      console.log(res.data.stakeHolders[0].machineInfos.length);
      setTotalItems(res.data.stakeHolders[0].machineInfos.length); // 设置数据
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
      fetchGraphQLData(currentPage, pageSize);
      fetchGraphQLData2();
    }
  }, [key, isConnected]);

  useEffect(() => {
    if (isConnected) {
      fetchGraphQLData(currentPage, pageSize);
    }
  }, [currentPage, pageSize, isConnected]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 加载中组件
  const SkeletonTable = () => {
    return (
      <Tr className="!w-auto">
        <Td colSpan={thead.length}>
          <div className=" flex flex-col gap-3 !w-full">
            <Skeleton height="30px" className="!w-auto" />
            <Skeleton height="30px" className="!w-auto" />
            <Skeleton height="30px" className="!w-auto" />
            <Skeleton height="30px" className="!w-auto" />
            <Skeleton height="30px" className="!w-auto" />
            <Skeleton height="30px" className="!w-auto" />
            <Skeleton height="30px" className="!w-auto" />
            <Skeleton height="30px" className="!w-auto" />
            <Skeleton height="30px" className="!w-auto" />
          </div>
        </Td>
      </Tr>
    );
  };
  // 搜索数据
  const { run } = useDebounceFn((v) => {
    fetchGraphQLData(currentPage, pageSize, v);
  }, 500);

  return (
    <Card variant="subtle" gap={3}>
      <CardHeader className="!p-0">
        <div className="flex flex-col w-full gap-y-4">
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
      <CardBody className="!p-0">
        <TableContainer className="!overflow-x-scroll">
          <Table size="sm" className={isMobile ? '!w-auto' : ''}>
            <Thead>
              <Tr>
                {thead.map((item, index) => (
                  <Th width={item.pcW} key={index}>
                    <Skeleton isLoaded={!loading}>{item.t}</Skeleton>
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {loading ? (
                <SkeletonTable />
              ) : error ? (
                <Tr>
                  <Td colSpan={thead.length}>Error: {error}</Td>
                </Tr>
              ) : tableBodyData.length === 0 ? ( // 添加空数据判断
                <Tr>
                  <Td colSpan={thead.length}>
                    <Text textAlign="center" color="gray.500">
                      No data available
                    </Text>
                  </Td>
                </Tr>
              ) : (
                tableBodyData.map((item, index) => (
                  <Tr key={index}>
                    <Td>
                      <Tooltip label={`${t('withdrawDialog_machineId')}: ${item.machineId}`}>
                        <Skeleton isLoaded={!loading}>
                          <div className="flex items-center gap-x-2">
                            <Text className="cursor-pointer truncate">{item.machineId}</Text>
                            <CopyButton text={item.machineId} />
                          </div>
                        </Skeleton>
                      </Tooltip>
                    </Td>
                    <Td>
                      <Skeleton isLoaded={!loading}>
                        <div className="flex items-center space-x-2">
                          {item.v0 ? (
                            <>
                              <IoCheckmarkCircle size={21} className="text-green-500" />
                              <span className="text-green-600 font-medium">Yes</span>
                            </>
                          ) : (
                            <>
                              <IoCloseCircle size={21} className="text-red-500" />
                              <span className="text-red-600 font-medium">No</span>
                            </>
                          )}
                        </div>
                      </Skeleton>
                    </Td>

                    <Td>
                      <Skeleton isLoaded={!loading}>
                        <Tooltip label={`${t('stakeEndTime')}: ${item.v1}`}>
                          <Text className="truncate">{item.v1}</Text>
                        </Tooltip>
                      </Skeleton>
                    </Td>

                    <Td>
                      <Tooltip
                        label={`${t('withdrawDialog_totalRewards')}: ${item.v5}`}
                        hasArrow
                        placement="top"
                        bg="gray.700"
                        color="white"
                        borderRadius="md"
                      >
                        <Skeleton isLoaded={!loading}>
                          <HStack spacing={2}>
                            <FaPiggyBank size={19} className="text-[#FFD700]" />
                            <Text className="truncate stakingLongAbi" fontWeight="medium">
                              {item.v5}
                            </Text>
                          </HStack>
                        </Skeleton>
                      </Tooltip>
                    </Td>
                    <Td>
                      <Tooltip label={`${t('withdrawDialog_claimedRewards')}: ${item.v6}`}>
                        <Skeleton isLoaded={!loading}>
                          <div className="flex items-center space-x-2 text-blue-600 font-semibold">
                            <FaHandHoldingUsd size={19} className="text-green-500" />
                            <Text className="truncate stakingLongAbi">{item.v6}</Text>
                          </div>
                        </Skeleton>
                      </Tooltip>
                    </Td>
                    <Td>
                      <Tooltip label={`${t('withdrawDialog_lockedRewards')}: ${item.v7}`}>
                        <Skeleton isLoaded={!loading}>
                          <div className="flex items-center space-x-2 text-blue-600 font-semibold">
                            <FaLock size={19} className="text-gray-500" />
                            <Text className="truncate stakingLongAbi">{item.v7}</Text>
                          </div>
                        </Skeleton>
                      </Tooltip>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-x-3 w-full">
                        {item.v11.map((ItemComponent, index3) => (
                          <ItemComponent
                            forceRerender={() => setKey((key) => key + 1)}
                            id={item.machineId}
                            key={index3}
                          />
                        ))}
                      </div>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
}

export default Index;
