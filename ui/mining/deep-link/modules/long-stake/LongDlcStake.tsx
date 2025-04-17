import {
  Box,
  Button,
  useToast,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useConfig, useReadContract } from 'wagmi';
import { useContractAddress } from '../../../../../lib/hooks/useContractAddress';
import { waitForTransactionReceipt, readContract } from 'wagmi/actions';
import stakingLongAbi from '../../../../../lib/hooks/useDeepLink/stakingLongAbi.json';
import { createMachine } from '../../../../../ui/mymachine/modules/api/index';
import dlcAbi from '../../../../../lib/hooks/useDeepLink/dlcAbi.json';
import { parseEther } from 'viem';

function LongDlcStake() {
  const { t } = useTranslation('common');
  const { address, isConnected } = useAccount();
  const toast = useToast();
  const config = useConfig(); // 获取全局配置
  // DLC
  const {
    isOpen: isPledgeModalOpenDLC,
    onOpen: onPledgeModalOpenDLC,
    onClose: onPledgeModalCloseDLC,
  } = useDisclosure();

  // dlc数量
  const [dlcNodeCount, setDlcNodeCount] = useState('');
  // 机器id
  const [dlcNodeId, setdlcNodeId] = useState('');
  const [dlcBtnLoading, setDlcBtnLoading] = useState(false);
  const DLC_TOKEN_ADDRESS = useContractAddress('DLC_TOKEN_ADDRESS');
  const STAKING_CONTRACT_ADDRESS_LONG = useContractAddress('STAKING_CONTRACT_ADDRESS_LONG');

  const dlcApproval = useWriteContract();
  const dlcStake = useWriteContract();

  // 先判断是否质押过nft
  async function getRewardInfoH2() {
    try {
      const balance = await readContract(config, {
        address: STAKING_CONTRACT_ADDRESS_LONG,
        abi: stakingLongAbi,
        functionName: 'isStaking',
        args: [dlcNodeId],
      });
      return balance;
    } catch (error) {
      console.error('读取合约失败:', error);
      throw error;
    }
  }
  // 开始质押DLC
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
    setDlcBtnLoading(true);
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
      const resBefore: any = await getRewardInfoH2();
      if (!resBefore) {
        throw new Error(t('not_staked_yet'));
      }
      console.log(resBefore, '先判断是否已经质押过了');
      // 授权
      const hash = await dlcApproval.writeContractAsync({
        address: DLC_TOKEN_ADDRESS,
        abi: dlcAbi,
        functionName: 'approve',
        args: [STAKING_CONTRACT_ADDRESS_LONG, parseEther(dlcNodeCount)],
      });
      const approvalReceipt = await waitForTransactionReceipt(config, { hash: hash });

      if (approvalReceipt.status !== 'success') {
        throw new Error(t('cpunft_authorization_failed'));
      }
      // 质押
      console.log(parseEther(dlcNodeCount), '////////', dlcNodeId);
      const stakeHash = await dlcStake.writeContractAsync({
        address: STAKING_CONTRACT_ADDRESS_LONG,
        abi: stakingLongAbi,
        functionName: 'addDLCToStake',
        args: [dlcNodeId, parseEther(dlcNodeCount)], // 使用传入的 machineId 和 amount
      });
      const stakeReceipt = await waitForTransactionReceipt(config, { hash: stakeHash });
      if (stakeReceipt.status !== 'success') {
        throw new Error(
          `args：${JSON.stringify([dlcNodeId, parseEther(dlcNodeCount)])}——————${t('cpunft_transaction_failed')}`
        );
      }

      toast.update(toastId, {
        position: 'top',
        title: t('cpunft_success'),
        status: 'success',
        description: t('cpunft_stake_success'),
        duration: 5000,
        isClosable: true,
      });
      if (onPledgeModalCloseDLC) {
        onPledgeModalCloseDLC();
      }
    } catch (error: any) {
      toast.update(toastId, {
        position: 'top',
        title: t('cpunft_failed'),
        status: 'error',
        description: error.message || t('cpunft_operation_failed'),
        isClosable: true,
        duration: 6000,
      });
    } finally {
      setDlcBtnLoading(false);
    }
  };
  return (
    <>
      <Button onClick={onPledgeModalOpenDLC} colorScheme="blue" variant="outline" w="fit-content">
        {t('pledge-dlc')}
      </Button>
      {/* DLC */}
      <Modal isOpen={isPledgeModalOpenDLC} onClose={onPledgeModalCloseDLC} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="lg">{t('pledge-dlc')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <div className="flex flex-col gap-4">
              <FormControl mb={4} size="sm" isRequired>
                <FormLabel fontSize="sm">{t('dlc-pledge-amount')}</FormLabel>
                <Input
                  value={dlcNodeCount}
                  onChange={(e) => setDlcNodeCount(e.target.value)}
                  placeholder={t('input-dlc-pledge-amount')}
                  size="sm"
                />
                <FormHelperText fontSize="xs">{t('dlc-pledge-requirement')}</FormHelperText>
              </FormControl>
              <FormControl mb={4} size="sm" isRequired>
                <FormLabel fontSize="sm">{t('machine-id')}</FormLabel>
                <Input
                  value={dlcNodeId}
                  onChange={(e) => setdlcNodeId(e.target.value)}
                  placeholder={t('input-machine-id')}
                  size="sm"
                />
              </FormControl>
              <Button isLoading={dlcBtnLoading} colorScheme="blue" width="full" onClick={startStakeDLC}>
                {t('submit')}
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default LongDlcStake;
