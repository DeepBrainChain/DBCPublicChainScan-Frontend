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
      "'self'",  // 必须添加
      '*.walletconnect.org',
      '*.walletconnect.com',
      'http://localhost:*',
      'https://*.dbcscan.io',
      'https://test.dbcscan.io',
      'https://*.pages.dev',
      'https://*.vercel.app',
      'https://*.ngrok-free.app',
      'https://secure-mobile.walletconnect.com',
      'https://secure-mobile.walletconnect.org'
    ],
    'frame-src': [  // 添加 frame-src
      "'self'",
      'https://secure.walletconnect.com',
      '*.walletconnect.com',
      '*.walletconnect.org'
    ],
    'img-src': [
      KEY_WORDS.BLOB,
      '*.walletconnect.com',
    ],
  };
}