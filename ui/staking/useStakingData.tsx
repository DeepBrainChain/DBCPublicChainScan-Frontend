import useApiQuery from 'lib/api/useApiQuery';

import type { StakingOverview, StakingValidatorsResponse } from 'types/api/staking';

const STAKING_OVERVIEW_PLACEHOLDER: StakingOverview = {
  total_staked: '0',
  validator_count: 0,
  active_validator_count: 0,
  nominator_count: 0,
  inflation_rate: '0',
  current_era: 0,
  current_epoch: 0,
  era_progress: 0,
  epoch_progress: 0,
  era_length: 14400,
  epoch_length: 2400,
  unbonding_period: 0,
};

const VALIDATORS_PLACEHOLDER: StakingValidatorsResponse = {
  items: [],
  next_page_params: null,
};

export default function useStakingData() {
  const overviewQuery = useApiQuery('staking_overview', {
    queryOptions: {
      placeholderData: STAKING_OVERVIEW_PLACEHOLDER,
      refetchInterval: 30000,
    },
  });

  const validatorsQuery = useApiQuery('staking_validators', {
    queryOptions: {
      placeholderData: VALIDATORS_PLACEHOLDER,
    },
  });

  return {
    overview: overviewQuery,
    validators: validatorsQuery,
  };
}
