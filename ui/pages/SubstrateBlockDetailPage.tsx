import React from 'react';
import { useTranslation } from 'next-i18next';

import SubstrateBlockDetail from 'ui/substrate/SubstrateBlockDetail';
import PageTitle from 'ui/shared/Page/PageTitle';

interface Props {
  id: string;
}

const SubstrateBlockDetailPage = ({ id }: Props) => {
  const { t } = useTranslation('common');

  return (
    <>
      <PageTitle title={ t('substrate_block_detail_title', { defaultValue: `Block #${id || ''}` }) } mb={ 6 }/>
      <SubstrateBlockDetail blockId={ id }/>
    </>
  );
};

export default SubstrateBlockDetailPage;
