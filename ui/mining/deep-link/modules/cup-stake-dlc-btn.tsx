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
import { waitForTransactionReceipt } from 'wagmi/actions';
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

  // 开始质押dlc
  const startStakeDLC = async () => {
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
    setLoading(true);
    const toastId = toast({
      position: 'top',
      title: '质押中',
      description: '正在处理您的质押请求，请稍候...',
      status: 'loading',
      duration: null,
      isClosable: false,
    });
    try {
      const res: any = await register();
      console.log(res, 'HHHHHHHHHHHHHHHHHHHHHHH');
      if (res.code !== 0) {
        throw new Error(res.message || '注册接口失败');
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
        throw new Error('授权交易失败');
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
        throw new Error('质押交易失败');
      }

      toast.update(toastId, {
        position: 'top',
        title: '成功',
        status: 'success',
        description: 'DLC质押成功！',
        duration: 5000,
        isClosable: true,
      });

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
      setLoading(false);
    }
  };

  return (
    <div>
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
                  onChange={(e) => setMachineId(e.target.value)}
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
    </div>
  );
}

export default cpuStakeDlcBtn;
