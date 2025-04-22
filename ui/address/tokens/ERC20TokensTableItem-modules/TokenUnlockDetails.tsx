import { Box, Text, VStack, HStack } from '@chakra-ui/react';
import { FaCoins, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { formatEther } from 'viem';
import dayjs from 'dayjs';

// Motion 组件，用于动画效果
const MotionBox = motion(Box);

export default function TokenUnlockDetails({ unlockRounds }) {
  // 获取当前时间（秒级时间戳）
  const now = Math.floor(Date.now() / 1000);

  // 处理解锁数据
  const futureRounds = unlockRounds
    // 过滤未来解锁：unlockAt >= 当前时间
    .filter((round) => {
      const isFuture = Number(round.unlockAt) >= now;
      console.log(`unlockAt: ${round.unlockAt}, isFuture: ${isFuture}`); // 调试：检查原始 unlockAt 和过滤结果
      return isFuture;
    })
    // 映射数据：转换 lockedAmount 和 unlockAt
    .map((round) => ({
      amount: Number(formatEther(round.lockedAmount)), // Wei 转 Ether（如 11022000000000000000000000n → 11022）
      unlockTime: Number(round.unlockAt) * 1000, // 秒转毫秒，供 dayjs 格式化
    }))
    // 按 unlockTime 升序排序，确保最早解锁在最前
    .sort((a, b) => a.unlockTime - b.unlockTime);

  // 调试：检查转换后的数据（金额和格式化时间）
  console.log(
    'futureRounds:',
    futureRounds.map((r) => ({
      amount: r.amount.toFixed(5),
      unlockTime: dayjs(r.unlockTime).format('YYYY/MM/DD HH:mm:ss'),
    }))
  );

  // 下一笔解锁：最早的未来解锁
  const nextUnlock = futureRounds[0];
  // 待解锁：剩余未来解锁
  const pendingUnlocks = futureRounds.slice(1);

  return (
    <VStack align="start" spacing={2} p={2} bg="white" borderRadius="md" w="full">
      {/* 标题：解锁计划 */}
      <Text fontSize="md" fontWeight="medium" color="gray.800">
        解锁计划
      </Text>

      {/* 下一笔解锁 - 固定顶部显示 */}
      {nextUnlock && (
        <MotionBox
          initial={{ opacity: 0, y: 10 }} // 动画初始状态
          animate={{ opacity: 1, y: 0 }} // 动画目标状态
          transition={{ duration: 0.3 }} // 动画持续时间
          w="full"
          p={2}
          bg="blue.50" // 背景色
          borderRadius="sm"
        >
          <Text fontSize="sm" fontWeight="medium" color="blue.600">
            下一笔解锁时间
          </Text>
          <HStack spacing={2}>
            {/* 代币图标和数量 */}
            <FaCoins style={{ color: '#D69E2E', fontSize: '14px' }} />
            <Text fontSize="sm" color="gray.800">
              {nextUnlock.amount.toFixed(5)} DLC
            </Text>
            {/* 时间图标和格式化时间 */}
            <FaClock style={{ color: '#3182CE', fontSize: '14px' }} className={'ml-4'} />
            <Text fontSize="sm" color="gray.800">
              {dayjs(nextUnlock.unlockTime).format('YYYY/MM/DD HH:mm:ss')}
            </Text>
          </HStack>
        </MotionBox>
      )}

      {/* 可滚动区域 - 待解锁列表 */}
      <Box
        w="full"
        maxH="150px" // 最大高度，超出滚动
        overflowY="auto" // 垂直滚动
        bg="gray.50" // 背景色
        borderRadius="sm"
        p={2}
        css={{
          '&::-webkit-scrollbar': { width: '6px' }, // 滚动条宽度
          '&::-webkit-scrollbar-track': { background: 'transparent' }, // 滚动条轨道
          '&::-webkit-scrollbar-thumb': { background: '#E2E8F0', borderRadius: '3px' }, // 滚动条滑块
          '&::-webkit-scrollbar-thumb:hover': { background: '#CBD5E0' }, // 滑块悬停
        }}
      >
        {/* 待解锁列表 */}
        {pendingUnlocks.length > 0 && (
          <VStack align="start" spacing={1} w="full">
            <Text fontSize="sm" fontWeight="medium" color="gray.600">
              待解锁
            </Text>
            {pendingUnlocks.map((round, index) => (
              <HStack key={index} w="full" spacing={2}>
                <div className={'flex items-center gap-2 w-full mb-1'}>
                  {/* 代币数量 */}
                  <div className={'flex items-center gap-1 flex-1'}>
                    <FaCoins style={{ color: '#D69E2E', fontSize: '14px' }} />
                    <Text fontSize="sm" color="gray.700">
                      {round.amount.toFixed(5)} DLC
                    </Text>
                  </div>
                  {/* 解锁时间 */}
                  <div className={'flex items-center gap-1 flex-1'}>
                    <FaClock style={{ color: '#3182CE', fontSize: '14px' }} />
                    <Text fontSize="sm" color="gray.700">
                      {dayjs(round.unlockTime).format('YYYY/MM/DD HH:mm:ss')}
                    </Text>
                  </div>
                </div>
              </HStack>
            ))}
          </VStack>
        )}
      </Box>

      {/* 空状态：无未来解锁时显示 */}
      {!nextUnlock && !pendingUnlocks.length && (
        <Text fontSize="sm" color="gray.500">
          暂无解锁计划
        </Text>
      )}
    </VStack>
  );
}
