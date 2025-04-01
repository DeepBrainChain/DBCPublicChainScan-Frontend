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
  Link,
  HStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import useIsMobile from 'lib/hooks/useIsMobile';
import MymachineSearchTop from './modules/mymachine-search-top';
import WithdrawBtn from './modules/WithdrawBtn-btn-dialog';
import { IoCopy, IoCheckmark, IoCashOutline, IoLockClosedOutline } from 'react-icons/io5';
import { IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';
import { useAccount } from 'wagmi';
import { getEnvValue } from '../../configs/app/utils';
import { useTranslation } from 'next-i18next';
import { FaPiggyBank, FaLock, FaHandHoldingUsd } from 'react-icons/fa';

function Index() {
  const isMobile = useIsMobile();
  const [machineData, setMachineData] = useState([]); // 存储请求数据
  const [loading, setLoading] = useState(true); // 加载状态
  const [error, setError] = useState(null); // 错误状态
  const { address, isConnected } = useAccount();
  const { t } = useTranslation('common');

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
  const fetchGraphQLData = async () => {
    setLoading(true);
    const endpoint = getEnvValue('NEXT_PUBLIC_API_URLX') || 'https://dbcswap.io/subgraph/name/long-staking-state';
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
            machineInfos {
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
    setLoading(false);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const res: any = await response.json();
    if (res.errors) {
      throw new Error(res.errors.map((e: any) => e.message).join(', '));
    }
    if (res.data.stakeHolders.length !== 0) {
      console.log(res.data.stakeHolders[0].machineInfos, res);
      setMachineData(res.data.stakeHolders[0].machineInfos); // 设置数据
    } else {
      setMachineData([]); // 设置数据
    }
  };
  useEffect(() => {
    fetchGraphQLData();
  }, [key]);

  // thead 数据
  const thead = [
    { t: t('withdrawDialog_machineId'), pcW: '340px', mobileW: '70px' },
    { t: t('withdrawDialog_isStaking'), pcW: '100px', mobileW: '60px' },
    { t: t('stakeEndTime'), pcW: '170px', mobileW: '70px' },

    { t: t('withdrawDialog_totalRewards'), pcW: '140px', mobileW: '100px' },
    { t: t('withdrawDialog_claimedRewards'), pcW: '140px', mobileW: '65px' },
    { t: t('withdrawDialog_lockedRewards'), pcW: '140px', mobileW: '65px' },
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
            // v2: 1, // GPU 数量
            // v3: `${item.mem}G`, // 内存大小
            // v4: item.projectName, // 项目名字
            v5: item.totalReservedAmount, // 总奖励数量
            v6: item.totalClaimedRewardAmount, // 已领取奖励数量
            v7: item.totalReleasedRewardAmount, // 锁仓奖励数量
            v11: [WithdrawBtn], // 操作按钮
          };
        })
      : [];

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

  return (
    <Card variant="subtle">
      <CardHeader>
        <div className="flex flex-col w-full gap-4">
          <Heading size="md">{t('machine_List')}</Heading>
          <MymachineSearchTop />
        </div>
      </CardHeader>
      <CardBody gap="2">
        <TableContainer>
          <Table size="sm">
            <Thead>
              <Tr>
                {thead.map((item, index) => (
                  <Th width={isMobile ? item.mobileW : item.pcW} key={index}>
                    <Skeleton isLoaded={!loading}>{item.t}</Skeleton>
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {loading ? (
                <Tr>
                  <Td colSpan={thead.length}>
                    <Skeleton height="20px" />
                  </Td>
                </Tr>
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
                            <Text className="truncate max-w-[50px]" fontWeight="medium">
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
                            <Text className="truncate max-w-[50px]">{item.v6}</Text>
                          </div>
                        </Skeleton>
                      </Tooltip>
                    </Td>
                    <Td>
                      <Tooltip label={`${t('withdrawDialog_lockedRewards')}: ${item.v7}`}>
                        <Skeleton isLoaded={!loading}>
                          <div className="flex items-center space-x-2 text-blue-600 font-semibold">
                            <FaLock size={19} className="text-gray-500" />
                            <Text className="truncate max-w-[50px]">{item.v7}</Text>
                          </div>
                        </Skeleton>
                      </Tooltip>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-x-3">
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
