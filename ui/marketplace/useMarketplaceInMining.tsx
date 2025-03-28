import _pickBy from 'lodash/pickBy';
import { useRouter } from 'next/router';
import React from 'react';

import type { ContractListTypes } from 'types/client/marketplace';
import { MarketplaceCategory, MarketplaceDisplayType } from 'types/client/marketplace';

import useDebounce from 'lib/hooks/useDebounce';
import * as mixpanel from 'lib/mixpanel/index';
import getQueryParamString from 'lib/router/getQueryParamString';

import useMarketplaceApps from './useMarketplaceApps';
import useMarketplaceCategories from './useMarketplaceCategories';

const favoriteAppsLocalStorageKey = 'favoriteApps';

function getFavoriteApps() {
  try {
    return JSON.parse(localStorage.getItem(favoriteAppsLocalStorageKey) || '[]') as Array<string>;
  } catch (e) {
    return [];
  }
}

export default function useMarketplace() {
  const router = useRouter();
  const defaultCategoryId = getQueryParamString(router.query.category);
  const defaultFilterQuery = getQueryParamString(router.query.filter);
  const defaultDisplayType = getQueryParamString(router.query.tab);

  const [ selectedAppId, setSelectedAppId ] = React.useState<string | null>(null);
  const [ selectedCategoryId, setSelectedCategoryId ] = React.useState<string>(MarketplaceCategory.ALL);
  const [ selectedDisplayType, setSelectedDisplayType ] = React.useState<string>(
    Object.values(MarketplaceDisplayType).includes(defaultDisplayType as MarketplaceDisplayType) ?
      defaultDisplayType :
      MarketplaceDisplayType.DEFAULT,
  );
  const [ filterQuery, setFilterQuery ] = React.useState(defaultFilterQuery);
  const [ favoriteApps, setFavoriteApps ] = React.useState<Array<string>>([]);
  const [ isFavoriteAppsLoaded, setIsFavoriteAppsLoaded ] = React.useState<boolean>(false);
  const [ isAppInfoModalOpen, setIsAppInfoModalOpen ] = React.useState<boolean>(false);
  const [ isDisclaimerModalOpen, setIsDisclaimerModalOpen ] = React.useState<boolean>(false);
  const [ contractListModalType, setContractListModalType ] = React.useState<ContractListTypes | null>(null);
  const [ hasPreviousStep, setHasPreviousStep ] = React.useState<boolean>(false);

  const handleFavoriteClick = React.useCallback((id: string, isFavorite: boolean, source: 'Discovery view' | 'Security view' | 'App modal' | 'Banner') => {
    mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'Favorite app', Info: id, Source: source });

    const favoriteApps = getFavoriteApps();

    if (isFavorite) {
      const result = favoriteApps.filter((appId: string) => appId !== id);
      setFavoriteApps(result);
      localStorage.setItem(favoriteAppsLocalStorageKey, JSON.stringify(result));
    } else {
      favoriteApps.push(id);
      localStorage.setItem(favoriteAppsLocalStorageKey, JSON.stringify(favoriteApps));
      setFavoriteApps(favoriteApps);
    }
  }, []);

  const showAppInfo = React.useCallback((id: string) => {

    setSelectedAppId(id);
    setIsAppInfoModalOpen(true);
  }, []);

  const showDisclaimer = React.useCallback((id: string) => {
    setSelectedAppId(id);
    setIsDisclaimerModalOpen(true);
  }, []);

  const showContractList = React.useCallback((id: string, type: ContractListTypes, hasPreviousStep?: boolean) => {
    setSelectedAppId(id);
    setContractListModalType(type);
    if (hasPreviousStep) {
      setHasPreviousStep(true);
    }
  }, []);

  const debouncedFilterQuery = useDebounce(filterQuery, 500);
  const clearSelectedAppId = React.useCallback(() => {
    setSelectedAppId(null);
    setIsAppInfoModalOpen(false);
    setIsDisclaimerModalOpen(false);
    setContractListModalType(null);
    setHasPreviousStep(false);
  }, []);

  const handleCategoryChange = React.useCallback((newCategory: string) => {
    mixpanel.logEvent(mixpanel.EventTypes.FILTERS, { Source: 'Marketplace', 'Filter name': newCategory });
    setSelectedCategoryId(newCategory);
  }, []);

  const handleDisplayTypeChange = React.useCallback((newDisplayType: MarketplaceDisplayType) => {
    setSelectedDisplayType(newDisplayType);
  }, []);

  const {
    isPlaceholderData, isError, error, data, displayedApps, displayedAppsInMining, gpuMiningData,
  } = useMarketplaceApps(debouncedFilterQuery, selectedCategoryId, favoriteApps, isFavoriteAppsLoaded);

  const {
    isPlaceholderData: isCategoriesPlaceholderData, data: categories,
  } = useMarketplaceCategories(data, isPlaceholderData);

  const {
    isPlaceholderData: gpuRaceIsCategoriesPlaceholderData, data: gpuRaceCategories,
  } = useMarketplaceCategories(gpuMiningData, isPlaceholderData);

  React.useEffect(() => {
    setFavoriteApps(getFavoriteApps());
    setIsFavoriteAppsLoaded(true);
  }, []);

  React.useEffect(() => {
    if (!isPlaceholderData && !isError) {
      const isValidDefaultCategory = categories.map(c => c.name).includes(defaultCategoryId);
      isValidDefaultCategory && setSelectedCategoryId(defaultCategoryId);
    }
    // run only when data is loaded
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ isPlaceholderData ]);

  React.useEffect(() => {
    const query = _pickBy({
      category: selectedCategoryId === MarketplaceCategory.ALL ? undefined : selectedCategoryId,
      filter: debouncedFilterQuery,
      tab: selectedDisplayType === MarketplaceDisplayType.DEFAULT ? undefined : selectedDisplayType,
    }, Boolean);

    if (debouncedFilterQuery.length > 0) {
      mixpanel.logEvent(mixpanel.EventTypes.LOCAL_SEARCH, { Source: 'Marketplace', 'Search query': debouncedFilterQuery });
    }

    router.replace(
      { pathname: '/mining', query },
      undefined,
      { shallow: true },
    );
    // omit router in the deps because router.push() somehow modifies it
    // and we get infinite re-renders then
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ debouncedFilterQuery, selectedCategoryId, selectedDisplayType ]);

  return React.useMemo(() => ({
    selectedCategoryId,
    onCategoryChange: handleCategoryChange,
    filterQuery: debouncedFilterQuery,
    onSearchInputChange: setFilterQuery,
    isPlaceholderData,
    isError,
    error,
    categories,
    apps: data,
    displayedApps,
    displayedAppsInMining,
    showAppInfo,
    selectedAppId,
    clearSelectedAppId,
    favoriteApps,
    onFavoriteClick: handleFavoriteClick,
    isAppInfoModalOpen,
    isDisclaimerModalOpen,
    showDisclaimer,
    appsTotal: data?.length || 0,
    gpuRaceAppsTotal: gpuMiningData?.length || 0,
    isCategoriesPlaceholderData,
    showContractList,
    contractListModalType,
    selectedDisplayType,
    onDisplayTypeChange: handleDisplayTypeChange,
    hasPreviousStep,
    gpuRaceIsCategoriesPlaceholderData,
    gpuRaceCategories,
  }), [
    selectedCategoryId,
    categories,
    clearSelectedAppId,
    selectedAppId,
    data,
    displayedApps,
    displayedAppsInMining,
    gpuMiningData,
    error,
    favoriteApps,
    handleCategoryChange,
    handleFavoriteClick,
    isError,
    isPlaceholderData,
    showAppInfo,
    debouncedFilterQuery,
    isAppInfoModalOpen,
    isDisclaimerModalOpen,
    showDisclaimer,
    isCategoriesPlaceholderData,
    showContractList,
    contractListModalType,
    selectedDisplayType,
    handleDisplayTypeChange,
    hasPreviousStep,
    gpuRaceIsCategoriesPlaceholderData,
    gpuRaceCategories,
  ]);
}
