import {
  Box,
  HStack,
  IconButton,
  Skeleton,
  Text,
  Tooltip,
  useClipboard,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'next-i18next';

import IconSvg from 'ui/shared/IconSvg';
import RoleBadge from './RoleBadge';

interface Props {
  address: string;
  displayName?: string;
  hasIdentity?: boolean;
  roles?: Array<string>;
  balance?: string;
  isLoading?: boolean;
}

const truncateAddress = (addr: string) => {
  if (!addr) return '';
  if (addr.length <= 18) return addr;

  return `${addr.slice(0, 10)}...${addr.slice(-8)}`;
};

const AccountIdentity = ({
  address,
  displayName,
  hasIdentity = false,
  roles = [],
  balance,
  isLoading = false,
}: Props) => {
  const { t } = useTranslation('common');
  const { hasCopied, onCopy } = useClipboard(address || '', 1000);
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } p={ 4 }>
      <VStack align="stretch" spacing={ 3 }>
        <Box>
          <Text fontSize="xs" color={ secondaryTextColor } mb={ 1 }>{ t('address') }</Text>
          <HStack spacing={ 2 }>
            <Skeleton isLoaded={ !isLoading }>
              <Text fontWeight="medium" fontFamily="mono">{ truncateAddress(address) || '—' }</Text>
            </Skeleton>
            <Tooltip label={ hasCopied ? t('copied', { defaultValue: 'Copied' }) : t('copy_to_clipboard', { defaultValue: 'Copy to clipboard' }) }>
              <Skeleton isLoaded={ !isLoading }>
                <IconButton
                  aria-label={ t('copy', { defaultValue: 'Copy' }) }
                  icon={ <IconSvg name="copy" boxSize={ 4 }/> }
                  size="xs"
                  variant="ghost"
                  onClick={ onCopy }
                  isDisabled={ !address }
                />
              </Skeleton>
            </Tooltip>
          </HStack>
        </Box>

        { (displayName || hasIdentity) && (
          <Box>
            <Text fontSize="xs" color={ secondaryTextColor } mb={ 1 }>{ t('display_name', { defaultValue: 'Display name' }) }</Text>
            <HStack spacing={ 2 }>
              <Skeleton isLoaded={ !isLoading }>
                <Text fontWeight="semibold">{ displayName || t('unavailable', { defaultValue: 'Unavailable' }) }</Text>
              </Skeleton>
              { hasIdentity && (
                <Skeleton isLoaded={ !isLoading }>
                  <Tooltip label={ t('on_chain_identity_verified', { defaultValue: 'On-chain identity verified' }) }>
                    <Box as="span" display="inline-flex" alignItems="center">
                      <IconSvg name="verified_token" boxSize={ 4 } color="green.500"/>
                    </Box>
                  </Tooltip>
                </Skeleton>
              ) }
            </HStack>
          </Box>
        ) }

        { roles.length > 0 && (
          <Box>
            <Text fontSize="xs" color={ secondaryTextColor } mb={ 1 }>{ t('roles', { defaultValue: 'Roles' }) }</Text>
            <Skeleton isLoaded={ !isLoading }>
              <RoleBadge roles={ roles } size="sm"/>
            </Skeleton>
          </Box>
        ) }

        { typeof balance === 'string' && (
          <Box>
            <Text fontSize="xs" color={ secondaryTextColor } mb={ 1 }>{ t('balance') }</Text>
            <Skeleton isLoaded={ !isLoading }>
              <Text fontWeight="semibold">{ balance }</Text>
            </Skeleton>
          </Box>
        ) }
      </VStack>
    </Box>
  );
};

export default AccountIdentity;
