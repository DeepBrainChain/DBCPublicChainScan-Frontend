import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import React from 'react';
import { useWriteContract, useAccount, useReadContract } from 'wagmi';
import { waitForTransactionReceipt, readContract } from 'wagmi/actions';
import { useConfig } from 'wagmi';
import { useToast } from '@chakra-ui/react';
import addNftAbi from './abi/addNftAbi.json';
import { useContractAddress } from '../../../lib/hooks/useContractAddress';
import { useTranslation } from 'next-i18next';
import { formatEther } from 'viem';
import nftAbi from '../../../lib/hooks/useDeepLink/nftAbi.json';

function WithdrawBtn({ id, forceRerender }: { id: string; forceRerender: any }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const config = useConfig();
  const toast = useToast();
  const cancelRef = React.useRef(null);
  const { address, isConnected } = useAccount();
  const ADDNFT_CONTRACT_ADDRESS = useContractAddress('ADDNFT_CONTRACT_ADDRESS');
  const NFT_CONTRACT_ADDRESS = useContractAddress('NFT_CONTRACT_ADDRESS');

  const { t } = useTranslation('common');
  const [amount, setAmount] = React.useState('');
  const [btnData, setBtnData] = React.useState({
    isLoading: false,
    loadingText: '',
  });

  // 定义读取函数
  async function getBalanceH(address: string) {
    try {
      const balance = await readContract(config, {
        address: NFT_CONTRACT_ADDRESS,
        abi: nftAbi,
        functionName: 'getBalance',
        args: [address, amount],
      });
      return balance;
    } catch (error) {
      console.error('读取合约失败:', error);
      throw error;
    }
  }

  // 待领取奖励质押合约实例
  const claim = useWriteContract();

  const getClaim = async () => {
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
    if (amount === '') {
      return false;
    }
    setBtnData({ isLoading: true, loadingText: 'Sending...' });
    const toastId = toast({
      position: 'top',
      title: t('deep_adding_nft_in_progress'),
      description: t('deep_processing_add_nft_request'),
      status: 'loading',
      duration: null,
      isClosable: false,
    });
    console.log(id, '机器id');
    try {
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
        // 追加nft
        const addNftHash = await claim.writeContractAsync({
          address: ADDNFT_CONTRACT_ADDRESS,
          abi: addNftAbi,
          functionName: 'addNFTsToStake',
          args: [id, rs[0], rs[1]],
        });
        const stakeReceipt = await waitForTransactionReceipt(config, { hash: addNftHash });
        if (stakeReceipt.status !== 'success') {
          throw new Error(t('deep_add_nft_transaction_failed'));
        }
        toast.update(toastId, {
          position: 'top',
          title: t('cpunft_success'),
          status: 'success',
          description: t('deep_add_nft_success'),
          duration: 5000,
          isClosable: true,
        });
        forceRerender();
        onClose();
      }
    } catch (error: any) {
      toast.update(toastId, {
        position: 'top',
        title: t('failed'),
        status: 'error',
        description: error.message || t('operation_failed'),
        isClosable: true,
        duration: null,
      });
    } finally {
      setBtnData({ isLoading: false, loadingText: '' });
    }
  };

  const onOpenH = async () => {
    onOpen();
  };

  return (
    <>
      <Button size="sm" variant="outline" onClick={onOpenH}>
        {t('deep_add_nft')}
      </Button>

      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent className="!max-w-[500px]">
          <AlertDialogHeader>{t('deep_add_nft')}</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <FormControl mb={4} size="sm">
              <FormLabel fontSize="sm">{t('deep_nft_amount_to_add')}：</FormLabel>
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={t('deep_enter_nft_amount_to_add')}
                size="sm"
              />
            </FormControl>
          </AlertDialogBody>
          <AlertDialogFooter>
            <div className="flex items-center gap-6 justify-end w-full">
              <Button colorScheme="blackAlpha" ref={cancelRef} onClick={onClose}>
                {t('deep_cancel')}
              </Button>
              <Button isLoading={btnData.isLoading} loadingText={btnData.loadingText} onClick={getClaim}>
                {t('deep_confirm_add')}
              </Button>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default WithdrawBtn;
