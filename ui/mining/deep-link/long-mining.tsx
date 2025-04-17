import {
  Box,
  Button,
  useToast,
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
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import LinkExternal from '../../shared/LinkExternal';
import { useRouter } from 'next/router';
import { getEnvValue } from '../../../configs/app/utils';
import LongNftStake from './modules/long-stake/LongNftStake';
import LongDlcStake from './modules/long-stake/LongDlcStake';

const FixedComponent = () => {
  const { t } = useTranslation('common');

  const router = useRouter();

  return (
    <div>
      <Box mb={4}>
        <Text color="gray.600">{t('long-rental-requirements')}</Text>
      </Box>
      <Flex direction="column" gap={6}>
        <div className="flex gap-4 flex-wrap md:flex-nowrap">
          <Box
            w="24px"
            h="24px"
            borderRadius="full"
            bg="blue.500"
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            1
          </Box>
          <Box>
            <Text mb={2}>{t('add-gpu-to-dbc-network')}</Text>
            <Text mb={2}>
              {t('reference-document')}:
              <LinkExternal href="https://deepbrainchain.github.io/DBC-Wiki/onchain-guide/bonding-machine.html">
                https://deepbrainchain.github.io/DBC-Wiki/onchain-guide/bonding-machine.html
              </LinkExternal>
            </Text>
          </Box>
        </div>

        <div className="flex gap-4 flex-wrap md:flex-nowrap">
          <Box
            w="24px"
            h="24px"
            borderRadius="full"
            bg="blue.500"
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            2
          </Box>
          <Box>
            <Text mb={2}>{t('machine-rent-down')}</Text>
            <Text mb={2}>
              {t('view-competition-info')}:
              <LinkExternal href="https://orion.deeplink.cloud">https://orion.deeplink.cloud</LinkExternal>
            </Text>
            <Text>
              {t('reference-document')}:
              <LinkExternal href="https://deepbrainchain.github.io/DBC-Wiki/onchain-guide/rent-machine.html">
                https://deepbrainchain.github.io/DBC-Wiki/onchain-guide/rent-machine.html
              </LinkExternal>
            </Text>
          </Box>
        </div>

        <div className="flex gap-4 flex-wrap md:flex-nowrap">
          <Box
            w="24px"
            h="24px"
            borderRadius="full"
            bg="blue.500"
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            3
          </Box>
          <Box>
            <Text mb={4}>{t('add-rented-gpu-to-deeplink')}</Text>
            <Flex direction="column" gap={4}>
              {/* 长租质押NFT */}
              <LongNftStake />
              {/* 长租质押DLC */}

              <LongDlcStake />
              <Text color="gray.600" fontSize="sm">
                {t('skip-dlc-pledge')}:
                <LinkExternal href="https://orion.deeplink.cloud/longterm">
                  https://orion.deeplink.cloud/longterm
                </LinkExternal>
              </Text>
              <Text mt={2}>
                {t('view-deeplink-machine-info')}:
                <LinkExternal href="https://orion.deeplink.cloud/device">
                  https://orion.deeplink.cloud/device
                </LinkExternal>
                <LinkExternal onClick={() => router.push(`/mymachine`)}>
                  {t('deep_or_click_here_to_view')}：
                  {`https://${getEnvValue('NEXT_PUBLIC_API_HOST') || 'www.dbcscan.io'}/mymachine`}
                </LinkExternal>
              </Text>
            </Flex>
          </Box>
        </div>
      </Flex>
    </div>
  );
};

export default FixedComponent;
