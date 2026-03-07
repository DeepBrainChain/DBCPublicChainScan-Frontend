import React from 'react';
import { useTranslation } from 'next-i18next';

import SubstrateExtrinsicsList from 'ui/substrate/SubstrateExtrinsicsList';
import PageTitle from 'ui/shared/Page/PageTitle';

const SubstrateExtrinsicsPage = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <PageTitle title={ t('substrate_extrinsics_title', { defaultValue: 'DBC Mainchain Extrinsics' }) }/>
      <SubstrateExtrinsicsList/>
    </>
  );
};

export default SubstrateExtrinsicsPage;
