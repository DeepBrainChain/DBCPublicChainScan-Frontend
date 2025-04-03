import { Box, Flex, Text, List, ListItem } from '@chakra-ui/react';
import React, { useState } from 'react';
import LinkExternal from '../../shared/LinkExternal';
import PledgeNftAndDgc from './modules/PledgeNftAndDgc';
import { useTranslation } from 'next-i18next';
const FixedComponent = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <Box mb={4}>
        <Text color="gray.600">{t('deep_long_term_rental_note')}</Text>
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
          <Box>
            <Text mb={2}>{t('deep_rent_own_machine_until_andromeda_end_1')}</Text>
            <Text mb={2}>
              {t('deep_rent_own_machine_until_andromeda_end_2')}:{' '}
              <LinkExternal href="https://deepbrainchain.github.io/DBC-Wiki/install-update-dbc-node/install-update-dbc/dbc-bare-metal-node.html">
                https://deepbrainchain.github.io/DBC-Wiki/install-update-dbc-node/install-update-dbc/dbc-bare-metal-node.html
              </LinkExternal>
            </Text>
          </Box>
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
          <Box>
            <Text mb={2}>{t('deep_login_to_rented_gpu_vm')}</Text>

            <Text>
              {t('deep_install_dbc_worker_node')}:{' '}
              <LinkExternal href="https://deepbrainchain.github.io/DBC-Wiki/onchain-guide/rent-machine.html">
                https://deepbrainchain.github.io/DBC-Wiki/onchain-guide/rent-machine.html
              </LinkExternal>
            </Text>
          </Box>
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
          <Box>
            <Text mb={4}>{t('deep_download_ai_container_image')}</Text>
            <Flex direction="column" gap={4}>
              <List as="ol">
                <Flex gap="5" direction="column">
                  <ListItem>
                    <Text fontSize="sm">
                      (1)&nbsp; &nbsp;{t('deep_start_decentralgpt_ai_model_container')}:
                      <LinkExternal href="https://github.com/DeepBrainChain/AIComputingNode">
                        https://github.com/DeepBrainChain/AIComputingNode
                      </LinkExternal>
                    </Text>
                  </ListItem>

                  <ListItem>
                    <Text fontSize="sm">
                      (2)&nbsp; &nbsp;{t('deep_view_decentralgpt_network_machine_info')}:
                      <LinkExternal href="https://and.decentralgpt.org/rule">xxxxxx</LinkExternal>
                    </Text>
                  </ListItem>
                  <ListItem>
                    <Text fontSize="sm">
                      (3)&nbsp; &nbsp;{t('deep_installation_documentation')}:
                      <LinkExternal href="https://and.decentralgpt.org/rule">xxxxxx</LinkExternal>
                    </Text>
                  </ListItem>
                  <ListItem>
                    <Text fontSize="sm">
                      (4)&nbsp; &nbsp;
                      <PledgeNftAndDgc />
                    </Text>
                  </ListItem>

                  <ListItem>
                    <Text fontSize="sm">
                      (5)&nbsp; &nbsp;{t('deep_download_address')}:{' '}
                      <LinkExternal href="https://and.decentralgpt.org/calc">
                        https://and.decentralgpt.org/calc
                      </LinkExternal>
                    </Text>
                  </ListItem>
                </Flex>
              </List>
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </>
  );
};

export default FixedComponent;
