import React, { useState } from 'react';
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
import { useFreeH } from '../../../../lib/hooks/useDecentralGPT/free/useFree';

function PledgeDbc() {
  // dnc
  const {
    isOpen: dbcIsPledgeModalOpen,
    onOpen: dbcOnPledgeModalOpen,
    onClose: dbcOnPledgeModalClose,
  } = useDisclosure();
  const [dbcBtnLoading, setDbcBtnLoading] = useState(false);
  const [pledgedDbcCount, setPledgedDbcCount] = useState('');
  const [dockerId, setDockerId] = useState('');

  return (
    <>
      <Button size="sm" onClick={dbcOnPledgeModalOpen} colorScheme="blue" variant="outline" w="fit-content">
        Pledge DBC
      </Button>
      <Modal isOpen={dbcIsPledgeModalOpen} onClose={dbcOnPledgeModalClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="lg">Stake DBC</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mb={4} size="sm">
              <FormLabel fontSize="sm">Amount of DBC to Stake:</FormLabel>
              <Input
                value={pledgedDbcCount}
                onChange={(e: any) => setPledgedDbcCount(e.target.value)}
                placeholder="Enter the amount of DBC to stake"
                size="sm"
              />
              <FormHelperText fontSize="xs">1000 DBC needs to be staked for each GPU</FormHelperText>
            </FormControl>

            <FormControl mb={6} size="sm">
              <FormLabel fontSize="sm">Docker ID:</FormLabel>
              <Input
                value={dockerId}
                onChange={(e: any) => setDockerId(e.target.value)}
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

export default PledgeDbc;
