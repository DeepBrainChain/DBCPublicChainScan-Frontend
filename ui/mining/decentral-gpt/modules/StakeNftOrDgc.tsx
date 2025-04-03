import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  FormErrorMessage,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

function StakeNftOrDgc() {
  // Pledge NFT Node
  const {
    isOpen: nftIsPledgeModalOpen,
    onOpen: nftOnPledgeModalOpen,
    onClose: nftOnPledgeModalClose,
  } = useDisclosure();

  // 授权NFT
  const [pledgedNftCount, setPledgedNftCount] = useState('');
  const [pledgedDgcCount, setPledgedDgcCount] = useState('');
  const [machineId, setMachineId] = useState('');
  return (
    <>
      <Button onClick={nftOnPledgeModalOpen} size="sm" colorScheme="blue" variant="outline" w="fit-content">
        Stake NFT or DGC
      </Button>

      <Modal isOpen={nftIsPledgeModalOpen} onClose={nftOnPledgeModalClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="lg">Stake NFT Nodes</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mb={4} size="sm">
              <FormLabel fontSize="sm">Number of NFTs to Stake:</FormLabel>
              <Input
                value={pledgedNftCount}
                onChange={(e: any) => setPledgedNftCount(e.target.value)}
                placeholder="Enter the number of NFTs to stake"
                size="sm"
              />
              <FormHelperText fontSize="xs">Please enter a number of NFTs between 1 and 11</FormHelperText>
            </FormControl>
            <FormControl mb={4} size="sm">
              <FormLabel fontSize="sm">Amount of DGC to Stake:</FormLabel>
              <Input
                value={pledgedDgcCount}
                onChange={(e: any) => setPledgedDgcCount(e.target.value)}
                placeholder="Enter the amount of DGC to stake"
                size="sm"
              />
            </FormControl>

            <FormControl mb={4} size="sm">
              <FormLabel fontSize="sm">Docker ID:</FormLabel>
              <Input
                value={machineId}
                onChange={(e: any) => setMachineId(e.target.value)}
                placeholder="Enter your Docker ID"
                size="sm"
              />
            </FormControl>

            <Button colorScheme="blue" width="full" size="sm">
              Submit
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default StakeNftOrDgc;
