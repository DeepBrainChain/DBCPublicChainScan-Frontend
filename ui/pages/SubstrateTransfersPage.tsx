import React from 'react';
import { useTranslation } from 'next-i18next';

import PageTitle from 'ui/shared/Page/PageTitle';
import SubstrateTransfersList from 'ui/substrate/SubstrateTransfersList';

const SubstrateTransfersPage = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <PageTitle title={ t('substrate_transfers_title', { defaultValue: 'DBC Mainchain Transfers' }) }/>
      <SubstrateTransfersList/>
    </>
  );
};

export default SubstrateTransfersPage;
