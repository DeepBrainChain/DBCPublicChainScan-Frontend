import { useAccount, useWriteContract, useWaitForTransactionReceipt, useConfig, useReadContract } from 'wagmi';
import nftAbi from './nftAbi.json';
import dlcAbi from './dlcAbi.json';
import stakingAbi from './stakingLongAbi.json';
import { useToast } from '@chakra-ui/react';
import { waitForTransactionReceipt, readContract } from 'wagmi/actions';
import { useEffect, useState } from 'react';
import { useContractAddress } from '../../../lib/hooks/useContractAddress';
import { createMachine } from '../../../ui/mymachine/modules/api/index';
import { parseEther } from 'viem';
import { useTranslation } from 'next-i18next';

// machin ID: a8aeafb706433fc89c16817e8405705bd66f28b6d5cfc46c9da2faf7b204da78
// private key: d85789ca443866f898a928bba3d863a5e3c66dc03b03a7d947e8dde99e19368e

export function useApproval(onPledgeModalClose?: () => void, onPledgeModalCloseDLC?: () => void) {
  const { address, isConnected } = useAccount();
  const toast = useToast();
  const config = useConfig(); // 获取全局配置
  const NFT_CONTRACT_ADDRESS = useContractAddress('NFT_CONTRACT_ADDRESS');
  const DLC_TOKEN_ADDRESS = useContractAddress('DLC_TOKEN_ADDRESS');
  const STAKING_CONTRACT_ADDRESS_LONG = useContractAddress('STAKING_CONTRACT_ADDRESS_LONG');
  const { t } = useTranslation('common');

  // 读取 NFT 余额 (getBalance)
  const [nftNodeCount, setNftNodeCount] = useState('');
  const { refetch } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: nftAbi,
    functionName: 'getBalance',
    args: address && nftNodeCount ? [address, nftNodeCount] : undefined,
    query: {
      enabled: !!address && !!nftNodeCount,
    },
  }) as any;

  // 定义读取函数nft
  async function getRewardInfoH() {
    try {
      const balance = await readContract(config, {
        address: STAKING_CONTRACT_ADDRESS_LONG,
        abi: stakingAbi,
        functionName: 'isStaking',
        args: [machineId],
      });
      return balance;
    } catch (error) {
      console.error('读取合约失败:', error);
      throw error;
    }
  }
  // 定义读取函数dlc
  async function getRewardInfoH2() {
    try {
      const balance = await readContract(config, {
        address: STAKING_CONTRACT_ADDRESS_LONG,
        abi: stakingAbi,
        functionName: 'isStaking',
        args: [dlcNodeId],
      });
      return balance;
    } catch (error) {
      console.error('读取合约失败:', error);
      throw error;
    }
  }
  // NFT 授权
  const [nftLoading, setLoading] = useState(false);
  const [machineId, setMachineId] = useState('');
  const [rentalMachineIdOnChain, setRentalMachineIdOnChain] = useState('');

  const nftApproval = useWriteContract();

  // DLC 授权
  const [dlcBtnLoading, setDlcBtnLoading] = useState(false);
  const [dlcNodeId, setdlcNodeId] = useState('');
  const [dlcNodeCount, setDlcNodeCount] = useState('');
  const dlcApproval = useWriteContract();
  const dlcStake = useWriteContract();

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
      const { data: newNftData } = await refetch();
      console.log(newNftData, 'newNftDatanewNftData');
      if (approvalReceipt.status !== 'success') {
        throw new Error(t('cpunft_authorization_failed'));
      }

      // 在组件中定义创建机器的函数
      const machineData = {
        address: address,
        machineId: rentalMachineIdOnChain,
        nftTokenIds: newNftData[0].map((id: any) => id.toString()), // 将 BigInt 转换为字符串
        nftTokenIdBalances: newNftData[1].map((balance: any) => balance.toString()), // 将 BigInt 转换为字符串
        rentId: machineId,
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
        throw new Error(`${res.msg}————————————————————args：${JSON.stringify(machineData)}`);
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
        abi: stakingAbi,
        functionName: 'addDLCToStake',
        args: [dlcNodeId, parseEther(dlcNodeCount)], // 使用传入的 machineId 和 amount
      });
      const stakeReceipt = await waitForTransactionReceipt(config, { hash: stakeHash });
      if (stakeReceipt.status !== 'success') {
        throw new Error(
          `${t('cpunft_transaction_failed')}————————————————————args：${JSON.stringify([
            dlcNodeId,
            parseEther(dlcNodeCount),
          ])}`
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

  return {
    dlcBtnLoading,
    dlcNodeId,
    setdlcNodeId,
    dlcNodeCount,
    setDlcNodeCount,
    nftLoading,
    machineId,
    setMachineId,
    rentalMachineIdOnChain,
    setRentalMachineIdOnChain,
    nftNodeCount,
    setNftNodeCount,
    startStakeNft,
    startStakeDLC,
  };
}
