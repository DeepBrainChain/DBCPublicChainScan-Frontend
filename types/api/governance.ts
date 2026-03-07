export interface GovernanceOverview {
  democracy_proposal_count: number;
  referendum_count: number;
  council_motion_count: number;
  treasury_proposal_count: number;
  bounty_count: number;
}

export interface DemocracyProposal {
  proposal_id: number;
  status: string;
  created_block: number;
  updated_block: number;
  seconds: number;
  call_module: string;
  call_name: string;
  proposer: string;
  member_count: number;
}

export interface DemocracyProposalsResponse {
  items: Array<DemocracyProposal>;
  next_page_params: { page: number } | null;
}

export interface Referendum {
  referendum_index: number;
  status: string;
  created_block: number;
  vote_threshold: string;
  aye_amount: string;
  nay_amount: string;
  turnout: string;
  call_module: string;
  call_name: string;
}

export interface ReferendumsResponse {
  items: Array<Referendum>;
  next_page_params: { page: number } | null;
}

export interface CouncilMotion {
  motion_id: number;
  status: string;
  created_block: number;
  member_threshold: number;
  aye_votes: number;
  nay_votes: number;
  call_module: string;
  call_name: string;
  proposer: string;
}

export interface CouncilMotionsResponse {
  items: Array<CouncilMotion>;
  next_page_params: { page: number } | null;
}

export interface TreasuryProposal {
  proposal_id: number;
  status: string;
  created_block: number;
  proposer: string;
  beneficiary: string;
  value: string;
  bond: string;
}

export interface TreasuryProposalsResponse {
  items: Array<TreasuryProposal>;
  next_page_params: { page: number } | null;
}

export interface CouncilProposalDetail {
  proposal_id: number;
  proposer: string;
  proposer_name: string;
  call_module: string;
  call_name: string;
  params: string;
  proposal_hash: string;
  created_block: number;
  created_at: string;
  status: string;
  aye_votes: number;
  nay_votes: number;
  member_threshold: number;
  executed_success: boolean | null;
  votes: Array<{
    address: string;
    name: string;
    passed: boolean;
    extrinsic_index: string;
    voting_time: string;
  }>;
  timeline: Array<{ block: number; status: string; timestamp: string; extrinsic_index: string }>;
}

export interface DemocracyProposalDetail {
  proposal_id: number;
  proposer: string;
  proposer_name: string;
  call_module: string;
  call_name: string;
  status: string;
  created_block: number;
  created_at: string;
  seconds: number;
  value: string;
  timeline: Array<{ block: number; status: string; timestamp: string; extrinsic_index: string }>;
}

export interface TreasuryProposalDetail {
  proposal_id: number;
  proposer: string;
  proposer_name: string;
  beneficiary: string;
  beneficiary_name: string;
  value: string;
  bond: string;
  status: string;
  created_block: number;
  created_at: string;
  council_id: number;
  timeline: Array<{ block: number; status: string; timestamp: string; extrinsic_index: string }>;
}
