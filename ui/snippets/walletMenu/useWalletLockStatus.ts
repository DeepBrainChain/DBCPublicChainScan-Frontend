import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useToast } from '@chakra-ui/react';

interface WalletLockStatus {
  isLocked: boolean;
  address: string | undefined;
  error: Error | null;
}

export function useWalletLockStatus() {
  const { address, isDisconnected } = useAccount();
  const { disconnect } = useDisconnect();
  const toast = useToast();
  const [lockStatus, setLockStatus] = React.useState<WalletLockStatus>({
    isLocked: false,
    address: address,
    error: null,
  });

  React.useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      console.log('MetaMask accounts changed:', accounts);
      console.log('window.ethereum (accountsChanged):', window.ethereum);
      if (accounts.length === 0) {
        console.log('钱包已锁定，账户数组为空');
        setLockStatus({
          isLocked: true,
          address: undefined,
          error: null,
        });
        disconnect();
        toast({
          title: '钱包已锁定',
          description: '已自动断开连接',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
      } else {
        console.log('钱包未锁定，当前账户:', accounts[0]);
        setLockStatus({
          isLocked: false,
          address: accounts[0],
          error: null,
        });
      }
    };

    const handleDisconnect = () => {
      console.log('MetaMask 已断开连接（disconnect 事件触发）');
      console.log('window.ethereum (disconnect):', window.ethereum);
      setLockStatus({
        isLocked: true,
        address: undefined,
        error: null,
      });
      disconnect();
      toast({
        title: '钱包已断开连接',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    };

    const handleClose = () => {
      console.log('MetaMask 已关闭（close 事件触发）');
      console.log('window.ethereum (close):', window.ethereum);
      setLockStatus({
        isLocked: true,
        address: undefined,
        error: null,
      });
      disconnect();
      toast({
        title: '钱包已关闭',
        description: '已自动断开连接',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    };

    const addListeners = () => {
      console.log('添加监听器前的 window.ethereum:', window.ethereum);
      if (window.ethereum) {
        console.log('添加 MetaMask 事件监听器');
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('disconnect', handleDisconnect);
      } else {
        console.warn('MetaMask 未安装或不可用');
        setLockStatus({
          isLocked: true,
          address: undefined,
          error: new Error('MetaMask 未安装或不可用'),
        });
        toast({
          title: 'MetaMask 未安装',
          description: '请安装 MetaMask 以使用钱包功能',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    const removeListeners = () => {
      console.log('移除监听器前的 window.ethereum:', window.ethereum);
      if (window.ethereum) {
        console.log('移除 MetaMask 事件监听器');
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      }
    };

    addListeners();

    // 初始化状态
    if (!address || isDisconnected) {
      setLockStatus({
        isLocked: true,
        address: undefined,
        error: null,
      });
    } else {
      setLockStatus({
        isLocked: false,
        address: address,
        error: null,
      });
    }

    return () => {
      removeListeners();
    };
  }, [address, isDisconnected, disconnect, toast]);

  return lockStatus;
}
