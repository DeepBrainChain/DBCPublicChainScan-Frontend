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
import UnstakeBtn from './modules/UnstakeBtn-btn-dialog';
import UnstakeDbc from './modules/UnstakeDbc';
import WithdrawBtn from './modules/WithdrawBtn-btn-dialog';
import { fetchMachineDataGpu } from './api/index';
import { IoCopy, IoCheckmark, IoCashOutline, IoLockClosedOutline } from 'react-icons/io5';
import { IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';
import { useAccount } from 'wagmi';
import { FaCoins } from 'react-icons/fa';
import { useTranslation } from 'next-i18next';

function Index() {
  const isMobile = useIsMobile();
  const [machineData, setMachineData] = useState<any[]>([]); // 存储请求数据
  const [loading, setLoading] = useState(true); // 加载状态
  const [error, setError] = useState<string | null>(null); // 错误状态
  const { address, isConnected } = useAccount();
  const { t } = useTranslation('common');
  // 重新渲染
  const [key, setKey] = useState(0);
  const fetchMachineDataH = async () => {
    setLoading(true);
    try {
      const res: any = await fetchMachineDataGpu(address);
      if (res.code === 1000) {
        console.log(res.data, '拿到数据了');
        setMachineData(res.data); // 设置数据
      } else {
        throw new Error('Invalid response code');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      fetchMachineDataH();
    }
  }, [key, address, isConnected]);

  // thead 数据
  const thead = [
    { t: t('machine_ID'), pcW: '100px', mobileW: '70px' }, // 机器ID
    { t: t('machine_Stake'), pcW: '60px', mobileW: '70px' }, // 是否在质押
    { t: t('machine_Reg'), pcW: '60px', mobileW: '60px' }, // 地区
    { t: t('machine_HDD'), pcW: '60px', mobileW: '70px' }, // 硬盘
    { t: t('machine_BW'), pcW: '60px', mobileW: '80px' }, // 带宽
    { t: t('machine_Mem'), pcW: '60px', mobileW: '50px' }, // 内存
    { t: t('machine_CPU'), pcW: '80px', mobileW: '60px' }, // CPU核数
    { t: t('machine_Proj'), pcW: '80px', mobileW: '100px' }, // 项目
    { t: t('machine_TotRwd'), pcW: '80px', mobileW: '65px' }, // 总奖励
    { t: t('machine_ClmRwd'), pcW: '80px', mobileW: '65px' }, // 已领取奖励
    { t: t('machine_LckRwd'), pcW: '80px', mobileW: '65px' }, // 锁仓奖励
    { t: t('machine_Act'), pcW: '', mobileW: '' }, // 操作
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
                        <Skeleton isLoaded={!loading}>
                          <div className="flex items-center gap-x-2">
                            <Text className="cursor-pointer truncate max-w-[80px]">{item.machineId || 'N/A'}</Text>
                            <CopyButton text={item.machineId || ''} />
                          </div>
                        </Skeleton>
                      </Tooltip>
                    </Td>
                    <Td>
                      <Skeleton isLoaded={!loading}>
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
                      </Skeleton>
                    </Td>
                    <Td>
                      <Skeleton isLoaded={!loading}>
                        <Tooltip label={`Region: ${item.region || 'N/A'}`}>
                          <Text className="truncate">{item.region || 'N/A'}</Text>
                        </Tooltip>
                      </Skeleton>
                    </Td>
                    <Td>
                      <Skeleton isLoaded={!loading}>
                        <Tooltip label={`HDD: ${item.hdd ?? '0'}`}>
                          <Text color="blue.500">{item.hdd ?? '0'}</Text>
                        </Tooltip>
                      </Skeleton>
                    </Td>
                    <Td>
                      <Skeleton isLoaded={!loading}>
                        <Tooltip label={`Bandwidth: ${item.bandwidth ?? '0'}`}>
                          <Text color="blue.500">{item.bandwidth ?? '0'}</Text>
                        </Tooltip>
                      </Skeleton>
                    </Td>
                    <Td>
                      <Tooltip label={`Memory size: ${item.mem ? `${item.mem}G` : '0G'}`}>
                        <Skeleton isLoaded={!loading}>
                          <Text color="blue.500">{item.mem ? `${item.mem}G` : '0G'}</Text>
                        </Skeleton>
                      </Tooltip>
                    </Td>
                    <Td>
                      <Skeleton isLoaded={!loading}>
                        <Tooltip label={`CPU cores: ${item.cpuCors ?? '0'}`}>
                          <Text color="blue.500">{item.cpuCors ?? '0'}</Text>
                        </Tooltip>
                      </Skeleton>
                    </Td>
                    <Td>
                      <Tooltip label={`Project name: ${item.projectName || 'N/A'}`}>
                        <Skeleton isLoaded={!loading}>
                          <Text className="truncate">{item.projectName || 'N/A'}</Text>
                        </Skeleton>
                      </Tooltip>
                    </Td>
                    <Td>
                      <Tooltip label={`Total Rewards: ${item.totalRewardAmount ?? '0.0'}`}>
                        <Skeleton isLoaded={!loading}>
                          <div className="flex items-center space-x-2 text-blue-600 font-semibold">
                            <FaCoins className="text-[#FFD700]" />
                            <Text className="truncate max-w-[50px]">{item.totalRewardAmount ?? '0.0'}</Text>
                          </div>
                        </Skeleton>
                      </Tooltip>
                    </Td>
                    <Td>
                      <Tooltip label={`Claimed Rewards: ${item.claimedRewardAmount ?? '0.0'}`}>
                        <Skeleton isLoaded={!loading}>
                          <div className="flex items-center space-x-2 text-blue-600 font-semibold">
                            <IoCashOutline size={20} className="text-green-500" />
                            <Text className="truncate max-w-[50px]">{item.claimedRewardAmount ?? '0.0'}</Text>
                          </div>
                        </Skeleton>
                      </Tooltip>
                    </Td>
                    <Td>
                      <Tooltip label={`Locked Rewards: ${item.lockedRewardAmount ?? '0.0'}`}>
                        <Skeleton isLoaded={!loading}>
                          <div className="flex items-center space-x-2 text-blue-600 font-semibold">
                            <IoLockClosedOutline size={20} className="text-gray-500" />
                            <Text className="truncate max-w-[50px]">{item.lockedRewardAmount ?? '0.0'}</Text>
                          </div>
                        </Skeleton>
                      </Tooltip>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-x-3">
                        <UnstakeBtn forceRerender={() => setKey((key) => key + 1)} id={item.machineId || ''} />
                        <UnstakeDbc forceRerender={() => setKey((key) => key + 1)} id={item.machineId || ''} />
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
