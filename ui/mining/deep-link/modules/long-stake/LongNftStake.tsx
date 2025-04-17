import {
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
  FormErrorMessage,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useConfig, useReadContract } from 'wagmi';
import { useContractAddress } from '../../../../../lib/hooks/useContractAddress';
import { waitForTransactionReceipt, readContract } from 'wagmi/actions';
import stakingLongAbi from '../../../../../lib/hooks/useDeepLink/stakingLongAbi.json';
import nftAbi from '../../../../../lib/hooks/useDeepLink/nftAbi.json';
import { createMachine } from '../../../../../ui/mymachine/modules/api/index';

function LongNftStake() {
  const { t } = useTranslation('common');
  const { address, isConnected } = useAccount();
  const toast = useToast();
  const config = useConfig(); // 获取全局配置
  const { isOpen: isPledgeModalOpen, onOpen: onPledgeModalOpen, onClose: onPledgeModalClose } = useDisclosure();
  // NFT 余额 数量
  const [nftNodeCount, setNftNodeCount] = useState('');
  // 租赁id
  const [machineId, setMachineId] = useState('');
  // 机器id
  const [rentalMachineIdOnChain, setRentalMachineIdOnChain] = useState('');
  // 奖励地址
  const [rewardAddress, setRewardAddress] = useState('');
  const [nftLoading, setLoading] = useState(false);
  const STAKING_CONTRACT_ADDRESS_LONG = useContractAddress('STAKING_CONTRACT_ADDRESS_LONG');
  const NFT_CONTRACT_ADDRESS = useContractAddress('NFT_CONTRACT_ADDRESS');

  // nft是否已经质押过了
  async function getRewardInfoH() {
    try {
      const balance = await readContract(config, {
        address: STAKING_CONTRACT_ADDRESS_LONG,
        abi: stakingLongAbi,
        functionName: 'isStaking',
        args: [machineId],
      });
      return balance;
    } catch (error) {
      console.error('读取合约失败:', error);
      throw error;
    }
  }
  // 定义读取钱包余额
  async function getBalanceH(address: string) {
    try {
      const balance = await readContract(config, {
        address: NFT_CONTRACT_ADDRESS,
        abi: nftAbi,
        functionName: 'getBalance',
        args: [address, nftNodeCount],
      });
      return balance;
    } catch (error) {
      console.error('读取合约失败:', error);
      throw error;
    }
  }
  // nft授权实例
  const nftApproval = useWriteContract();

  // 开始质押NFT
  const startStakeNft = async () => {
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
      if (resBefore) {
        throw new Error(t('cpunft_already_staked'));
      }
      console.log(resBefore, 'resBefore');
      // 授权
      const approvalHash = await nftApproval.writeContractAsync({
        address: NFT_CONTRACT_ADDRESS,
        abi: nftAbi,
        functionName: 'setApprovalForAll',
        args: [STAKING_CONTRACT_ADDRESS_LONG, true],
      });

      const approvalReceipt = await waitForTransactionReceipt(config, { hash: approvalHash });
      if (approvalReceipt.status !== 'success') {
        throw new Error(t('cpunft_authorization_failed'));
      }
      const rs: any = await getBalanceH(address as string);
      console.log(rs);
      if (rs[0].length === 0 && rs[1].length === 0) {
        console.log('nft数量不足');
        toast.update(toastId, {
          position: 'top',
          title: t('failed'),
          status: 'warning',
          description: t('deep_insufficient_nft_balance'),
          isClosable: true,
          duration: null,
        });
        return false;
      } else {
        // 在组件中定义创建机器的函数
        const machineData = {
          address: address,
          machineId: rentalMachineIdOnChain,
          nftTokenIds: rs[0].map((id: any) => id.toString()), // 将 BigInt 转换为字符串
          nftTokenIdBalances: rs[1].map((balance: any) => balance.toString()), // 将 BigInt 转换为字符串
          rentId: machineId,
          rewardAddress: rewardAddress || address,
        };
        console.log(machineData, 'args');

        // 质押
        const res: any = await createMachine(machineData);
        if (res.code === 1000) {
          toast.update(toastId, {
            position: 'top',
            title: t('cpunft_success'),
            status: 'success',
            description: t('cpunft_stake_success'),
            duration: 5000,
            isClosable: true,
          });
          if (onPledgeModalClose) {
            onPledgeModalClose();
          }
        } else {
          throw new Error(`args：${JSON.stringify(machineData)}——————${res.msg}`);
        }
      }
    } catch (error: any) {
      console.log(error, 'error', error.message);
      toast.update(toastId, {
        position: 'top',
        title: t('cpunft_failed'),
        status: 'error',
        description: error.message || t('cpunft_operation_failed'),
        isClosable: true,
        duration: null,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button colorScheme="blue" variant="outline" w="fit-content" onClick={onPledgeModalOpen}>
        {t('pledge-nft-nodes')}
      </Button>
      {/* 弹窗 */}
      <Modal isOpen={isPledgeModalOpen} onClose={onPledgeModalClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="lg">{t('pledge-nft-nodes')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <div className="flex flex-col gap-4">
              <FormControl mb={4} size="sm" isRequired>
                <FormLabel fontSize="sm">{t('nft-nodes-pledge-count')}：</FormLabel>
                <Input
                  value={nftNodeCount}
                  onChange={(e) => setNftNodeCount(e.target.value)}
                  placeholder={t('input-nft-nodes-count')}
                  size="sm"
                />
                <FormHelperText fontSize="xs">{t('nft-pledge-requirement')}</FormHelperText>
              </FormControl>

              <FormControl mb={4} size="sm" isRequired>
                <FormLabel fontSize="sm">{t('rent-id')}：</FormLabel>
                <Input
                  value={machineId}
                  onChange={(e) => setMachineId(e.target.value)}
                  placeholder={t('input-rent-id')}
                  size="sm"
                />
              </FormControl>
              <FormControl mb={4} size="sm" isRequired>
                <FormLabel fontSize="sm">{t('machine-id')}</FormLabel>
                <Input
                  value={rentalMachineIdOnChain}
                  onChange={(e) => setRentalMachineIdOnChain(e.target.value)}
                  placeholder={t('input-machine-id')}
                  size="sm"
                />
              </FormControl>
              <FormControl mb={4} size="sm">
                <FormLabel fontSize="sm">{t('deep_reward_address_optional')}</FormLabel>
                <Input
                  value={rewardAddress}
                  onChange={(e) => setRewardAddress(e.target.value)}
                  placeholder={t('deep_enter_reward_address')}
                  size="sm"
                />
              </FormControl>

              <Button isLoading={nftLoading} colorScheme="blue" width="full" onClick={startStakeNft}>
                {t('submit')}
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default LongNftStake;
