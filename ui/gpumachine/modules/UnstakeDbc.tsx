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
import { useWriteContract, useAccount, useReadContract, useConfig } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { useToast } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { useContractAddress } from '../../../lib/hooks/useContractAddress';
import { useContractActions } from '../../../ui/mining/deep-link/hooks/stake-before';

interface UnstakeBtnProps {
  id: string;
  forceRerender: any;
}

function UnstakeDbc({ id, forceRerender }: UnstakeBtnProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef(null);
  const config = useConfig();
  const toast = useToast();
  const [isPending] = useTimeoutFn(() => {}, 2000, { immediate: true });
  const DBC_CONTRACT_ADDRESS = useContractAddress('DBC_CONTRACT_ADDRESS');

  // 是否可以解除质押
  const { t } = useTranslation('common');
  const { isConnected } = useAccount();
  const { unregister } = useContractActions(id);
  // 按钮数据
  const [btnData, setBtnData] = React.useState({
    isLoading: false,
    loadingText: '',
  });

  // 解除质押合约实例nft
  const unstakeDbc = useWriteContract();
  const unstakeH = async () => {
    if (!isConnected) {
      toast({
        position: 'top',
        title: t('hint'),
        description: t('cpudbc_connect_wallet'),
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setBtnData({ isLoading: true, loadingText: 'Sending...' });
    const toastId = toast({
      position: 'top',
      title: t('deep_unstaking_in_progress'),
      description: t('deep_processing_unstake_request'),
      status: 'loading',
      duration: null,
      isClosable: false,
    });
    console.log(id, '机器id');
    try {
      //  开始调用注销接口
      // const res: any = await unregister();
      // console.log(res, 'HHHHHHHHHHHHHHHHHHHHHHH');
      // if (res.code !== 0) {
      //   throw new Error(res.message || '注销接口失败');
      // }

      // 开始解除dbc
      const unstakeDbcHash = await unstakeDbc.writeContractAsync({
        address: DBC_CONTRACT_ADDRESS,
        abi: dbcAbi,
        functionName: 'unstakeDbc',
        args: [id],
      });
      const stakeReceipt2 = await waitForTransactionReceipt(config, { hash: unstakeDbcHash });
      console.log(stakeReceipt2, 'stakeReceipt2stakeReceipt2');
      if (stakeReceipt2.status !== 'success') {
        throw new Error(t('deep_unstake_dbc_transaction_failed'));
      }

      toast.update(toastId, {
        position: 'top',
        title: t('success'),
        status: 'success',
        description: t('deep_unstake_dbc_success'),
        duration: 5000,
        isClosable: true,
      });
      forceRerender();
      onClose();
    } catch (error: any) {
      toast.update(toastId, {
        position: 'top',
        title: t('cpunft_failed'),
        status: 'error',
        description: error.message || t('cpunft_operation_failed'),
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
          {t('deep_unstake_dbc')}
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
          <AlertDialogHeader>{t('deepx_confirmation')}</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>{t('deepx_are_you_sure_unstake2')}</AlertDialogBody>
          <AlertDialogFooter>
            <div className="flex items-center gap-6">
              <Button colorScheme="blackAlpha" ref={cancelRef} onClick={onClose}>
                {t('deepx_cancel')}
              </Button>
              <Button isLoading={btnData.isLoading} loadingText={btnData.loadingText} onClick={unstakeH}>
                {t('deepx_confirm')}
              </Button>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default UnstakeDbc;
