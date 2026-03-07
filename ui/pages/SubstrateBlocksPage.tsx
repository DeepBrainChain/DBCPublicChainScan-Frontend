import React from 'react';
import { useTranslation } from 'next-i18next';

import SubstrateBlocksList from 'ui/substrate/SubstrateBlocksList';
import PageTitle from 'ui/shared/Page/PageTitle';

const SubstrateBlocksPage = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <PageTitle title={ t('substrate_blocks_title', { defaultValue: 'DBC Mainchain Blocks' }) }/>
      <SubstrateBlocksList/>
    </>
  );
};

export default SubstrateBlocksPage;
