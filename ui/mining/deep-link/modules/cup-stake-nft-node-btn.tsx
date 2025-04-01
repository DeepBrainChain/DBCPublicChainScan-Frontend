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
import { useContractAddress } from '../../../../lib/hooks/useContractAddress';
import { useAccount, useWriteContract, useConfig, useReadContract } from 'wagmi';
import { waitForTransactionReceipt, readContract } from 'wagmi/actions';
import nftAbi from '../../../../lib/hooks/useDeepLink/nftAbi.json';
import stakeAbi from './abi/stakeAbi.json';
import { useContractActions } from '../hooks/stake-before';
import { createMachineGpu } from '../../../gpumachine/api/index';

function cpuStakeNftBtn() {
  const { t } = useTranslation('common');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address, isConnected } = useAccount();
  const toast = useToast();
  const config = useConfig();
  const NFT_CONTRACT_ADDRESS = useContractAddress('CPU_CONTRACT_ADDRESS_NFT');
  const CPU_CONTRACT_ADDRESS_STAKING = useContractAddress('CPU_CONTRACT_ADDRESS_STAKING');
  const [nftNodeCount, setNftNodeCount] = useState('');
  const [loading, setLoading] = useState(false);
  const [machineId, setMachineId] = useState('');
  // const [rentId, setRentId] = useState('');
  const nftApproval = useWriteContract();
  const stake = useWriteContract();
  const { register } = useContractActions(machineId);

  const { refetch } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: nftAbi,
    functionName: 'getBalance',
    args: address && nftNodeCount ? [address, nftNodeCount] : undefined,
    query: {
      enabled: !!address && !!nftNodeCount,
    },
  }) as any;

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
      // 先判断是否之前已经质押过了
      const resNft = await getRewardInfoH();
      console.log(resNft);
      if (resNft) {
        throw new Error(t('cpunft_already_staked'));
      }
      const res: any = await register();
      console.log(res, 'HHHHHHHHHHHHHHHHHHHHHHH');
      if (res.code !== 0) {
        throw new Error(res.message || t('cpunft_register_interface_failed'));
      }
      // 授权
      const approvalHash = await nftApproval.writeContractAsync({
        address: NFT_CONTRACT_ADDRESS,
        abi: nftAbi,
        functionName: 'setApprovalForAll',
        args: [CPU_CONTRACT_ADDRESS_STAKING, true],
      });

      const approvalReceipt = await waitForTransactionReceipt(config, { hash: approvalHash });
      if (approvalReceipt.status !== 'success') {
        throw new Error(t('cpunft_authorization_failed'));
      }

      // 获取最新的 NFT 数据
      const { data: newNftData } = await refetch();
      if (!Array.isArray(newNftData[0]) || !Array.isArray(newNftData[1])) {
        throw new Error(t('cpunft_data_format_error'));
      }
      console.log(
        machineId,
        newNftData[0].map((id: any) => id.toString()),
        newNftData[1].map((balance: any) => balance.toString())
      );
      // 质押
      const stakeHash = await stake.writeContractAsync({
        address: CPU_CONTRACT_ADDRESS_STAKING,
        abi: stakeAbi,
        functionName: 'stake',
        args: [
          address,
          machineId,
          newNftData[0].map((id: any) => id.toString()),
          newNftData[1].map((balance: any) => balance.toString()),
        ],
      });

      const stakeReceipt = await waitForTransactionReceipt(config, { hash: stakeHash });
      if (stakeReceipt.status !== 'success') {
        throw new Error(t('cpunft_transaction_failed'));
      }
      const resx: any = await createMachineGpu({
        machineId: machineId,
        walletAddress: address,
      });
      if (resx.code === 1000) {
        toast.update(toastId, {
          position: 'top',
          title: t('cpunft_success'),
          status: 'success',
          description: t('cpunft_stake_success'),
          duration: 5000,
          isClosable: true,
        });
        onClose();
      } else {
        throw new Error(res.msg);
      }
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
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="blue" variant="outline" w="fit-content">
        {t('stake-nft-node')}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="lg">{t('stake-nft-node')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <div className="flex flex-col gap-4">
              <FormControl mb={4} size="sm">
                <FormLabel fontSize="sm">{t('nft-stake-count')}</FormLabel>
                <Input
                  value={nftNodeCount}
                  onChange={(e) => setNftNodeCount(e.target.value)}
                  placeholder={t('input-nft-stake-count')}
                  size="sm"
                />
                <FormHelperText fontSize="xs">{t('nft-stake-requirement')}</FormHelperText>
              </FormControl>
              {/* <FormControl mb={4} size="sm">
                <FormLabel fontSize="sm">{t('rent-id')}：</FormLabel>
                <Input
                  value={rentId}
                  onChange={(e) => setRentId(e.target.value)}
                  placeholder={t('input-rent-id')}
                  size="sm"
                />
              </FormControl> */}
              <FormControl mb={4} size="sm">
                <FormLabel fontSize="sm">{t('machine-id')}</FormLabel>
                <Input
                  value={machineId}
                  onChange={(e) => setMachineId(e.target.value)}
                  placeholder={t('input-machine-id')}
                  size="sm"
                />
              </FormControl>

              <Button isLoading={loading} colorScheme="blue" width="full" onClick={startStakeNft}>
                {t('submit')}
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default cpuStakeNftBtn;
