import { useRouter } from 'next/router';
import React from 'react';

import type { NavItemInternal, NavItem, NavGroupItem } from 'types/client/navigation-items';

import config from 'configs/app';
import { rightLineArrow } from 'lib/html-entities';
import UserAvatar from 'ui/shared/UserAvatar';
import { useTranslation } from 'next-i18next';

interface ReturnType {
  mainNavItems: Array<NavItem | NavGroupItem>;
  accountNavItems: Array<NavItem>;
  profileItem: NavItem;
}

export function isGroupItem(item: NavItem | NavGroupItem): item is NavGroupItem {
  return 'subItems' in item;
}

export function isInternalItem(item: NavItem): item is NavItemInternal {
  return 'nextRoute' in item;
}

export default function useNavItems(): ReturnType {
  const router = useRouter();
  const pathname = router.pathname;
  const { t, i18n } = useTranslation('common');

  return React.useMemo(() => {
    let blockchainNavItems: Array<NavItem> | Array<Array<NavItem>> = [];

    const topAccounts: NavItem | null = !config.UI.views.address.hiddenViews?.top_accounts
      ? {
          text: t('block_top_accounts'),
          nextRoute: { pathname: '/accounts' as const },
          icon: 'top-accounts',
          isActive: pathname === '/accounts',
        }
      : null;
    const blocks: NavItem | null = {
      text: t('block_blocks'),
      nextRoute: { pathname: '/blocks' as const },
      icon: 'block',
      isActive: pathname === '/blocks' || pathname === '/block/[height_or_hash]',
    };
    const txs: NavItem | null = {
      text: t('block_transactions'),
      nextRoute: { pathname: '/txs' as const },
      icon: 'transactions',
      isActive: pathname === '/txs' || pathname === '/tx/[hash]',
    };
    const userOps: NavItem | null = config.features.userOps.isEnabled
      ? {
          text: t('block_user_operations'),
          nextRoute: { pathname: '/ops' as const },
          icon: 'user_op',
          isActive: pathname === '/ops' || pathname === '/op/[hash]',
        }
      : null;

    const verifiedContracts: NavItem | null = {
      text: t('block_verified_contracts'),
      nextRoute: { pathname: '/verified-contracts' as const },
      icon: 'verified',
      isActive: pathname === '/verified-contracts',
    };
    const ensLookup = config.features.nameService.isEnabled
      ? {
          text: t('block_name_services_lookup'),
          nextRoute: { pathname: '/name-domains' as const },
          icon: 'ENS',
          isActive: pathname === '/name-domains' || pathname === '/name-domains/[name]',
        }
      : null;
    const validators = config.features.validators.isEnabled
      ? {
          text: t('block_top_validators'),
          nextRoute: { pathname: '/validators' as const },
          icon: 'validator',
          isActive: pathname === '/validators',
        }
      : null;
    const rollupDeposits = {
      text: `Deposits (L1${rightLineArrow}L2)`,
      nextRoute: { pathname: '/deposits' as const },
      icon: 'arrows/south-east',
      isActive: pathname === '/deposits',
    };
    const rollupWithdrawals = {
      text: `Withdrawals (L2${rightLineArrow}L1)`,
      nextRoute: { pathname: '/withdrawals' as const },
      icon: 'arrows/north-east',
      isActive: pathname === '/withdrawals',
    };
    const rollupTxnBatches = {
      text: 'Txn batches',
      nextRoute: { pathname: '/batches' as const },
      icon: 'txn_batches',
      isActive: pathname === '/batches',
    };
    const rollupOutputRoots = {
      text: 'Output roots',
      nextRoute: { pathname: '/output-roots' as const },
      icon: 'output_roots',
      isActive: pathname === '/output-roots',
    };

    const rollupFeature = config.features.rollup;

    if (rollupFeature.isEnabled && (rollupFeature.type === 'optimistic' || rollupFeature.type === 'zkEvm')) {
      blockchainNavItems = [
        [txs, rollupDeposits, rollupWithdrawals],
        [blocks, rollupTxnBatches, rollupFeature.type === 'optimistic' ? rollupOutputRoots : undefined].filter(Boolean),
        [userOps, topAccounts, validators, verifiedContracts, ensLookup].filter(Boolean),
      ];
    } else if (rollupFeature.isEnabled && rollupFeature.type === 'shibarium') {
      blockchainNavItems = [
        [txs, rollupDeposits, rollupWithdrawals],
        [blocks, userOps, topAccounts, verifiedContracts, ensLookup].filter(Boolean),
      ];
    } else if (rollupFeature.isEnabled && rollupFeature.type === 'zkSync') {
      blockchainNavItems = [
        [txs, userOps, blocks, rollupTxnBatches].filter(Boolean),
        [topAccounts, validators, verifiedContracts, ensLookup].filter(Boolean),
      ];
    } else {
      blockchainNavItems = [
        txs,
        userOps,
        blocks,
        topAccounts,
        validators,
        verifiedContracts,
        ensLookup,
        config.features.beaconChain.isEnabled && {
          text: 'Withdrawals',
          nextRoute: { pathname: '/withdrawals' as const },
          icon: 'arrows/north-east',
          isActive: pathname === '/withdrawals',
        },
      ].filter(Boolean);
    }

    const apiNavItems: Array<NavItem> = [
      config.features.restApiDocs.isEnabled
        ? {
            text: t('block_rest_api'),
            nextRoute: { pathname: '/api-docs' as const },
            icon: 'restAPI',
            isActive: pathname === '/api-docs',
          }
        : null,
      config.features.graphqlApiDocs.isEnabled
        ? {
            text: t('block_graphql'),
            nextRoute: { pathname: '/graphiql' as const },
            icon: 'graphQL',
            isActive: pathname === '/graphiql',
          }
        : null,
      !config.UI.sidebar.hiddenLinks?.rpc_api && {
        text: t('block_rpc_api'),
        icon: 'RPC',
        url: 'https://docs.blockscout.com/for-users/api/rpc-endpoints',
      },
      !config.UI.sidebar.hiddenLinks?.eth_rpc_api && {
        text: t('block_eth_rpc_api'),
        icon: 'RPC',
        url: ' https://docs.blockscout.com/for-users/api/eth-rpc',
      },
    ].filter(Boolean);

    const mainNavItems: ReturnType['mainNavItems'] = [
      config.features.substrateExplorer.isEnabled
        ? {
            text: t('nav_substrate', { defaultValue: 'DBC Mainchain' }),
            icon: 'block' as const,
            isActive: pathname.startsWith('/substrate'),
            subItems: [
              { text: t('substrate_blocks_nav', { defaultValue: 'Blocks' }), icon: 'block' as const, nextRoute: { pathname: '/substrate/blocks' as const }, isActive: pathname === '/substrate/blocks' || pathname === '/substrate/block/[id]' },
              { text: t('substrate_extrinsics_nav', { defaultValue: 'Extrinsics' }), icon: 'transactions' as const, nextRoute: { pathname: '/substrate/extrinsics' as const }, isActive: pathname === '/substrate/extrinsics' || pathname === '/substrate/extrinsic/[id]' },
              { text: t('substrate_events_nav', { defaultValue: 'Events' }), icon: 'token' as const, nextRoute: { pathname: '/substrate/events' as const }, isActive: pathname === '/substrate/events' || pathname === '/substrate/event/[id]' },
              { text: t('substrate_transfers_nav', { defaultValue: 'Transfers' }), icon: 'arrows/north-east' as const, nextRoute: { pathname: '/substrate/transfers' as const }, isActive: pathname === '/substrate/transfers' },
              { text: t('substrate_accounts_nav', { defaultValue: 'Accounts' }), icon: 'top-accounts' as const, nextRoute: { pathname: '/substrate/accounts' as const }, isActive: pathname === '/substrate/accounts' },
            ],
          }
        : null,
      {
        text: t('nav_evm', { defaultValue: 'EVM' }),
        icon: 'globe-b',
        isActive: blockchainNavItems.flat().some((item) => isInternalItem(item) && item.isActive),
        subItems: blockchainNavItems,
      },
      {
        text: t('block_tokens'),
        nextRoute: { pathname: '/tokens' as const },
        icon: 'token',
        isActive: pathname.startsWith('/token'),
      },
      config.features.marketplace.isEnabled
        ? {
            text: t('block_dapps'),
            nextRoute: { pathname: '/apps' as const },
            icon: 'apps',
            isActive: pathname.startsWith('/app'),
          }
        : null,
      config.features.staking.isEnabled
        ? {
            text: t('block_staking'),
            nextRoute: { pathname: '/staking' as const },
            icon: 'stats',
            isActive: pathname.startsWith('/staking'),
          }
        : null,
      config.features.governance.isEnabled
        ? {
            text: t('block_governance'),
            nextRoute: { pathname: '/governance' as const },
            icon: 'token' as const,
            isActive: pathname.startsWith('/governance'),
          }
        : null,
      config.features.priceOracle.isEnabled
        ? {
            text: t('block_price_oracle'),
            nextRoute: { pathname: '/price' as const },
            icon: 'token' as const,
            isActive: pathname.startsWith('/price'),
          }
        : null,
      config.features.marketplace.isEnabled
        ? {
            text: t('block_gpu_race'),
            nextRoute: { pathname: '/race' as const },
            icon: 'race',
            isActive: pathname.startsWith('/race'),
          }
        : null,
      {
        text: t('block_gpu_mining'),
        nextRoute: { pathname: '/mining' as const },
        icon: 'mining',
        isActive: pathname.startsWith('/mining'),
      },
      config.features.stats.isEnabled
        ? {
            text: t('block_charts_stats'),
            nextRoute: { pathname: '/stats' as const },
            icon: 'stats',
            isActive: pathname === '/stats',
          }
        : null,
      apiNavItems.length > 0 && {
        text: t('block_api'),
        icon: 'restAPI',
        isActive: apiNavItems.some((item) => isInternalItem(item) && item.isActive),
        subItems: apiNavItems,
      },
      {
        text: t('block_other'),
        icon: 'gear',
        subItems: [
          {
            text: t('block_verify_contract'),
            nextRoute: { pathname: '/contract-verification' as const },
            isActive: pathname.startsWith('/contract-verification'),
          },
          config.features.gasTracker.isEnabled && {
            text: t('block_gas_tracker'),
            nextRoute: { pathname: '/gas-tracker' as const },
            isActive: pathname.startsWith('/gas-tracker'),
          },
          ...config.UI.sidebar.otherLinks,
        ].filter(Boolean),
      },
    ].filter(Boolean);

    const accountNavItems: ReturnType['accountNavItems'] = [
      {
        text: 'Watch list',
        nextRoute: { pathname: '/account/watchlist' as const },
        icon: 'watchlist',
        isActive: pathname === '/account/watchlist',
      },
      {
        text: 'Private tags',
        nextRoute: { pathname: '/account/tag-address' as const },
        icon: 'privattags',
        isActive: pathname === '/account/tag-address',
      },
      {
        text: 'Public tags',
        nextRoute: { pathname: '/account/public-tags-request' as const },
        icon: 'publictags',
        isActive: pathname === '/account/public-tags-request',
      },
      {
        text: 'API keys',
        nextRoute: { pathname: '/account/api-key' as const },
        icon: 'API',
        isActive: pathname === '/account/api-key',
      },
      {
        text: 'Custom ABI',
        nextRoute: { pathname: '/account/custom-abi' as const },
        icon: 'ABI',
        isActive: pathname === '/account/custom-abi',
      },
      config.features.addressVerification.isEnabled && {
        text: 'Verified addrs',
        nextRoute: { pathname: '/account/verified-addresses' as const },
        icon: 'verified',
        isActive: pathname === '/account/verified-addresses',
      },
    ].filter(Boolean);

    const profileItem = {
      text: 'My profile',
      nextRoute: { pathname: '/auth/profile' as const },
      iconComponent: UserAvatar,
      isActive: pathname === '/auth/profile',
    };

    return { mainNavItems, accountNavItems, profileItem };
  }, [pathname, i18n.language]);
}
