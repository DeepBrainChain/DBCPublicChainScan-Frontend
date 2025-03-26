import { useAccount, useWriteContract, useWaitForTransactionReceipt, useConfig, useReadContract } from 'wagmi';
import nftAbi from './nftAbi.json';
import dlcAbi from './dlcAbi.json';
import stakingAbi from './stakingLongAbi.json';
import { useToast } from '@chakra-ui/react';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { useEffect, useState } from 'react';
import { useContractAddress } from '../../../lib/hooks/useContractAddress';
import { createMachine } from '../../../ui/mymachine/modules/api/index';
import { parseEther } from 'viem';

// machin ID: a8aeafb706433fc89c16817e8405705bd66f28b6d5cfc46c9da2faf7b204da78
// private key: d85789ca443866f898a928bba3d863a5e3c66dc03b03a7d947e8dde99e19368e

export function useApproval(onPledgeModalClose?: () => void, onPledgeModalCloseDLC?: () => void) {
  const { address, isConnected } = useAccount();
  const toast = useToast();
  const config = useConfig(); // 获取全局配置
  const NFT_CONTRACT_ADDRESS = useContractAddress('NFT_CONTRACT_ADDRESS');
  const DLC_TOKEN_ADDRESS = useContractAddress('DLC_TOKEN_ADDRESS');
  const STAKING_CONTRACT_ADDRESS_LONG = useContractAddress('STAKING_CONTRACT_ADDRESS_LONG');
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

  // 交易方法：添加 DLC 到质押
  // const { writeContractAsync } = useWriteContract();

  // 开始质押NFT
  const startStakeNft = async () => {
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
        throw new Error('授权交易失败');
      }

      // 在组件中定义创建机器的函数
      const machineData = {
        address: address,
        machineId: rentalMachineIdOnChain,
        nftTokenIds: newNftData[0].map((id: any) => id.toString()), // 将 BigInt 转换为字符串
        nftTokenIdBalances: newNftData[1].map((balance: any) => balance.toString()), // 将 BigInt 转换为字符串
        rentId: machineId,
      };
      console.log(machineData, '传递的参数');

      // 质押
      const res: any = await createMachine(machineData);
      if (res.code === 1000) {
        toast({
          position: 'top',
          title: '成功',
          status: 'success',
          description: '成功质押了',
          isClosable: true,
        });
        if (onPledgeModalClose) {
          onPledgeModalClose();
        }
      } else {
        throw new Error(res.msg);
      }

      toast.update(toastId, {
        position: 'top',
        title: '成功',
        status: 'success',
        description: '质押成功！',
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      toast.update(toastId, {
        position: 'top',
        title: '失败',
        status: 'error',
        description: error.message || '操作失败',
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
        title: '提示',
        description: '请先连接你的钱包',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setDlcBtnLoading(true);
    const toastId = toast({
      position: 'top',
      title: '质押中',
      description: '正在处理您的质押请求，请稍候...',
      status: 'loading',
      duration: null,
      isClosable: false,
    });
    try {
      // 授权
      const hash = await dlcApproval.writeContractAsync({
        address: DLC_TOKEN_ADDRESS,
        abi: dlcAbi,
        functionName: 'approve',
        args: [STAKING_CONTRACT_ADDRESS_LONG, parseEther(dlcNodeCount)],
      });
      console.log(hash, 'dlc授权hash');
      const approvalReceipt = await waitForTransactionReceipt(config, { hash: hash });

      // const approvalReceipt = await waitForTransactionReceipt(config, { hash: approvalHash });
      console.log(approvalReceipt, 'approvalReceiptapprovalReceiptapprovalReceiptapprovalReceipt');
      if (approvalReceipt.status !== 'success') {
        throw new Error('授权交易失败');
      }
      // 质押
      console.log(parseEther(dlcNodeCount), '////////', dlcNodeId);
      const stakeHash = await dlcStake.writeContractAsync({
        address: STAKING_CONTRACT_ADDRESS_LONG,
        abi: stakingAbi,
        functionName: 'addDLCToStake',
        args: [dlcNodeId, parseEther(dlcNodeCount)], // 使用传入的 machineId 和 amount
      });
      console.log(stakeHash, 'dlc交易hash');
      const stakeReceipt = await waitForTransactionReceipt(config, { hash: stakeHash });
      if (stakeReceipt.status !== 'success') {
        throw new Error('质押交易失败');
      }

      toast.update(toastId, {
        position: 'top',
        title: '成功',
        status: 'success',
        description: '质押成功！',
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      toast.update(toastId, {
        position: 'top',
        title: '失败',
        status: 'error',
        description: error.message || '操作失败',
        isClosable: true,
        duration: null,
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
