import { useWeb3Modal, useWeb3ModalState } from '@web3modal/wagmi/react';
import React from 'react';
import { useAccount, useDisconnect, useAccountEffect } from 'wagmi';

import * as mixpanel from 'lib/mixpanel/index';

interface Params {
  source: mixpanel.EventPayload<mixpanel.EventTypes.WALLET_CONNECT>['Source'];
}

export default function useWallet({ source }: Params) {
  const { open } = useWeb3Modal();
  const { open: isOpen } = useWeb3ModalState();
  const { disconnect } = useDisconnect();
  const [isModalOpening, setIsModalOpening] = React.useState(false);
  const [isClientLoaded, setIsClientLoaded] = React.useState(false);
  const isConnectionStarted = React.useRef(false);

  React.useEffect(() => {
    setIsClientLoaded(true);
  }, []);

  const handleConnect = React.useCallback(async () => {
    setIsModalOpening(true);
    await open();
    setIsModalOpening(false);
    mixpanel.logEvent(mixpanel.EventTypes.WALLET_CONNECT, { Source: source, Status: 'Started' });
    isConnectionStarted.current = true;
  }, [open, source]);

  const handleAccountConnected = React.useCallback(
    ({ isReconnected }: { isReconnected: boolean }) => {
      !isReconnected &&
        isConnectionStarted.current &&
        mixpanel.logEvent(mixpanel.EventTypes.WALLET_CONNECT, { Source: source, Status: 'Connected' });
      isConnectionStarted.current = false;
    },
    [source]
  );

  const handleDisconnect = React.useCallback(() => {
    disconnect();
  }, [disconnect]);

  useAccountEffect({ onConnect: handleAccountConnected });

  const { address, isDisconnected } = useAccount();

  const isWalletConnected = isClientLoaded && !isDisconnected && address !== undefined;

  React.useEffect(() => {
    setIsClientLoaded(true);

    // 检查初始连接状态并强制断开无效连接
    const checkAndResetConnection = async () => {
      if (!window.ethereum) {
        console.warn('window.ethereum 未初始化，强制断开');
        disconnect();
        localStorage.removeItem('wagmi.wallet');
        localStorage.removeItem('walletconnect');
        return;
      }

      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (!accounts || accounts.length === 0) {
          console.log('未检测到有效账户，强制断开');
          disconnect();
          localStorage.removeItem('wagmi.wallet');
          localStorage.removeItem('walletconnect');
        } else {
          console.log('检测到有效账户:', accounts[0]);
        }
      } catch (error) {
        console.error('检查连接状态失败，强制断开:', error);
        disconnect();
        localStorage.removeItem('wagmi.wallet');
        localStorage.removeItem('walletconnect');
      }
    };

    checkAndResetConnection();

    // 在浏览器关闭时断开连接
    const handleBeforeUnload = () => {
      console.log('浏览器关闭，断开钱包连接');
      disconnect();
      localStorage.removeItem('wagmi.wallet');
      localStorage.removeItem('walletconnect');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [disconnect]);

  return {
    openModal: open,
    isWalletConnected,
    address: address || '',
    connect: handleConnect,
    disconnect: handleDisconnect,
    isModalOpening,
    isModalOpen: isOpen,
  };
}
