import React from 'react';
import { useTranslation } from 'next-i18next';

import PageTitle from 'ui/shared/Page/PageTitle';
import SubstrateEventDetail from 'ui/substrate/SubstrateEventDetail';

interface Props {
  id: string;
}

const SubstrateEventDetailPage = ({ id }: Props) => {
  const { t } = useTranslation('common');

  return (
    <>
      <PageTitle title={ t('substrate_event_detail_title', { defaultValue: 'Event Detail' }) }/>
      <SubstrateEventDetail eventId={ id }/>
    </>
  );
};

export default SubstrateEventDetailPage;
