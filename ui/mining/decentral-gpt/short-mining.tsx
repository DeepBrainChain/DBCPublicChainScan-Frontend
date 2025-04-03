import { Box, Flex, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import LinkExternal from '../../shared/LinkExternal';
import { useTranslation } from 'next-i18next';
import PledgeDbc from './modules/PledgeDbc';
import PledgeNftAndDgc from './modules/PledgeNftAndDgc';

const FixedComponent = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <Box mb={4}>
        <Text color="gray.600">{t('deep2_free_mode_note')}</Text>
      </Box>
      <Flex direction="column" gap={6}>
        <Flex gap={4}>
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
          <Text mb={2}>
            {t('deep2_install_dbc_worker_node_first')}:
            <LinkExternal href="https://deepbrainchain.github.io/DBC-Wiki/install-update-dbc-node/install-update-dbc/dbc-bare-metal-node.html">
              xxxxx
            </LinkExternal>
            , {t('deep2_obtain_machine_id_and_private_key')}.
          </Text>
        </Flex>
        <Flex gap={4}>
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
          <Text mb={2}>
            {t('deep2_download_ai_container_image')}:{' '}
            <LinkExternal href="https://deepbrainchain.github.io/DBC-Wiki/install-update-dbc-node/install-update-dbc/dbc-bare-metal-node.html">
              xxxxx
            </LinkExternal>
          </Text>
        </Flex>
        <Flex gap={4}>
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
          <Text mb={2}>
            {t('deep2_start_decentralgpt_ai_model_container')}:{' '}
            <LinkExternal href="https://deepbrainchain.github.io/DBC-Wiki/install-update-dbc-node/install-update-dbc/dbc-bare-metal-node.html">
              xxxxx
            </LinkExternal>
          </Text>
        </Flex>
        <Flex gap={4}>
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
            4
          </Box>
          <PledgeDbc />
        </Flex>
        <Flex gap={4}>
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
            5
          </Box>
          <PledgeNftAndDgc />
        </Flex>

        <Flex gap={4}>
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
            7
          </Box>
          <Flex gap="4">
            <Text>{t('deep2_view_decentralgpt_network_machine_info')}</Text>
            <LinkExternal href="https://and.decentralgpt.org/calc">https://and.decentralgpt.org/calc</LinkExternal>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default FixedComponent;
