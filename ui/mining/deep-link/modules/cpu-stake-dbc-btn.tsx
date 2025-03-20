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
import dbcAbi from './abi/dbcAbi.json';
import stakeAbi from './abi/stakeAbi.json';
import { useAccount, useWriteContract, useConfig, useReadContract } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { useContractAddress } from '../../../../lib/hooks/useContractAddress';
import { parseEther } from 'viem';

function cpuStakeDbcBtn() {
  const { t } = useTranslation('common');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [pledgedDbcCount, setPledgedDbcCount] = React.useState('');
  const [dockerId, setDockerId] = React.useState('');
  const DBC_CONTRACT_ADDRESS = useContractAddress('DBC_CONTRACT_ADDRESS');
  const { address, isConnected } = useAccount();
  const toast = useToast();
  const config = useConfig();
  const [loading, setLoading] = useState(false);
  const stake = useWriteContract();

  // 开始质押dbc
  const startStakeDBC = async () => {
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
      // 质押
      const stakeHash = await stake.writeContractAsync({
        address: DBC_CONTRACT_ADDRESS,
        abi: dbcAbi,
        functionName: 'stakeDbc',
        args: [dockerId, parseEther(pledgedDbcCount)],
        value: parseEther(pledgedDbcCount),
      });

      const stakeReceipt = await waitForTransactionReceipt(config, { hash: stakeHash });
      if (stakeReceipt.status !== 'success') {
        throw new Error('质押交易失败');
      }

      toast.update(toastId, {
        position: 'top',
        title: '成功',
        status: 'success',
        description: 'DBC质押成功！',
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
        {t('stake-dbc')}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="lg">{t('stake-dbc')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <div className="flex flex-col gap-4">
              <FormControl mb={4} size="sm">
                <FormLabel fontSize="sm">{t('gpu-count')}</FormLabel>
                <Input
                  value={pledgedDbcCount}
                  onChange={(e) => setPledgedDbcCount(e.target.value)}
                  placeholder={t('input-gpu-count')}
                  size="sm"
                />
                <FormHelperText fontSize="xs">{t('gpu-stake-requirement')}</FormHelperText>
              </FormControl>

              <FormControl mb={4} size="sm">
                <FormLabel fontSize="sm">{t('machine-id')}</FormLabel>
                <Input
                  value={dockerId}
                  onChange={(e) => setDockerId(e.target.value)}
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
    </div>
  );
}

export default cpuStakeDbcBtn;
