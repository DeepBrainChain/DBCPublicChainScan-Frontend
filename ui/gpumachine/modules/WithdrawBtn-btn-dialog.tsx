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
import { waitForTransactionReceipt, readContract, estimateGas, getFeeHistory, getWalletClient } from 'wagmi/actions';
import { useToast } from '@chakra-ui/react';
import stakingAbi from '../abi/stakeaib.json';
import { useTranslation } from 'next-i18next';
import { useContractAddress } from '../../../lib/hooks/useContractAddress';
import { formatEther } from 'viem';
import { parseUnits } from 'viem/utils';
import { ethers, Contract } from 'ethers';

function WithdrawBtn({ fetchMachineInfoData, id }: { fetchMachineInfoData: any; id: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  // const getClaim = async () => {
  //   if (!isConnected) {
  //     toast({
  //       position: 'top',
  //       title: '提示',
  //       description: '请先连接你的钱包',
  //       status: 'warning',
  //       duration: 5000,
  //       isClosable: true,
  //     });
  //     return;
  //   }
  //   setBtnData({ isLoading: true, loadingText: 'Sending...' });
  //   const toastId = toast({
  //     position: 'top',
  //     title: '领取收益中',
  //     description: '正在处理您的领取收益请求，请稍候...',
  //     status: 'loading',
  //     duration: null,
  //     isClosable: false,
  //   });
  //   console.log(id, '机器id');
  //   try {
  //     // 开始领取收益
  //     const claimHash = await claim.writeContractAsync({
  //       address: CPU_CONTRACT_ADDRESS_STAKING,
  //       abi: stakingAbi,
  //       functionName: 'claim',
  //       args: [id],
  //     });
  //     const stakeReceipt = await waitForTransactionReceipt(config, { hash: claimHash });
  //     if (stakeReceipt.status !== 'success') {
  //       throw new Error('领取收益交易失败');
  //     }

  //     toast.update(toastId, {
  //       position: 'top',
  //       title: '成功',
  //       status: 'success',
  //       description: '领取收益成功！',
  //       duration: 5000,
  //       isClosable: true,
  //     });
  //     onClose();
  //     fetchMachineInfoData();
  //   } catch (error: any) {
  //     toast.update(toastId, {
  //       position: 'top',
  //       title: '失败',
  //       status: 'error',
  //       description: error.message || '操作失败',
  //       isClosable: true,
  //       duration: 5000,
  //     });
  //   } finally {
  //     setBtnData({ isLoading: false, loadingText: '' });
  //   }
  // };

  // 待领取奖励质押合约实例

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

    try {
      const walletClient = await getWalletClient(config);
      const provider = new ethers.BrowserProvider(walletClient as any);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        '0xc663ee691f98d80e5f1cce3c9ad53a14da676a23', // 替换为你真实的 CPU_CONTRACT_ADDRESS_STAKING
        stakingAbi,
        signer
      );

      const estimatedGas = await contract.claim.estimateGas(id);
      const gasLimit = (estimatedGas * 120n) / 100n; // 放大 20%

      const tx = await contract.claim(id, {
        gasLimit,
        gasPrice: ethers.parseUnits('20', 'gwei'), // 强制 Legacy
        type: 0,
      });

      const receipt = await tx.wait();

      if (receipt.status !== 1) {
        throw new Error('领取失败，交易未成功上链');
      }

      toast.update(toastId, {
        position: 'top',
        title: '成功',
        status: 'success',
        description: '领取收益成功！',
        duration: 5000,
        isClosable: true,
      });

      onClose();
      fetchMachineInfoData();
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
      <Button isLoading={btn.loading} size="sm" variant="outline" onClick={onOpenH}>
        {t('machine_Withdraw')}
      </Button>

      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent className="!max-w-[500px]">
          <AlertDialogHeader>{t('withdraw_confirmation')}</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <div className="space-y-4 flex flex-col gap-4">
              <p>{t('withdraw_areYouSure')}</p>
              <div className=" rounded-lg">
                <div className="flex items-center">
                  <span className="text-sm "> {t('withdraw_pendingRewards')}：</span>
                  <span className="text-2xl font-bold text-green-600">{Number(btn.data).toFixed(2) || '0.00'}DLC</span>
                </div>
              </div>
            </div>
          </AlertDialogBody>
          <AlertDialogFooter>
            <div className="flex items-center gap-6">
              <Button colorScheme="blackAlpha" ref={cancelRef} onClick={onClose}>
                {t('withdraw_cancel')}
              </Button>
              <Button isLoading={btnData.isLoading} loadingText={btnData.loadingText} onClick={getClaim}>
                {t('withdraw_confirm')}
              </Button>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default WithdrawBtn;
