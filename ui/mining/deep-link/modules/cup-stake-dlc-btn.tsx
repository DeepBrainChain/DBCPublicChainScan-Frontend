import React, { useState } from 'react';
import {
  Box,
  Text,
  Flex,
  Button,
  useToast,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Modal,
  useDisclosure,
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import dlcAbi from '../../../../lib/hooks/useDeepLink/dlcAbi.json';
import stakeAbi from './abi/stakeAbi.json';
import { useAccount, useWriteContract, useConfig, useReadContract } from 'wagmi';
import { waitForTransactionReceipt, readContract } from 'wagmi/actions';
import { useContractAddress } from '../../../../lib/hooks/useContractAddress';
import { useContractActions } from '../hooks/stake-before';
import { parseEther } from 'viem';

function cpuStakeDlcBtn() {
  const { t } = useTranslation('common');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address, isConnected } = useAccount();
  const toast = useToast();
  const config = useConfig();
  const CPU_CONTRACT_ADDRESS_DLC = useContractAddress('CPU_CONTRACT_ADDRESS_DLC');
  const CPU_CONTRACT_ADDRESS_STAKING = useContractAddress('CPU_CONTRACT_ADDRESS_STAKING');
  const [loading, setLoading] = useState(false);
  const dlcApproval = useWriteContract();
  const stake = useWriteContract();
  const [machineId, setMachineId] = useState('');
  const [amount, setaMount] = useState('');
  const { register, unregister } = useContractActions(machineId);

  // 定义读取函数
  async function getRewardInfoH() {
    try {
      const balance = await readContract(config, {
        address: CPU_CONTRACT_ADDRESS_STAKING,
        abi: stakeAbi,
        functionName: 'isStaking',
        args: [machineId],
      });
      return balance;
    } catch (error) {
      console.error('读取合约失败:', error);
      throw error;
    }
  }

  // 开始质押dlc
  const startStakeDLC = async () => {
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
    setLoading(true);
    const toastId = toast({
      position: 'top',
      title: t('staking'),
      description: t('cpudbc_processing'),
      status: 'loading',
      duration: null,
      isClosable: false,
    });
    try {
      // 先判断是否已经质押过了
      const resBefore: any = await getRewardInfoH();
      if (!resBefore) {
        throw new Error(t('not_staked_yet'));
      }
      const res: any = await register();
      console.log(res, 'HHHHHHHHHHHHHHHHHHHHHHH');
      if (res.code !== 0) {
        throw new Error(res.message || t('cpudbc_register_interface_failed'));
      }
      // 授权
      const approvalHash = await dlcApproval.writeContractAsync({
        address: CPU_CONTRACT_ADDRESS_DLC,
        abi: dlcAbi,
        functionName: 'approve',
        args: [CPU_CONTRACT_ADDRESS_STAKING, parseEther(amount)],
      });

      const approvalReceipt = await waitForTransactionReceipt(config, { hash: approvalHash });
      if (approvalReceipt.status !== 'success') {
        throw new Error(t('cpunft_authorization_failed'));
      }

      // 质押
      const stakeHash = await stake.writeContractAsync({
        address: CPU_CONTRACT_ADDRESS_STAKING,
        abi: stakeAbi,
        functionName: 'addDLCToStake',
        args: [machineId, parseEther(amount)],
      });

      const stakeReceipt = await waitForTransactionReceipt(config, { hash: stakeHash });
      if (stakeReceipt.status !== 'success') {
        throw new Error(
          `args：${JSON.stringify([machineId, parseEther(amount)])}——————${t('cpudbc_transaction_failed')}`
        );
      }

      toast.update(toastId, {
        position: 'top',
        title: t('success'),
        status: 'success',
        description: t('dlcstake_stake_success'),
        duration: 5000,
        isClosable: true,
      });

      onClose();
    } catch (error: any) {
      toast.update(toastId, {
        position: 'top',
        title: t('failed'),
        status: 'error',
        description: error.message || t('operation_failed'),
        isClosable: true,
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="blue" variant="outline" w="fit-content">
        {t('stake-dlc')}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="lg">{t('stake-dlc')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <div className="flex flex-col gap-4">
              <FormControl mb={4} size="sm">
                <FormLabel fontSize="sm">{t('dlc-pledge-amount')}</FormLabel>
                <Input
                  value={amount}
                  onChange={(e) => setaMount(e.target.value)}
                  placeholder={t('input-dlc-pledge-amount')}
                  size="sm"
                />
                <FormHelperText fontSize="xs">{t('dlc-pledge-requirement')}</FormHelperText>
              </FormControl>
              <FormControl mb={4} size="sm">
                <FormLabel fontSize="sm">{t('machine-id')}</FormLabel>
                <Input
                  value={machineId}
                  onChange={(e: any) => setMachineId(e.target.value)}
                  placeholder={t('input-machine-id')}
                  size="sm"
                />
              </FormControl>

              <Button isLoading={loading} colorScheme="blue" width="full" onClick={startStakeDLC}>
                {t('submit')}
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default cpuStakeDlcBtn;
