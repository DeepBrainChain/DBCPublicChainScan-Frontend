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
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import useIsMobile from 'lib/hooks/useIsMobile';
import MymachineSearchTop from './modules/mymachine-search-top';
import UnstakeBtn from './modules/UnstakeBtn-btn-dialog';
import UnstakeDbc from './modules/UnstakeDbc';
import WithdrawBtn from './modules/WithdrawBtn-btn-dialog';
import { IoCopy, IoCheckmark, IoLockClosedOutline } from 'react-icons/io5';
import { IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';
import { useAccount } from 'wagmi';
import { FaLock, FaCheckCircle, FaUnlock, FaLockOpen, FaGift } from 'react-icons/fa';
import { useTranslation } from 'next-i18next';
import { formatEther } from 'viem';

function Index() {
  const isMobile = useIsMobile();
  const [machineData, setMachineData] = useState<any[]>([]); // 存储请求数据
  const [loading, setLoading] = useState(false); // 加载状态
  const [error, setError] = useState<string | null>(null); // 错误状态
  const { address, isConnected } = useAccount();
  const { t } = useTranslation('common');
  // 重新渲染
  const [key, setKey] = useState(0);
  const toast = useToast();

  //  获取当前钱包下的列表数据
  const fetchMachineInfoData = async (walletAddress: string) => {
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
            holderAddress: walletAddress.toLowerCase(), // Ensure address is lowercase
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
      fetchMachineInfoData(address as string);
    }
  }, [key, isConnected]);

  // thead 数据
  const thead = [
    { t: t('machine_ID'), pcW: '100px' }, // 机器ID
    { t: t('machine_Stake'), pcW: '75px' }, // 是否在质押
    { t: t('deep_is_online'), pcW: '75px' }, //是否在线
    { t: t('deep_region'), pcW: '80px' }, //是否在线
    { t: t('deep_initial_computing_power'), pcW: '70px' }, //初始算力
    { t: t('deep_nft_computing_power'), pcW: '70px' }, //NFT算力
    { t: t('deep_total_computing_power'), pcW: '70px' }, //总算力
    { t: t('deep_total_amount'), pcW: '120px' }, //总金额
    { t: t('deep_claimed_amount'), pcW: '120px' }, //已领取金额
    { t: t('deep_released_amount'), pcW: '120px' }, //已释放金额
    { t: t('machine_LckRwd'), pcW: '120px' }, // 锁仓奖励
    { t: t('machine_Act'), pcW: '' }, // 操作
  ];

  // 复制按钮组件
  const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      setCopied(true);
      navigator.clipboard.writeText(text || '').catch((err) => {
        console.error('复制失败:', err);
      });
      setTimeout(() => setCopied(false), 2000); // 2秒后恢复
    };

    return (
      <span className="cursor-pointer" onClick={handleCopy}>
        {copied ? <IoCheckmark size={18} className="text-green-600" /> : <IoCopy size={18} />}
      </span>
    );
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

  return (
    <Card variant="subtle">
      <CardHeader>
        <div className="flex flex-col w-full gap-4">
          <Heading size="md">{t('machine_List')}</Heading>
          <MymachineSearchTop />
        </div>
      </CardHeader>
      <CardBody gap="2">
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
              ) : machineData.length === 0 ? (
                <Tr>
                  <Td colSpan={thead.length}>
                    <Text textAlign="center" color="gray.500">
                      No data available
                    </Text>
                  </Td>
                </Tr>
              ) : (
                machineData.map((item, index) => (
                  <Tr key={index}>
                    <Td>
                      <Tooltip label={`Machine ID: ${item.machineId || 'N/A'}`}>
                        <div className="flex items-center gap-x-2">
                          <Text className="cursor-pointer truncate max-w-[80px]">{item.machineId || 'N/A'}</Text>
                          <CopyButton text={item.machineId || ''} />
                        </div>
                      </Tooltip>
                    </Td>
                    <Td>
                      <div className="flex items-center space-x-2">
                        {item.isStaking === true ? (
                          <>
                            <IoCheckmarkCircle size={20} className="text-green-500" />
                            <span className="text-green-600 font-medium">Yes</span>
                          </>
                        ) : (
                          <>
                            <IoCloseCircle size={20} className="text-red-500" />
                            <span className="text-red-600 font-medium">No</span>
                          </>
                        )}
                      </div>
                    </Td>
                    <Td>
                      <div className="flex items-center space-x-2">
                        {item.online === true ? (
                          <>
                            <IoCheckmarkCircle size={20} className="text-green-500" />
                            <span className="text-green-600 font-medium">Yes</span>
                          </>
                        ) : (
                          <>
                            <IoCloseCircle size={20} className="text-red-500" />
                            <span className="text-red-600 font-medium">No</span>
                          </>
                        )}
                      </div>
                    </Td>
                    <Td>
                      <Tooltip label={`${t('deep_region')}: ${item.region}`}>
                        <Text color="blue.500" className="!whitespace-normal">
                          {item.region}
                        </Text>
                      </Tooltip>
                    </Td>
                    <Td>
                      <Tooltip label={`${t('deep_total_machine_base_power')}: ${item.totalCalcPoint}`}>
                        <Text color="blue.500">{item.totalCalcPoint}</Text>
                      </Tooltip>
                    </Td>
                    <Td>
                      <Tooltip label={`${t('deep_total_machine_power_with_nft')}: ${item.totalCalcPointWithNFT}`}>
                        <Text color="blue.500">{item.totalCalcPointWithNFT}</Text>
                      </Tooltip>
                    </Td>
                    <Td>
                      <Tooltip label={`${t('deep_total_machine_power_with_nft_rental')}: ${item.fullTotalCalcPoint}`}>
                        <Text color="blue.500">{item.fullTotalCalcPoint}</Text>
                      </Tooltip>
                    </Td>
                    <Td>
                      <Tooltip label={`${t('deep_total_staked_amount')}: ${item.totalReservedAmount} DLC`}>
                        <div className="flex items-center space-x-2 text-blue-600 ">
                          <FaLock size={16} className="text-[#FFD700] " />
                          <Text color="blue.500" className="truncate ">
                            {item.totalReservedAmount}
                          </Text>
                        </div>
                      </Tooltip>
                    </Td>

                    <Td>
                      <Tooltip label={`${t('deep_total_claimed_reward_amount')}: ${item.totalClaimedRewardAmount} DLC`}>
                        <div className="flex items-center space-x-2 text-blue-600 ">
                          <FaCheckCircle size={22} className="text-[#FFD700]" />
                          <Text className="truncate ">{item.totalClaimedRewardAmount}</Text>
                        </div>
                      </Tooltip>
                    </Td>
                    <Td>
                      <Tooltip
                        label={`${t('deep_total_released_reward_amount')}: ${item.totalReleasedRewardAmount} DLC`}
                      >
                        <div className="flex items-center space-x-2 text-blue-600 ">
                          <FaUnlock size={17} className="text-green-500" />
                          <Text className="truncate ">{item.totalReleasedRewardAmount}</Text>
                        </div>
                      </Tooltip>
                    </Td>
                    <Td>
                      <Tooltip label={`${t('deep_locked_reward')}: ${item.Locked} DLC`}>
                        <div className="flex items-center space-x-2 text-blue-600 ">
                          <IoLockClosedOutline size={25} className="text-gray-500" />
                          <Text className="truncate ">{item.Locked}</Text>
                        </div>
                      </Tooltip>
                    </Td>
                    <Td>
                      <div className="flex items-start gap-3 flex-col">
                        <UnstakeDbc forceRerender={() => setKey((key) => key + 1)} id={item.machineId || ''} />
                        <UnstakeBtn forceRerender={() => setKey((key) => key + 1)} id={item.machineId || ''} />
                        <WithdrawBtn forceRerender={() => setKey((key) => key + 1)} id={item.machineId || ''} />
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
