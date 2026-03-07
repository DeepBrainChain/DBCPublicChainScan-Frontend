import React from 'react';
import { useTranslation } from 'next-i18next';

import SubstrateAccountDetail from 'ui/substrate/SubstrateAccountDetail';
import PageTitle from 'ui/shared/Page/PageTitle';

interface Props {
  id: string;
}

const SubstrateAccountDetailPage = ({ id }: Props) => {
  const { t } = useTranslation('common');

  return (
    <>
      <PageTitle title={ t('substrate_account_detail_title', { defaultValue: 'Account Detail' }) }/>
      <SubstrateAccountDetail address={ id }/>
    </>
  );
};

export default SubstrateAccountDetailPage;
