export interface StakingOverview {
  total_staked: string;
  validator_count: number;
  active_validator_count: number;
  nominator_count: number;
  inflation_rate: string;
  current_era: number;
  current_epoch: number;
  era_progress: number;
  epoch_progress: number;
  era_length: number;
  epoch_length: number;
  unbonding_period: number;
}

export interface StakingValidator {
  address: string;
  name: string;
  total_stake: string;
  own_stake: string;
  nominator_count: number;
  commission: string;
  is_active: boolean;
  era_points: number;
}

export interface StakingValidatorsResponse {
  items: Array<StakingValidator>;
  next_page_params: {
    page: number;
  } | null;
}

export interface TokenDistribution {
  transferable: string;
  staking: string;
  treasury: string;
  others: string;
  total_issuance: string;
}
