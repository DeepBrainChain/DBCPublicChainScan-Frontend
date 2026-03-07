import useApiQuery from 'lib/api/useApiQuery';
import type { TokenDistribution } from 'types/api/token';

interface TokenInfo {
  symbol: string;
  price: string;
  price_change: string;
  total_issuance: string;
  available_balance: string;
  locked_balance: string;
  validator_bonded: string;
  nominator_bonded: string;
  treasury_balance: string;
  inflation: string;
  token_decimals: number;
}

export type { TokenDistribution };

const TOKEN_INFO_PLACEHOLDER: TokenInfo = {
  symbol: 'DBC',
  price: '0',
  price_change: '0',
  total_issuance: '0',
  available_balance: '0',
  locked_balance: '0',
  validator_bonded: '0',
  nominator_bonded: '0',
  treasury_balance: '0',
  inflation: '0',
  token_decimals: 15,
};

const TOKEN_DISTRIBUTION_PLACEHOLDER: TokenDistribution = {
  total_issuance: '0',
  available_balance: '0',
  staking_locked: '0',
  treasury_balance: '0',
  other_locked: '0',
};

export default function useTokenData() {
  const infoQuery = useApiQuery('token_info', {
    queryOptions: {
      placeholderData: TOKEN_INFO_PLACEHOLDER,
      refetchInterval: 60000,
    },
  });

  const distributionQuery = useApiQuery('token_distribution', {
    queryOptions: {
      placeholderData: TOKEN_DISTRIBUTION_PLACEHOLDER,
      refetchInterval: 60000,
    },
  });

  return {
    info: {
      ...infoQuery,
      data: infoQuery.data as TokenInfo | undefined,
    },
    distribution: {
      ...distributionQuery,
      data: distributionQuery.data as TokenDistribution | undefined,
    },
  };
}
