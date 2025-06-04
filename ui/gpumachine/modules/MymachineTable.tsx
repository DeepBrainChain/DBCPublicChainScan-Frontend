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
  Skeleton,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import useIsMobile from 'lib/hooks/useIsMobile';
import UnstakeBtn from '../modules/UnstakeBtn-btn-dialog';
import UnstakeDbc from '../modules/UnstakeDbc';
import WithdrawBtn from '../modules/WithdrawBtn-btn-dialog';
import { IoCopy, IoCheckmark, IoLockClosedOutline } from 'react-icons/io5';
import { IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';
import { useAccount } from 'wagmi';
import { FaLock, FaCheckCircle, FaUnlock, FaLockOpen, FaGift } from 'react-icons/fa';
import { useTranslation } from 'next-i18next';
import { formatEther } from 'viem';

function MymachineTable({ fetchMachineInfoData, machineData, loading, error }) {
  const isMobile = useIsMobile();
  const { address, isConnected } = useAccount();
  const { t } = useTranslation('common');
  const toast = useToast();

  // thead 数据
  const thead = [
    { t: t('machine_ID'), pcW: '100px' }, // 机器ID
    { t: t('machine_Stake'), pcW: '75px' }, // 是否在质押
    { t: t('deep_is_online'), pcW: '75px' }, //是否在线
    { t: t('deep_region'), pcW: '80px' }, //是否在线
    { t: t('deep_initial_computing_power'), pcW: '70px' }, //初始算力
    { t: t('deep_nft_computing_power'), pcW: '70px' }, //NFT算力
    { t: t('deep_total_computing_power'), pcW: '70px' }, //总算力
    { t: t('staking_amount'), pcW: '120px' }, //质押金额
    { t: t('total_rewards'), pcW: '120px' }, //总奖励
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
    <div>
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
                          <IoCheckmarkCircle size={17} className="text-green-500" />
                          <span className="text-green-600 font-medium">Yes</span>
                        </>
                      ) : (
                        <>
                          <IoCloseCircle size={17} className="text-red-500" />
                          <span className="text-red-600 font-medium">No</span>
                        </>
                      )}
                    </div>
                  </Td>
                  <Td>
                    <div className="flex items-center space-x-2">
                      {item.online === true ? (
                        <>
                          <IoCheckmarkCircle size={17} className="text-green-500" />
                          <span className="text-green-600 font-medium">Yes</span>
                        </>
                      ) : (
                        <>
                          <IoCloseCircle size={17} className="text-red-500" />
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
                        <FaLock size={17} className="text-[#FFD700] " />
                        <Text color="blue.500" className="truncate ">
                          {item.totalReservedAmount}
                        </Text>
                      </div>
                    </Tooltip>
                  </Td>

                  <Td>
                    <Tooltip label={`${t('deep_total_claimed_reward_amount')}: ${item.totalClaimedRewardAmount} DLC`}>
                      <div className="flex items-center space-x-1 text-blue-600 ">
                        <FaCheckCircle size={17} className="text-[#FFD700]" />
                        <Text className="truncate ">{item.totalClaimedRewardAmount}</Text>
                      </div>
                    </Tooltip>
                  </Td>
                  <Td>
                    <Tooltip label={`${t('deep_total_released_reward_amount')}: ${item.totalReleasedRewardAmount} DLC`}>
                      <div className="flex items-center space-x-1 text-blue-600 ">
                        <FaUnlock size={17} className="text-green-500" />
                        <Text className="truncate ">{item.totalReleasedRewardAmount}</Text>
                      </div>
                    </Tooltip>
                  </Td>
                  <Td>
                    <Tooltip label={`${t('deep_locked_reward')}: ${item.Locked} DLC`}>
                      <div className="flex items-center space-x-1 text-blue-600 ">
                        <IoLockClosedOutline size={17} className="text-gray-500" />
                        <Text className="truncate ">{item.Locked}</Text>
                      </div>
                    </Tooltip>
                  </Td>
                  <Td>
                    <div className="flex items-start gap-3 flex-col">
                      <UnstakeDbc fetchMachineInfoData={fetchMachineInfoData} id={item.machineId || ''} />
                      <UnstakeBtn fetchMachineInfoData={fetchMachineInfoData} id={item.machineId || ''} />
                      <WithdrawBtn fetchMachineInfoData={fetchMachineInfoData} id={item.machineId || ''} />
                    </div>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default MymachineTable;
