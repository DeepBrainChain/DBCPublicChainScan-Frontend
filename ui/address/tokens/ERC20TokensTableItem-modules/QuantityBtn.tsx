import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Button,
  useDisclosure,
  Skeleton, // 新增 Skeleton 组件
  useToast, // 新增 SkeletonText 组件
} from '@chakra-ui/react';
import { FaCoins, FaLock, FaUnlock, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useContractAddress } from '../../../../lib/hooks/useContractAddress';
import tokenAbi from './abi/tokenAbi.json';
import { readContract } from 'wagmi/actions';
import { useWriteContract, useAccount, useConfig } from 'wagmi';
import { formatEther } from 'viem';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

// 0x6f8F70C74FE7d7a61C8EAC0f35A4Ba39a51E1BEe
// 定义动画组件
const MotionDiv = motion.div;

function QuantityBtn() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef(null);
  const TOKEN_CONTRACT_ADDRESS = useContractAddress('TOKEN_CONTRACT_ADDRESS');
  const config = useConfig();
  const [loading, setLoading] = useState(false);
  const { address, isConnected } = useAccount();
  const toast = useToast();
  const { t } = useTranslation('common');
  const router = useRouter();

  // 模拟的余额数据
  const [balanceData, setBalanceData] = useState({
    totalAmount: 0.0, // 总额数量
    availableTokens: 0.0, // 可用代币数量
    lockedTokens: 0.0, // 已锁定代币数量
    estimatedUnlockTime: '2025-07-20T14:30:00', // 预计解锁时间
  } as any);

  function getNextUnlockTime(lockedData) {
    // 获取当前时间（Unix 时间戳，秒）
    const now = Math.floor(Date.now() / 1000);

    // 过滤尚未解锁的记录（unlockAt > 当前时间）
    const pendingUnlocks = lockedData.filter((item) => Number(item.unlockAt) > now);

    // 如果有待解锁记录，找到最早的解锁时间
    if (pendingUnlocks.length > 0) {
      const earliestUnlock = pendingUnlocks.reduce((min, item) => {
        return item.unlockAt < min ? item.unlockAt : min;
      }, pendingUnlocks[0].unlockAt);

      // 计算时间差（秒）
      const timeDiff = Number(earliestUnlock) - now;

      // 转换为小时、分钟、秒
      const hours = Math.floor(timeDiff / 3600);
      const minutes = Math.floor((timeDiff % 3600) / 60);
      const seconds = timeDiff % 60;

      // 构造倒计时字符串
      const parts: any = [];
      if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
      if (minutes > 0 || hours > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
      parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);

      return parts.join(', ');
    }

    // 无待解锁记录
    return 'No pending unlocks';
  }
  // 定义读取函数读取代币数据
  async function getRewardInfoH(address: string) {
    setLoading(true);
    try {
      const balance: any = await readContract(config, {
        address: TOKEN_CONTRACT_ADDRESS,
        abi: tokenAbi,
        functionName: 'getAvailableAmount',
        args: [address],
      });
      const rs = await getRewardInfoH2(address);
      setLoading(false);

      if (rs.length !== 0) {
        const nextUnlockTime = getNextUnlockTime(rs);
        console.log(nextUnlockTime, 'nextUnlockTimenextUnlockTime');
        setBalanceData({
          totalAmount: Number(formatEther(balance[0])).toFixed(5), // 总额数量
          availableTokens: Number(formatEther(balance[1])).toFixed(5), // 可用代币数量
          lockedTokens: (Number(formatEther(balance[0])) - Number(formatEther(balance[1]))).toFixed(5), // 已锁定代币数量
          estimatedUnlockTime: `${t('deep_estimated_unlock_time')}：${nextUnlockTime} ${t('deep_after_unlock')}`, // 预计解锁时间
        });
      }

      console.log(balance, 'balancebalance');
    } catch (error) {
      console.error('读取合约失败:', error);
      setLoading(false); // 错误时也要关闭加载状态
      throw error;
    }
  }

  // 定义读取函数读取解锁数据
  async function getRewardInfoH2(address: string) {
    try {
      const balance: any = await readContract(config, {
        address: TOKEN_CONTRACT_ADDRESS,
        abi: tokenAbi,
        functionName: 'getLockInfos',
        args: [address],
      });

      console.log(balance, '2222222222');
      return balance;
    } catch (error) {
      console.error('读取合约失败:', error);
      throw error;
    }
  }

  // 初始化
  React.useEffect(() => {
    if (isOpen) {
      const { hash } = router.query; // 获取动态参数 hash
      console.log(hash, 'hashhashhashhash');
      // 仅在弹窗打开时调用
      getRewardInfoH(hash as string);
    }
  }, [isOpen]); // 依赖 isOpen，当弹窗状态变化时重新执行

  return (
    <>
      <Button size={'xs'} border={0} onClick={onOpen} variant="outline">
        {t('deep_view_details')}
      </Button>

      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay className="bg-black/50" />

        <AlertDialogContent
          className="bg-white dark:bg-gray-800 rounded-xl !max-w-[520px]"
          as={MotionDiv}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* 优化后的标题 */}
          <AlertDialogHeader className="text-lg text-left font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 py-3">
            {t('deep_balance_details')}
          </AlertDialogHeader>
          <AlertDialogCloseButton className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100" />

          <AlertDialogBody className="p-6">
            {loading ? (
              // 骨架屏显示
              <div className="space-y-4">
                <Skeleton height="40px" borderRadius="md" />
                <Skeleton height="40px" borderRadius="md" />
                <Skeleton height="40px" borderRadius="md" />
                <Skeleton height="40px" borderRadius="md" />
              </div>
            ) : (
              // 正常内容
              <div className="space-y-4">
                {/* 总额数量 */}
                <MotionDiv
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-3"
                >
                  <FaCoins className="text-yellow-500 text-lg" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('deep_total_token_amount')}</p>
                    <p className="text-lg font-medium text-gray-800 dark:text-gray-100">
                      {balanceData.totalAmount} DBC
                    </p>
                  </div>
                </MotionDiv>

                {/* 可用代币数量 */}
                <MotionDiv
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3"
                >
                  <FaUnlock className="text-green-500 text-lg" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('deep_available_token_amount')}</p>
                    <p className="text-lg font-medium text-gray-800 dark:text-gray-100">
                      {balanceData.availableTokens} DBC
                    </p>
                  </div>
                </MotionDiv>

                {/* 已锁定代币数量 */}
                <MotionDiv
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-3"
                >
                  <FaLock className="text-red-500 text-lg" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('deep_locked_token_amount')}</p>
                    <p className="text-lg font-medium text-gray-800 dark:text-gray-100">
                      {balanceData.lockedTokens} DBC
                    </p>
                  </div>
                </MotionDiv>

                {/* 预计解锁时间 */}
                <MotionDiv
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <FaClock className="text-blue-500 text-lg" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('deep_next_estimated_unlock_time')}</p>
                    <p className="text-base font-medium text-gray-800 dark:text-gray-100">
                      {balanceData.estimatedUnlockTime}
                    </p>
                  </div>
                </MotionDiv>
              </div>
            )}
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default QuantityBtn;
