import { useAccount, useWriteContract, useWaitForTransactionReceipt, useConfig, useReadContract } from 'wagmi';
import nftAbi from './nftAbi.json';
import erc20Abi from './dlcAbi.json';
import stakingAbi from './stakingLongAbi.json';
import { useToast } from '@chakra-ui/react';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { useEffect, useState } from 'react';
import { useContractAddress } from '../../../lib/hooks/useContractAddress';
import { createMachine } from '../../../ui/mymachine/modules/api/index';

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
  const {
    data: nftData,
    isLoading,
    refetch,
  } = useReadContract({
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
  const approveNft = async () => {
    if (!isConnected) {
      toast({
        position: 'top',
        title: 'Prompt',
        description: 'Please connect your wallet first',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    const hash = await nftApproval.writeContractAsync({
      address: NFT_CONTRACT_ADDRESS,
      abi: nftAbi,
      functionName: 'setApprovalForAll',
      args: [STAKING_CONTRACT_ADDRESS_LONG, true],
    });
    console.log(hash, '授权交易hash');

    toast({
      position: 'top',
      title: '交易已发送',
      status: 'success',
      description: `授权交易发送成功，请等待成功！hash:${hash}`,
      isClosable: true,
    });
    try {
      waitForTransactionReceipt(config, { hash: hash }).then(async (receipt) => {
        const { data: newNftData } = await refetch();
        if (receipt.status === 'success') {
          console.log('成功授权了');
          toast({
            position: 'top',
            title: '成功',
            status: 'success',
            description: '授权成功，开始质押，请继续等待！',
            isClosable: true,
          });
          // 在组件中定义创建机器的函数
          const machineData = {
            address: address,
            machineId: rentalMachineIdOnChain,
            nftTokenIds: newNftData[0].map((id: any) => id.toString()), // 将 BigInt 转换为字符串
            nftTokenIdBalances: newNftData[1].map((balance: any) => balance.toString()), // 将 BigInt 转换为字符串
            rentId: machineId,
          };
          console.log(machineData, 'MMMMMMMMMMxxxxxxxxxxx');
          try {
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
              toast({
                position: 'top',
                title: '失败！',
                status: 'error',
                description: res.msg,
                isClosable: true,
              });
              setLoading(false);
            }
          } catch (err: any) {
            console.log(err, '////////////////');
            toast({
              position: 'top',
              title: '警告',
              status: 'warning',
              description: err,
              isClosable: true,
            });
            setLoading(false);
          }
        } else {
          return {
            title: '授权失败',
            description: '授权失败',
            position: 'top',
            duration: null,
            isClosable: true,
          };
        }
      });
    } catch (error) {
      setLoading(false);
      return {
        title: '授权失败',
        description: error || '授权失败',
        position: 'top',
        duration: null,
        isClosable: true,
      };
    }
  };

  // DLC 授权
  const [dlcBtnLoading, setDlcBtnLoading] = useState(false);
  const [dlcNodeId, setdlcNodeId] = useState('');
  const [dlcNodeCount, setDlcNodeCount] = useState('');
  const dlcApproval = useWriteContract();

  const approveDlcToken = async () => {
    if (!isConnected) {
      toast({
        position: 'top',
        title: 'Prompt',
        description: 'Please connect your wallet first',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setDlcBtnLoading(true);

    const hash = await dlcApproval.writeContractAsync({
      address: DLC_TOKEN_ADDRESS,
      abi: erc20Abi,
      functionName: 'approve',
      args: [STAKING_CONTRACT_ADDRESS_LONG, dlcNodeCount],
    });

    console.log('dlc授权hash:', hash);
    toast({
      position: 'top',
      title: 'DLC授权交易已发送',
      status: 'success',
      description: `DLC授权交易发送成功，请等待成功！hash:${hash}`,
      isClosable: true,
    });
    try {
      waitForTransactionReceipt(config, { hash: hash }).then((receipt) => {
        console.log(receipt);
        if (receipt.status === 'success') {
          console.log('成功授权了');

          toast({
            position: 'top',
            title: '成功',
            status: 'success',
            description: `授权成功，请等待DLC质押操作！`,
            isClosable: true,
          });
          handleAddDLCToStake();
        } else {
          console.log('失败了', receipt);
          setDlcBtnLoading(false);
        }
      });
    } catch (error: any) {
      setDlcBtnLoading(false);
      toast({
        position: 'top',
        title: '失败',
        status: 'error',
        description: error || '授权失败',
        isClosable: true,
      });
    }
  };
  // 交易方法：添加 DLC 到质押
  // const { writeContractAsync } = useWriteContract();
  const dlcStake = useWriteContract();

  // 开始质押 DLC
  const handleAddDLCToStake = async () => {
    try {
      const hash = await dlcStake.writeContractAsync({
        address: STAKING_CONTRACT_ADDRESS_LONG,
        abi: stakingAbi,
        functionName: 'addDLCToStake',
        args: [dlcNodeId, dlcNodeCount], // 使用传入的 machineId 和 amount
      });
      console.log(`DLC质押交易发送成功，请等待成功！hash:${hash}`);
      toast({
        position: 'top',
        title: '交易已发送',
        status: 'success',
        description: `DLC质押交易发送成功，请等待成功！hash:${hash}`,
        isClosable: true,
      });
      waitForTransactionReceipt(config, { hash: hash }).then((receipt) => {
        console.log(receipt);
        if (receipt.status === 'success') {
          console.log('dlc质押成功');
          if (onPledgeModalCloseDLC) {
            onPledgeModalCloseDLC();
          }
          toast({
            position: 'top',
            title: '成功',
            status: 'success',
            description: `dlc质押成功！`,
            isClosable: true,
          });
        } else {
          console.log('失败了', receipt);
          setDlcBtnLoading(false);
        }
      });
    } catch (err: any) {
      console.log(err, 'errrrrrr');
      setDlcBtnLoading(false);
      toast({
        title: '交易失败',
        description: err,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  return {
    approveNft,
    approveDlcToken,
    handleAddDLCToStake,
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
  };
}
