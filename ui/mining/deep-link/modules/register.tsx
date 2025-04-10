import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Flex,
  Button,
  useToast,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Modal,
  useDisclosure,
  HStack,
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { useContractActions } from '../hooks/stake-before';
import { MdInfoOutline } from 'react-icons/md'; // 使用 react-icons 的信息图标

function registerC() {
  const { t } = useTranslation('common');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [machineId, setMachineId] = useState('');
  const [loading, setLoading] = useState({
    is: false,
    text: '',
  });
  const { register } = useContractActions(machineId);
  const toast = useToast();

  // 点击开始注册
  const startRegister = async () => {
    console.log(666666);
    if (machineId === '') return;
    setLoading({
      is: true,
      text: t('register_in_progress'),
    });
    const res: any = await register();
    if (res.code !== 0) {
      toast({
        position: 'top',
        title: t('failed'),
        status: 'error',
        description: res.message || t('operation_failed'),
        isClosable: true,
        duration: 5000,
      });
      setLoading({
        is: false,
        text: t('register_start'),
      });
    } else {
      toast({
        position: 'top',
        title: t('register_success'),
        description: t('register_congrats_success'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    }
    setLoading({
      is: false,
      text: t('register_start'),
    });
  };
  return (
    <>
      <Box p={4} borderRadius="md" border="1px">
        <HStack spacing={3} align="start">
          <Box>
            <div className={'flex flex-col gap-2'}>
              <Text fontWeight="bold" color="yellow.500">
                <div className={'flex gap-2 items-center'}>
                  <MdInfoOutline size="20px" color="#D69E2E" /> <span>{t('register_important_notice')}：</span>
                </div>
              </Text>
              <Text lineHeight={8}>
                {t('register_before_staking_notice')}：{' '}
                <Button onClick={onOpen} colorScheme="blue" variant="outline" w="fit-content" size="sm">
                  {t('register_machine')}
                </Button>
              </Text>
            </div>
          </Box>
        </HStack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="lg">{t('register_machine')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <div className="flex flex-col gap-4">
              <FormControl mb={4} size="sm">
                <FormLabel fontSize="sm">{t('machine-id')}</FormLabel>
                <Input
                  value={machineId}
                  onChange={(e: any) => setMachineId(e.target.value)}
                  placeholder={t('input-machine-id')}
                  size="sm"
                />
              </FormControl>

              <Button
                isLoading={loading.is}
                loadingText={loading.text}
                onClick={startRegister}
                colorScheme="blue"
                width="full"
              >
                {t('register_start')}
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default registerC;
