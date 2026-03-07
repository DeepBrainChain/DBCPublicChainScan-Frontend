import React from 'react';
import { useTranslation } from 'next-i18next';

import SubstrateExtrinsicDetail from 'ui/substrate/SubstrateExtrinsicDetail';
import PageTitle from 'ui/shared/Page/PageTitle';

interface Props {
  id: string;
}

const SubstrateExtrinsicDetailPage = ({ id }: Props) => {
  const { t } = useTranslation('common');

  return (
    <>
      <PageTitle title={ t('substrate_extrinsic_detail_title', { defaultValue: 'Extrinsic Detail' }) }/>
      <SubstrateExtrinsicDetail extrinsicId={ id }/>
    </>
  );
};

export default SubstrateExtrinsicDetailPage;
