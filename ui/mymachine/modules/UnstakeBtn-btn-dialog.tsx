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
import React, { useEffect } from 'react';
import { useWriteContract } from 'wagmi';
import { useConfig } from 'wagmi';
import { useToast } from '@chakra-ui/react';

import { usStake } from './api/index';
import { useTranslation } from 'next-i18next';

interface UnstakeBtnProps {
  id: string;
  forceRerender: any;
}

function UnstakeBtn({ id, forceRerender }: UnstakeBtnProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef(null);
  const config = useConfig();
  const toast = useToast();
  const unstake = useWriteContract();
  const [isPending, start] = useTimeoutFn(() => {}, 2000, { immediate: true });
  // 是否可以解除质押
  const [canUnstake, setCanUnstake] = React.useState(false);
  const { t } = useTranslation('common');

  // 按钮数据
  const [btnData, setBtnData] = React.useState({
    isLoading: false,
    loadingText: '',
  });

  // 模拟确认点击事件
  const unstakeH = async () => {
    setBtnData({ isLoading: true, loadingText: 'Sending...' });
    try {
      const res: any = await usStake(id);
      console.log(res, 'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM');
      if (res.code === 1001 && !res.ended) {
        toast({
          position: 'top',
          title: '提示',
          description: res.msg,
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err: any) {
      console.error('领取奖励出错:', err);
      toast({
        position: 'top',
        title: '提示',
        description: err,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    setBtnData({ isLoading: false, loadingText: '' });
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
