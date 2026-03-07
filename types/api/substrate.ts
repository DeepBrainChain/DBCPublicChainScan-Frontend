export interface SubstrateExtrinsic {
  id: number;
  block_num: number;
  block_timestamp: number;
  extrinsic_index: string;
  call_module_function: string;
  call_module: string;
  nonce: number;
  extrinsic_hash: string;
  success: boolean;
  fee: string;
  fee_used: string;
  tip: string;
  finalized: boolean;
  account_display: {
    address: string;
    evm_address?: string;
    display?: string;
    identity?: boolean;
  };
}

export interface SubstrateExtrinsicsResponse {
  items: Array<SubstrateExtrinsic>;
  total_count: number;
  next_page_params: null;
}

export interface SubstrateExtrinsicDetail {
  block_timestamp: number;
  block_num: number;
  extrinsic_index: string;
  call_module_function: string;
  call_module: string;
  account_id: string;
  signature: string;
  nonce: number;
  extrinsic_hash: string;
  success: boolean;
  params: Array<{ name: string; type: string; type_name: string; value: any }>;
  transfer: { from: string; to: string; module: string; amount: string; success: boolean } | null;
  event: Array<{
    event_index: string;
    block_num: number;
    extrinsic_idx: number;
    module_id: string;
    event_id: string;
    params: string;
    phase: number;
    event_idx: number;
    extrinsic_hash: string;
    finalized: boolean;
    block_timestamp: number;
  }>;
  event_count: number;
  fee: string;
  fee_used: string;
  error: any;
  finalized: boolean;
  lifetime: any;
  tip: string;
  account_display: { address: string; display?: string; identity?: boolean };
  block_hash: string;
}

export interface SubstrateEvent {
  id: number;
  block_timestamp: number;
  event_index: string;
  extrinsic_index: string;
  phase: number;
  module_id: string;
  event_id: string;
  extrinsic_hash: string;
  finalized: boolean;
}

export interface SubstrateEventsResponse {
  items: Array<SubstrateEvent>;
  total_count: number;
  next_page_params: null;
}

export interface SubstrateEventDetail {
  id: number;
  event_index: string;
  block_num: number;
  extrinsic_idx: number;
  module_id: string;
  event_id: string;
  params: Array<{ type: string; type_name: string; value: any; name: string }>;
  extrinsic_hash: string;
  event_idx: number;
  finalized: boolean;
  phase: number;
}

export interface SubstrateTransfer {
  transfer_id: string;
  from: string;
  to: string;
  extrinsic_index: string;
  success: boolean;
  hash: string;
  block_num: number;
  block_timestamp: number;
  module: string;
  amount: string;
  amount_v2: string;
  fee: string;
  nonce: number;
  asset_symbol: string;
  from_account_display: { address: string; evm_address?: string; display?: string };
  to_account_display: { address: string; evm_address?: string; display?: string };
}

export interface SubstrateTransfersResponse {
  items: Array<SubstrateTransfer>;
  total_count: number;
  next_page_params: null;
}

export interface SubstrateAccount {
  address: string;
  balance: string;
  lock: string;
  balance_lock: string;
  is_evm_contract: boolean;
  account_display: { address: string; display?: string; identity?: boolean };
  count_extrinsic: number;
  nft_amount: number;
}

export interface SubstrateAccountsResponse {
  items: Array<SubstrateAccount>;
  total_count: number;
  next_page_params: null;
}
