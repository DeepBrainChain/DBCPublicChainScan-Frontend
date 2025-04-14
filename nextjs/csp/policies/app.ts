import type CspDev from 'csp-dev';

import { getFeaturePayload } from 'configs/app/features/types';

import config from 'configs/app';

import { KEY_WORDS } from '../utils';

const MAIN_DOMAINS = [`*.${config.app.host}`, config.app.host].filter(Boolean);

const getCspReportUrl = () => {
  try {
    const sentryFeature = config.features.sentry;
    if (!sentryFeature.isEnabled || !process.env.SENTRY_CSP_REPORT_URI) {
      return;
    }

    const url = new URL(process.env.SENTRY_CSP_REPORT_URI);

    // https://docs.sentry.io/product/security-policy-reporting/#additional-configuration
    url.searchParams.set('sentry_environment', sentryFeature.environment);
    sentryFeature.release && url.searchParams.set('sentry_release', sentryFeature.release);

    return url.toString();
  } catch (error) {
    return;
  }
};

export function app(): CspDev.DirectiveDescriptor {
  const marketplaceFeaturePayload = getFeaturePayload(config.features.marketplace);

  return {
    'default-src': [
      // KEY_WORDS.NONE,
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1242902
      // need 'self' here to avoid an error with prefetch nextjs chunks in firefox
      KEY_WORDS.SELF,
    ],

    'connect-src': [
      KEY_WORDS.SELF,
      ...MAIN_DOMAINS,

      // webpack hmr in safari doesn't recognize localhost as 'self' for some reason
      config.app.isDev ? 'ws://localhost:3000/_next/webpack-hmr' : '',
      config.app.isDev ? 'http://localhost:3001' : 'http://8.214.55.62:3001',
      'https://dbchaininfo.congtu.cloud/',
      'wss://testnet.dbcscan.io',
      '*.walletconnect.com', // 通配符支持所有 .com 子域
      '*.walletconnect.org',
      'wss://relay.walletconnect.com', // 保留 .com
      'wss://relay.walletconnect.org',
      'https://rpc.walletconnect.com',
      'https://rpc.dbcwallet.io', // 新增
      'https://health0.deepbrainchain.org',
      'https://health-test.deepbrainchain.org',
      'https://secure.walletconnect.com',

      'https://dbcswap.io',
      'https://www.dbcswap.io',
      'http://54.179.233.88:8032',
      // APIs
      config.api.endpoint,
      config.api.socket,
      getFeaturePayload(config.features.stats)?.api.endpoint,
      getFeaturePayload(config.features.sol2uml)?.api.endpoint,
      getFeaturePayload(config.features.verifiedTokens)?.api.endpoint,
      getFeaturePayload(config.features.addressVerification)?.api.endpoint,
      getFeaturePayload(config.features.nameService)?.api.endpoint,
      getFeaturePayload(config.features.addressMetadata)?.api.endpoint,
      marketplaceFeaturePayload && 'api' in marketplaceFeaturePayload ? marketplaceFeaturePayload.api.endpoint : '',

      // chain RPC server
      config.chain.rpcUrl,
      'https://infragrid.v.network', // RPC providers

      // github (spec for api-docs page)
      'raw.githubusercontent.com',
    ].filter(Boolean),

    'script-src': [
      KEY_WORDS.SELF,
      ...MAIN_DOMAINS,

      // next.js generates and rebuilds source maps in dev using eval()
      // https://github.com/vercel/next.js/issues/14221#issuecomment-657258278
      config.app.isDev ? KEY_WORDS.UNSAFE_EVAL : '',

      // hash of ColorModeScript
      "'sha256-e7MRMmTzLsLQvIy1iizO1lXf7VWYoQ6ysj5fuUzvRwE='",
    ],

    'style-src': [
      KEY_WORDS.SELF,
      ...MAIN_DOMAINS,

      // yes, it is unsafe as it stands, but
      // - we cannot use hashes because all styles are generated dynamically
      // - we cannot use nonces since we are not following along SSR path
      // - and still there is very small damage that can be cause by CSS-based XSS-attacks
      // so we hope we are fine here till the first major incident :)
      KEY_WORDS.UNSAFE_INLINE,
    ],

    'img-src': [
      KEY_WORDS.SELF,
      KEY_WORDS.DATA,
      ...MAIN_DOMAINS,

      // we agreed that using wildcard for images is mostly safe
      // why do we have to use it? the main reason is that for NFT and inventory pages we get resources urls from API only on the client
      // so they cannot be added to the policy on the server
      // there could be 3 possible workarounds
      //    a/ use server side rendering approach, that we don't want to do
      //    b/ wrap every image/video in iframe with a source to static page for which we enforce certain img-src rule;
      //        the downsides is page performance slowdown and code complexity (have to manage click on elements, color mode for
      //        embedded page, etc)
      //    c/ use wildcard for img-src directive; this can lead to some security vulnerabilities but we were unable to find evidence
      //        that loose img-src directive alone could cause serious flaws on the site as long as we keep script-src and connect-src strict
      //
      // feel free to propose alternative solution and fix this
      '*',
    ],

    'media-src': [
      '*', // see comment for img-src directive
    ],

    'font-src': [KEY_WORDS.DATA, ...MAIN_DOMAINS],

    'object-src': [KEY_WORDS.NONE],

    'base-uri': [KEY_WORDS.NONE],

    'frame-src': [
      // could be a marketplace app or NFT media (html-page)
      '*',
    ],

    'frame-ancestors': [
      KEY_WORDS.SELF,
      'http://localhost:*',
      'https://*.pages.dev',
      'https://*.vercel.app',
      'https://*.ngrok-free.app',
      'https://secure-mobile.walletconnect.com',
      'https://secure-mobile.walletconnect.org',
      'https://*.dbcscan.io',
      'https://test.dbcscan.io',
      'https://dbcscan.io',
      'https://www.dbcscan.io',
      'https://secure.walletconnect.com',
      'https://testnet.dbcscan.io',
    ],

    ...(() => {
      if (!config.features.sentry.isEnabled) {
        return {};
      }

      return {
        'report-uri': [getCspReportUrl()].filter(Boolean),
      };
    })(),
  };
}
