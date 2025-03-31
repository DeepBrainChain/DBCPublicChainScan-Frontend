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
import React, { useState } from 'react';
import { useApproval } from '../../../lib/hooks/useDeepLink/useApproval';
import { useWriteContract, useAccount, useReadContract, useConfig } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { useToast } from '@chakra-ui/react';
import stakingAbi from '../abi/stakeaib.json';
import { deleteMachineGpu } from '../api/index';
import { useTranslation } from 'next-i18next';
import { useContractAddress } from '../../../lib/hooks/useContractAddress';
import { useContractActions } from '../../../ui/mining/deep-link/hooks/stake-before';
import { readContract } from '@wagmi/core'; // 注意导入路径
import dbcAbi from '../../../ui/mining/deep-link/modules/abi/dbcAbi.json';

interface UnstakeBtnProps {
  id: string;
  forceRerender: any;
}

function UnstakeBtn({ id, forceRerender }: UnstakeBtnProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef(null);
  const config = useConfig();
  const toast = useToast();
  const [isPending] = useTimeoutFn(() => {}, 2000, { immediate: true });
  const DBC_CONTRACT_ADDRESS = useContractAddress('DBC_CONTRACT_ADDRESS');

  // 是否可以解除质押
  const { t } = useTranslation('common');
  const CPU_CONTRACT_ADDRESS_STAKING = useContractAddress('CPU_CONTRACT_ADDRESS_STAKING');
  const { isConnected } = useAccount();
  const { unregister } = useContractActions(id);
  // 按钮数据
  const [btnData, setBtnData] = React.useState({
    isLoading: false,
    loadingText: '',
  });

  // 解除质押合约实例nft
  const unstake = useWriteContract();
  // 解除质押合约实例
  const unstakeDbc = useWriteContract();
  const unstakeH = async () => {
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
      title: '解除质押中',
      description: '正在处理您的解除质押请求，请稍候...',
      status: 'loading',
      duration: null,
      isClosable: false,
    });
    console.log(id, '机器id');
    try {
      //  开始调用注销接口
      const res: any = await unregister();
      console.log(res, 'HHHHHHHHHHHHHHHHHHHHHHH');
      if (res.code !== 0) {
        throw new Error(res.message || '注销接口失败');
      }
      // 开始解除质押
      const unstakeHash = await unstake.writeContractAsync({
        address: CPU_CONTRACT_ADDRESS_STAKING,
        abi: stakingAbi,
        functionName: 'unStake',
        args: [id],
      });
      const stakeReceipt = await waitForTransactionReceipt(config, { hash: unstakeHash });
      if (stakeReceipt.status !== 'success') {
        throw new Error('解除质押NFT交易失败');
      }

      // 开始解除dbc
      const unstakeDbcHash = await unstake.writeContractAsync({
        address: DBC_CONTRACT_ADDRESS,
        abi: dbcAbi,
        functionName: 'unstakeDbc',
        args: [id],
      });
      const stakeReceipt2 = await waitForTransactionReceipt(config, { hash: unstakeDbcHash });
      if (stakeReceipt2.status !== 'success') {
        throw new Error('解除质押DBC交易失败');
      }

      const resDelete: any = await deleteMachineGpu(id);
      console.log(resDelete);

      if (resDelete.code !== 1000) {
        throw new Error(resDelete.msg);
      }

      toast.update(toastId, {
        position: 'top',
        title: '成功',
        status: 'success',
        description: '解除质押成功！',
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

  return (
    <>
      <Skeleton isLoaded={!isPending}>
        <Button size="sm" variant="outline" onClick={onOpen}>
          {t('machine_Unstake')}
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
          <AlertDialogBody>Are you sure you want to unstake?</AlertDialogBody>
          <AlertDialogFooter>
            <div className="flex items-center gap-6">
              <Button colorScheme="blackAlpha" ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button isLoading={btnData.isLoading} loadingText={btnData.loadingText} onClick={unstakeH}>
                Confirm
              </Button>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default UnstakeBtn;
