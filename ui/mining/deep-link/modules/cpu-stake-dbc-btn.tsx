import React, { useEffect, useState } from 'react';
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
import dbcAbi from './abi/dbcAbi.json';
import { useAccount, useWriteContract, useConfig, useReadContract } from 'wagmi';
import { waitForTransactionReceipt, readContract } from 'wagmi/actions';
import { useContractAddress } from '../../../../lib/hooks/useContractAddress';
import { parseEther, formatEther } from 'viem';
import { useContractActions } from '../hooks/stake-before';

function cpuStakeDbcBtn() {
  const { t } = useTranslation('common');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [machineId, setMachineId] = React.useState('');
  const DBC_CONTRACT_ADDRESS = useContractAddress('DBC_CONTRACT_ADDRESS');
  const { address, isConnected } = useAccount();
  const toast = useToast();
  const config = useConfig();
  const [loading, setLoading] = useState(false);
  const stake = useWriteContract();
  const { register, unregister } = useContractActions(machineId);

  // 定义读取函数
  async function getRewardInfoH() {
    try {
      const balance = await readContract(config, {
        address: DBC_CONTRACT_ADDRESS,
        abi: dbcAbi,
        functionName: 'amountDbcStaked',
        args: [machineId],
      });
      return balance;
    } catch (error) {
      console.error('读取合约失败:', error);
      throw error;
    }
  }

  // 开始质押dbc
  const startStakeDBC = async () => {
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
      console.log(resBefore);
      console.log(formatEther(resBefore), 'resBeforeresBeforeresBefore');
      if (formatEther(resBefore) !== '0') {
        throw new Error(t('cpudbc_already_staked'));
      }
      const res: any = await register();
      if (res.code !== 0) {
        throw new Error(res.message || t('cpudbc_register_interface_failed'));
      }
      // 质押
      const stakeHash = await stake.writeContractAsync({
        address: DBC_CONTRACT_ADDRESS,
        abi: dbcAbi,
        functionName: 'stakeDbcForShortTerm',
        args: [machineId],
        value: parseEther('1000'),
      });

      const stakeReceipt = await waitForTransactionReceipt(config, { hash: stakeHash });
      if (stakeReceipt.status !== 'success') {
        throw new Error(t('cpudbc_transaction_failed'));
      }

      toast.update(toastId, {
        position: 'top',
        title: t('success'),
        status: 'success',
        description: t('cpudbc_stake_success'),
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
        {t('stake-dbc')}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="lg">{t('stake-dbc')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <div className="flex flex-col gap-4">
              {/* <FormControl mb={4} size="sm">
                <FormLabel fontSize="sm">{t('gpu-count')}</FormLabel>
                <Input
                  value={pledgedDbcCount}
                  onChange={(e) => setPledgedDbcCount(e.target.value)}
                  placeholder={t('input-gpu-count')}
                  size="sm"
                />
                <FormHelperText fontSize="xs">{t('gpu-stake-requirement')}</FormHelperText>
              </FormControl> */}

              <FormControl mb={4} size="sm">
                <FormLabel fontSize="sm">{t('machine-id')}</FormLabel>
                <Input
                  value={machineId}
                  onChange={(e: any) => setMachineId(e.target.value)}
                  placeholder={t('input-machine-id')}
                  size="sm"
                />
              </FormControl>

              <Button isLoading={loading} colorScheme="blue" width="full" onClick={startStakeDBC}>
                {t('submit')}
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default cpuStakeDbcBtn;
