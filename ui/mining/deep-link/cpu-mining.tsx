import { Box, Text, Flex } from '@chakra-ui/react';
import React, { useEffect } from 'react';

import LinkExternal from '../../shared/LinkExternal';
import { useTranslation } from 'next-i18next';
import CpuStakeDbcBtn from './modules/cpu-stake-dbc-btn';
import CpuStakeNftBtn from './modules/cup-stake-nft-node-btn';
import CpuStakeDlcBtn from './modules/cup-stake-dlc-btn';
import { useRouter } from 'next/router';
import { getEnvValue } from '../../../configs/app/utils';
import Register from './modules/register';
const FixedComponent = () => {
  const { t, i18n } = useTranslation('common');
  const link = getEnvValue('NEXT_PUBLIC_API_URL') || 'https://dbcscan.io/gpumachine'; // 默认值可选
  const router = useRouter();

  return (
    <>
      <Box mb={4}>
        <Text color="gray.600">{t('cpu-mining-requirements')}</Text>
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
            {t('deeplink-installation-instruction')}:
            <LinkExternal
              href={
                i18n.language === 'zh'
                  ? 'https://www.deeplink.cloud/blogInfo?id=67dc095f362d9795b3698494'
                  : 'https://www.deeplink.cloud/blogInfo?id=67dc0a9b362d9795b3698e51'
              }
            >
              {i18n.language === 'zh'
                ? 'https://www.deeplink.cloud/blogInfo?id=67dc095f362d9795b3698494'
                : 'https://www.deeplink.cloud/blogInfo?id=67dc0a9b362d9795b3698e51'}
            </LinkExternal>
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

          <Flex direction="column" gap={4} wrap={'wrap'}>
            <Text mb={2}> {t('deeplink-network')}:</Text>
            <Register />
            <CpuStakeDbcBtn />
            <CpuStakeNftBtn />
            <div className="flex items-center gap-6 flex-wrap">
              <CpuStakeDlcBtn />
              <Text>
                {t('staking-rewards-rule')}
                <LinkExternal href=" https://www.deeplink.cloud/bandWidth">
                  https://www.deeplink.cloud/bandWidth
                </LinkExternal>
              </Text>
            </div>
          </Flex>
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
          <Text mb={2}>
            <Text>
              {t('deeplink-network-machine-info')}:
              <LinkExternal onClick={() => router.push(`/gpumachine`)} className="ml-6">
                {link}
              </LinkExternal>
            </Text>
          </Text>
        </div>
      </Flex>
    </>
  );
};

export default FixedComponent;
