import {
  Box,
  HStack,
  Skeleton,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'next-i18next';

import useApiQuery from 'lib/api/useApiQuery';

interface Props {
  address: string;
}

interface NativeToken {
  symbol: string;
  decimals: number;
  balance: string;
  lock: string;
  reserved: string;
  bonded: string;
  unbonding: string;
  democracy_lock: string;
  conviction_lock: string;
  label: Array<string>;
  price: string;
}

interface SubstrateAccountPayload {
  address?: string;
  substrate_address?: string;
  evm_address?: string;
  account_display?: {
    address?: string;
    evm_address?: string;
    display?: string;
    identity?: boolean;
  };
  native_tokens?: Array<NativeToken>;
  nativeTokens?: Array<NativeToken>;
  native?: Array<NativeToken>;
}

const formatBalance = (raw: string, decimals: number): string => {
  const value = Number(raw) / Math.pow(10, decimals);

  if (value === 0) return '0';
  if (value < 0.001) return value.toExponential(4);

  return value.toLocaleString(undefined, { maximumFractionDigits: 4 });
};

const AddressSubstrateIdentity: React.FC<Props> = ({ address }) => {
  const { t } = useTranslation('common');
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const labelColor = useColorModeValue('gray.600', 'gray.400');

  const { data, isPlaceholderData } = useApiQuery('substrate_account' as any, {
    pathParams: { id: address },
    queryOptions: { enabled: Boolean(address) },
  });

  const payload = Array.isArray(data) ? (data[0] as SubstrateAccountPayload | undefined) : undefined;

  const nativeTokens = Array.isArray(payload?.native_tokens)
    ? payload.native_tokens
    : Array.isArray(payload?.nativeTokens)
      ? payload.nativeTokens
      : Array.isArray(payload?.native)
        ? payload.native
        : Array.isArray(data)
          ? (data as Array<NativeToken>)
          : [];

  const native = nativeTokens.find((token) => token.symbol === 'DBC') || nativeTokens[0];
  const decimals = native?.decimals ?? 15;

  const substrateAddress = payload?.account_display?.address || payload?.substrate_address || payload?.address;
  const evmAddress = payload?.account_display?.evm_address || payload?.evm_address || address;
  const showSubstrateAddress = Boolean(
    substrateAddress && evmAddress && substrateAddress.toLowerCase() !== evmAddress.toLowerCase(),
  );

  const items = [
    ...(showSubstrateAddress
      ? [{
        label: t('substrate_address', { defaultValue: 'DBC Mainchain Address' }),
        value: substrateAddress as string,
      }]
      : []),
    {
      label: t('substrate_balance', { defaultValue: 'Balance' }),
      value: native ? `${formatBalance(native.balance, decimals)} ${native.symbol}` : '—',
    },
    {
      label: t('substrate_locked', { defaultValue: 'Locked' }),
      value: native ? `${formatBalance(native.lock, decimals)} ${native.symbol}` : '—',
    },
    {
      label: t('substrate_reserved', { defaultValue: 'Reserved' }),
      value: native ? `${formatBalance(native.reserved, decimals)} ${native.symbol}` : '—',
    },
    {
      label: t('substrate_bonded', { defaultValue: 'Bonded' }),
      value: native ? `${formatBalance(native.bonded, decimals)} ${native.symbol}` : '—',
    },
    {
      label: t('substrate_unbonding', { defaultValue: 'Unbonding' }),
      value: native ? `${formatBalance(native.unbonding, decimals)} ${native.symbol}` : '—',
    },
  ];

  return (
    <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } p={ 4 }>
      <Text fontWeight="bold" mb={ 3 }>
        { t('substrate_identity_title', { defaultValue: 'DBC Mainchain Account Info' }) }
      </Text>

      {!native && !isPlaceholderData ? (
        <Text fontSize="sm" color={ labelColor }>
          { t('substrate_identity_empty', { defaultValue: 'No DBC mainchain identity data' }) }
        </Text>
      ) : (
        <VStack align="stretch" spacing={ 2 }>
          { items.map((item) => (
            <HStack key={ item.label } justify="space-between" align="start" spacing={ 4 }>
              <Text fontSize="sm" color={ labelColor }>{ item.label }</Text>
              <Skeleton isLoaded={ !isPlaceholderData }>
                <Text fontSize="sm" fontWeight="medium" textAlign="right" wordBreak="break-all">
                  { item.value }
                </Text>
              </Skeleton>
            </HStack>
          )) }
        </VStack>
      )}
    </Box>
  );
};

export default AddressSubstrateIdentity;
