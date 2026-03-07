import React from 'react';
import { useTranslation } from 'next-i18next';

import SubstrateAccountsList from 'ui/substrate/SubstrateAccountsList';
import PageTitle from 'ui/shared/Page/PageTitle';

const SubstrateAccountsPage = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <PageTitle title={ t('substrate_accounts_title', { defaultValue: 'DBC Mainchain Accounts' }) }/>
      <SubstrateAccountsList/>
    </>
  );
};

export default SubstrateAccountsPage;
