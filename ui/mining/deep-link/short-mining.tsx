import { Box, Text, Flex } from '@chakra-ui/react';
import React, { useEffect } from 'react';

import LinkExternal from '../../shared/LinkExternal';
import { useTranslation } from 'next-i18next';
import { FaArrowRight } from 'react-icons/fa';

const FixedComponent = () => {
  const { t } = useTranslation('common');

  return (
    <div>
      <Box mb={4}>
        <Text color="gray.600">
          {t('short-rental-requirements')}
          <LinkExternal href="https://orion.deeplink.cloud/shortterm">
            https://orion.deeplink.cloud/shortterm
          </LinkExternal>
        </Text>
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
          <Text mb={2}>
            {t('deeplink-download-instruction')}{' '}
            <LinkExternal href="https://www.deeplink.cloud/software">https://www.deeplink.cloud/software</LinkExternal>
          </Text>
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

          <Text mb={2}>{t('create-wallet')}</Text>
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
          <Text mb={2} className="flex items-center">
            {t('click-on-cloud-computer')} <FaArrowRight style={{ margin: '0 8px' }} />
            {t('my-computer')} <FaArrowRight style={{ margin: '0 8px' }} />
            {t('add-machine')}
          </Text>
        </div>
      </Flex>
    </div>
  );
};

export default FixedComponent;
