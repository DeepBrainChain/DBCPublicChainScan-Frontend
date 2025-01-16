import type CspDev from 'csp-dev';

import config from 'configs/app';

import { KEY_WORDS } from '../utils';


export function walletConnect(): CspDev.DirectiveDescriptor {
  if (!config.features.blockchainInteraction.isEnabled) {
    return {};
  }

  return {
    'connect-src': [
      '*.web3modal.com',
      '*.walletconnect.com',
      'wss://relay.walletconnect.com',
      'wss://www.walletlink.org',
      'https://api.web3modal.org',
      'https://rpc.walletconnect.org',
    ],
    'frame-ancestors': [
      '*.walletconnect.org',
      '*.walletconnect.com',
      'http://localhost:*',
      'https://*.dbcscan.io',  // 添加测试环境域名
      'https://test.dbcscan.io'  // 明确指定测试环境域名
    ],
    'img-src': [
      KEY_WORDS.BLOB,
      '*.walletconnect.com',
    ],
  };
}
