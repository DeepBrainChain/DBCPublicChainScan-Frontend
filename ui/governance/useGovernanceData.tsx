import useApiQuery from 'lib/api/useApiQuery';

import type {
  GovernanceOverview,
  DemocracyProposalsResponse,
  CouncilMotionsResponse,
  TreasuryProposalsResponse,
} from 'types/api/governance';

const GOVERNANCE_OVERVIEW_PLACEHOLDER: GovernanceOverview = {
  democracy_proposal_count: 0,
  referendum_count: 0,
  council_motion_count: 0,
  treasury_proposal_count: 0,
  bounty_count: 0,
};

const DEMOCRACY_PROPOSALS_PLACEHOLDER: DemocracyProposalsResponse = {
  items: [],
  next_page_params: null,
};

const COUNCIL_MOTIONS_PLACEHOLDER: CouncilMotionsResponse = {
  items: [],
  next_page_params: null,
};

const TREASURY_PROPOSALS_PLACEHOLDER: TreasuryProposalsResponse = {
  items: [],
  next_page_params: null,
};

export default function useGovernanceData() {
  const overviewQuery = useApiQuery('governance_overview', {
    queryOptions: {
      placeholderData: GOVERNANCE_OVERVIEW_PLACEHOLDER,
      refetchInterval: 60000,
    },
  });

  const democracyProposalsQuery = useApiQuery('governance_democracy_proposals', {
    queryOptions: {
      placeholderData: DEMOCRACY_PROPOSALS_PLACEHOLDER,
      refetchInterval: 60000,
    },
  });

  const councilMotionsQuery = useApiQuery('governance_council_motions', {
    queryOptions: {
      placeholderData: COUNCIL_MOTIONS_PLACEHOLDER,
      refetchInterval: 60000,
    },
  });

  const treasuryProposalsQuery = useApiQuery('governance_treasury_proposals', {
    queryOptions: {
      placeholderData: TREASURY_PROPOSALS_PLACEHOLDER,
      refetchInterval: 60000,
    },
  });

  return {
    overview: overviewQuery,
    democracyProposals: democracyProposalsQuery,
    councilMotions: councilMotionsQuery,
    treasuryProposals: treasuryProposalsQuery,
  };
}
