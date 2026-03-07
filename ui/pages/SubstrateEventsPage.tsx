import React from 'react';
import { useTranslation } from 'next-i18next';

import PageTitle from 'ui/shared/Page/PageTitle';
import SubstrateEventsList from 'ui/substrate/SubstrateEventsList';

const SubstrateEventsPage = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <PageTitle title={ t('substrate_events_title', { defaultValue: 'DBC Mainchain Events' }) }/>
      <SubstrateEventsList/>
    </>
  );
};

export default SubstrateEventsPage;
