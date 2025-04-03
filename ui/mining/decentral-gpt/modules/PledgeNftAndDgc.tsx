import React from 'react';
import {
  Box,
  Button,
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
  useDisclosure,
} from '@chakra-ui/react';
import { useLongH } from '../../../../lib/hooks/useDecentralGPT/free/useLong';

function PledgeNftAndDgc() {
  const { isOpen: isPledgeModalOpen, onOpen: onPledgeModalOpen, onClose: onPledgeModalClose } = useDisclosure();
  const {
    BtnLoading,
    stakedDgcAmount,
    setStakedDgcAmount,
    stakedNftAmount,
    setStakedNftAmount,
    containerId,
    setContainerId,
    machineId,
    setMachineId,
    leaseId,
    setLeaseId,
    approveNft,
  } = useLongH(onPledgeModalClose);
  return (
    <>
      <Button onClick={onPledgeModalOpen} size="sm" colorScheme="blue" variant="outline" w="fit-content">
        Pledge NFT And DGC
      </Button>
      <Modal isOpen={isPledgeModalOpen} onClose={onPledgeModalClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="lg">Pledge NFT Nodes</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mb={4} size="sm">
              <FormLabel fontSize="sm">质押nft的数量(erc1155):</FormLabel>
              <Input
                value={stakedNftAmount}
                onChange={(e: any) => setStakedNftAmount(e.target.value)}
                placeholder="请输入质押nft的数量"
                size="sm"
              />
              <FormHelperText fontSize="xs">Please enter a number of NFTs between 1 and 11</FormHelperText>
            </FormControl>
            <FormControl mb={4} size="sm">
              <FormLabel fontSize="sm">质押dgc的数量:</FormLabel>
              <Input
                value={stakedDgcAmount}
                onChange={(e: any) => setStakedDgcAmount(e.target.value)}
                placeholder="请输入质押dgc的数量"
                size="sm"
              />
            </FormControl>

            <FormControl mb={4} size="sm">
              <FormLabel fontSize="sm">容器id:</FormLabel>
              <Input
                value={containerId}
                onChange={(e: any) => setContainerId(e.target.value)}
                placeholder="请输入容器id"
                size="sm"
              />
            </FormControl>

            <FormControl mb={6} size="sm">
              <FormLabel fontSize="sm">substrate上面生成的机器id:</FormLabel>
              <Input
                value={machineId}
                onChange={(e: any) => setMachineId(e.target.value)}
                placeholder="请输入substrate上面生成的机器id"
                size="sm"
              />
            </FormControl>
            <FormControl mb={6} size="sm">
              <FormLabel fontSize="sm">租用id:</FormLabel>
              <Input
                value={leaseId}
                onChange={(e: any) => setLeaseId(e.target.value)}
                placeholder="请输入租用id"
                size="sm"
              />
            </FormControl>
            <Button isLoading={BtnLoading} colorScheme="blue" width="full" size="sm" onClick={approveNft}>
              Submit
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default PledgeNftAndDgc;
