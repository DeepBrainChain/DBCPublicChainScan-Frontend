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
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
} from '@chakra-ui/react';
import React from 'react';
import { useWriteContract, useAccount, useReadContract } from 'wagmi';
import { waitForTransactionReceipt, readContract } from 'wagmi/actions';
import { useConfig } from 'wagmi';
import { useToast } from '@chakra-ui/react';
import stakingLongAbi from '../../../lib/hooks/useDeepLink/stakingLongAbi.json';

import { useContractAddress } from '../../../lib/hooks/useContractAddress';
import { useTranslation } from 'next-i18next';
import { formatEther } from 'viem';
import { createMachine, renewMachine } from '../../../ui/mymachine/modules/api/index';

function RenewalOfLease({ id, forceRerender }: { id: string; forceRerender: any }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const config = useConfig();
  const toast = useToast();
  const cancelRef = React.useRef(null);
  const { address, isConnected } = useAccount();
  const STAKING_CONTRACT_ADDRESS_LONG = useContractAddress('STAKING_CONTRACT_ADDRESS_LONG');

  const { t } = useTranslation('common');
  const [time, setTime] = React.useState('');
  const [btnData, setBtnData] = React.useState({
    isLoading: false,
    loadingText: '',
  });

  const getClaim = async () => {
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
    if (time === '') {
      return false;
    }

    setBtnData({ isLoading: true, loadingText: 'Sending...' });
    const toastId = toast({
      position: 'top',
      title: t('renewing'),
      description: t('renew_in_progress'),
      status: 'loading',
      duration: null,
      isClosable: false,
    });
    console.log(
      JSON.stringify({
        holder: address,
        machineIds: [id],
        additionHoursList: [time],
      })
    );
    try {
      // 开始续租
      const res: any = await renewMachine({
        holder: address,
        machineIds: [id],
        additionHoursList: [time],
      });

      if (res.code !== 1000) {
        throw new Error(`
          ${res.msg}  参数是：${JSON.stringify({
          holder: address,
          machineIds: [id],
          additionHoursList: [time],
        })}`);
      }
      toast.update(toastId, {
        position: 'top',
        title: t('renew_success'),
        status: 'success',
        description: t('renew_operation_success'),
        duration: 5000,
        isClosable: true,
      });
      forceRerender();
      onClose();
    } catch (error: any) {
      toast.update(toastId, {
        position: 'top',
        title: t('failed'),
        status: 'error',
        description: error.message || t('operation_failed'),
        isClosable: true,
        duration: null,
      });
    } finally {
      setBtnData({ isLoading: false, loadingText: '' });
    }
  };

  const onOpenH = async () => {
    onOpen();
  };

  return (
    <>
      <Button size="sm" variant="outline" onClick={onOpenH}>
        {t('renew')}
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
          <AlertDialogHeader>{t('machine_renew')}</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <FormControl mb={4} size="sm">
              <FormLabel fontSize="sm">{t('renew_time')}：</FormLabel>

              <InputGroup size="sm">
                <Input
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  size="sm"
                  placeholder={t('enter_renew_time')}
                />

                <InputRightAddon>{t('hour')}</InputRightAddon>
              </InputGroup>
            </FormControl>
          </AlertDialogBody>
          <AlertDialogFooter>
            <div className="flex items-center gap-6 justify-end w-full">
              <Button colorScheme="blackAlpha" ref={cancelRef} onClick={onClose}>
                {t('deep_cancel')}
              </Button>
              <Button isLoading={btnData.isLoading} loadingText={btnData.loadingText} onClick={getClaim}>
                {t('renew_action')}
              </Button>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default RenewalOfLease;
