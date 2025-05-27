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
  FormHelperText,
  InputGroup,
  InputRightAddon,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useWriteContract, useAccount, useReadContract } from 'wagmi';
import { waitForTransactionReceipt, readContract } from 'wagmi/actions';
import { useConfig } from 'wagmi';
import { useToast } from '@chakra-ui/react';
import addNftAbi from './abi/addNftAbi.json';
import { useContractAddress } from '../../../lib/hooks/useContractAddress';
import { useTranslation } from 'next-i18next';
import { formatEther } from 'viem';
import nftAbi from '../../../lib/hooks/useDeepLink/nftAbi.json';
import dayjs from 'dayjs';
import { renewMachine } from '../../../ui/mymachine/modules/api/index';

function RenewalOfLeaseAll({ forceRerender }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const config = useConfig();
  const toast = useToast();
  const cancelRef = React.useRef(null);
  const { address, isConnected } = useAccount();
  const ADDNFT_CONTRACT_ADDRESS = useContractAddress('ADDNFT_CONTRACT_ADDRESS');
  const NFT_CONTRACT_ADDRESS = useContractAddress('NFT_CONTRACT_ADDRESS');

  const { t } = useTranslation('common');
  const [amount, setAmount] = React.useState(1);
  const [machineData, setAmachineData] = React.useState([]);
  const [times, setTimes] = React.useState([]);
  const [btnData, setBtnData] = React.useState({
    isLoading: false,
    loadingText: '',
  });

  //获取机器数据
  const fetchGraphQLData = async () => {
    const endpoint = 'https://dbcswap.io/subgraph/name/long-staking-state';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
        query {
          stateSummaries(first: 1) {
            totalCalcPoint
          }
          stakeHolders(where: {
            holder: "${`0x5559636738c2cc864a076a30ac6f3da64645666d`}"
          }) {
            holder
            totalClaimedRewardAmount
            totalReleasedRewardAmount
            machineInfos(first: 1000,where: {
        isStaking: true
      }) {
             machineId
             stakeEndTime
            }
          }
        }
      `,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const res: any = await response.json();
    console.log(res, 'resresresresres2222222222222');
    if (res.data.stakeHolders.length !== 0) {
      console.log(res.data.stakeHolders[0].machineInfos);
      let arr = res.data.stakeHolders[0].machineInfos.map((item) => {
        return {
          machineId: item.machineId,
          stakeEndTime: item.stakeEndTime,
        };
      });
      setAmachineData(arr);
    }
  };

  useEffect(() => {
    if (machineData.length !== 0) {
      // 根据机器和用户选择的时间生成时间数据
      const timesArr: any = machineData.map(() => amount);
      setTimes(timesArr);
    }
  }, [amount, machineData]);

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
    if (amount <= 0) {
      return false;
    }
    console.log(
      JSON.stringify({
        holder: address,
        machineIds: machineData,
        additionHoursList: times,
      })
    );
    setBtnData({ isLoading: true, loadingText: 'Sending...' });
    const toastId = toast({
      position: 'top',
      title: t('renewing'),
      description: t('renew_in_progress'),
      status: 'loading',
      duration: null,
      isClosable: false,
    });

    try {
      // 开始续租
      const res: any = await renewMachine({
        holder: address,
        machineIds: machineData,
        additionHoursList: times,
      });

      if (res.code !== 1000) {
        throw new Error(`
          ${res.msg}  参数是：${JSON.stringify({
          holder: address,
          machineIds: machineData,
          additionHoursList: times,
        })}`);
      }
      toast.update(toastId, {
        position: 'top',
        title: t('renew_success'),
        status: 'success',
        description: t('renew_operation_success'),
        duration: 5000,
        isClosable: true,
      });
      forceRerender();
      onClose();
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
    fetchGraphQLData();
  };

  return (
    <>
      <Button size="sm" variant="outline" onClick={onOpenH}>
        一键续租
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
          <AlertDialogHeader>一键续租</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <FormControl mb={4} size="sm">
              <FormLabel fontSize="sm">所有处于租赁的设备将自动续租与链上保持一致的租用时间</FormLabel>
              <FormHelperText fontSize="xs">此操作是必须的否则不会续租成功</FormHelperText>
            </FormControl>
          </AlertDialogBody>
          <AlertDialogFooter>
            <div className="flex items-center gap-6 justify-end w-full">
              <Button colorScheme="blackAlpha" ref={cancelRef} onClick={onClose}>
                {t('deep_cancel')}
              </Button>
              <Button isLoading={btnData.isLoading} loadingText={btnData.loadingText} onClick={getClaim}>
                续租
              </Button>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default RenewalOfLeaseAll;
