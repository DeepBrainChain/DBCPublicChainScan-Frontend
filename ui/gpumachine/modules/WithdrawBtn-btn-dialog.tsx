import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Button,
  useDisclosure,
  Skeleton,
} from '@chakra-ui/react';
import { useTimeoutFn } from '@reactuses/core';
import React from 'react';
import { useWriteContract, useAccount, useConfig } from 'wagmi';
import { waitForTransactionReceipt, readContract } from 'wagmi/actions';
import { useToast } from '@chakra-ui/react';
import stakingAbi from '../abi/stakeaib.json';
import { useTranslation } from 'next-i18next';
import { useContractAddress } from '../../../lib/hooks/useContractAddress';
import { formatEther } from 'viem';

function WithdrawBtn({ id, forceRerender }: { id: string; forceRerender: any }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isPending] = useTimeoutFn(() => {}, 2000, { immediate: true });
  const config = useConfig();
  const toast = useToast();
  const cancelRef = React.useRef(null);
  const { t } = useTranslation('common');
  const [btnData, setBtnData] = React.useState({
    isLoading: false,
    loadingText: '',
  });
  const { address, isConnected } = useAccount();
  const CPU_CONTRACT_ADDRESS_STAKING = useContractAddress('CPU_CONTRACT_ADDRESS_STAKING');

  // 待领取奖励质押合约实例
  const claim = useWriteContract();

  const getClaim = async () => {
    if (!isConnected) {
      toast({
        position: 'top',
        title: '提示',
        description: '请先连接你的钱包',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setBtnData({ isLoading: true, loadingText: 'Sending...' });
    const toastId = toast({
      position: 'top',
      title: '领取收益中',
      description: '正在处理您的领取收益请求，请稍候...',
      status: 'loading',
      duration: null,
      isClosable: false,
    });
    console.log(id, '机器id');
    try {
      // 开始领取收益
      const claimHash = await claim.writeContractAsync({
        address: CPU_CONTRACT_ADDRESS_STAKING,
        abi: stakingAbi,
        functionName: 'claim',
        args: [id],
      });
      const stakeReceipt = await waitForTransactionReceipt(config, { hash: claimHash });
      if (stakeReceipt.status !== 'success') {
        throw new Error('领取收益交易失败');
      }

      toast.update(toastId, {
        position: 'top',
        title: '成功',
        status: 'success',
        description: '领取收益成功！',
        duration: 5000,
        isClosable: true,
      });
      forceRerender();
      onClose();
    } catch (error: any) {
      toast.update(toastId, {
        position: 'top',
        title: '失败',
        status: 'error',
        description: error.message || '操作失败',
        isClosable: true,
        duration: 5000,
      });
    } finally {
      setBtnData({ isLoading: false, loadingText: '' });
    }
  };
  const [btn, setBtn] = React.useState({
    loading: false,
    data: '0',
  });
  // 定义读取函数
  async function getRewardInfoH(address: string) {
    try {
      const balance = await readContract(config, {
        address: CPU_CONTRACT_ADDRESS_STAKING,
        abi: stakingAbi,
        functionName: 'getRewardInfo',
        args: [address],
      });
      return balance;
    } catch (error) {
      console.error('读取合约失败:', error);
      throw error;
    }
  }
  const onOpenH = async () => {
    setBtn({
      loading: true,
      data: '0',
    });
    const res: any = await getRewardInfoH(id);
    setBtn({
      loading: false,
      data: formatEther(res[1]),
    });
    console.log(res, 'FFFFFFFFFFFFFFFFf');
    onOpen();
  };
  return (
    <>
      <Skeleton isLoaded={!isPending}>
        <Button isLoading={btn.loading} size="sm" variant="outline" onClick={onOpenH}>
          {t('machine_Withdraw')}
        </Button>
      </Skeleton>

      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent className="!max-w-[500px]">
          <AlertDialogHeader>Confirmation</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <div className="space-y-4 flex flex-col gap-4">
              <p>Are you sure you want to withdraw the earnings?</p>
              <div className=" rounded-lg">
                <p className="text-sm ">Pending Rewards</p>
                <p className="text-2xl font-bold text-green-600">{Number(btn.data).toFixed(2) || '0.00'}</p>
              </div>
            </div>
          </AlertDialogBody>
          <AlertDialogFooter>
            <div className="flex items-center gap-6">
              <Button colorScheme="blackAlpha" ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button isLoading={btnData.isLoading} loadingText={btnData.loadingText} onClick={getClaim}>
                Confirm
              </Button>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default WithdrawBtn;
