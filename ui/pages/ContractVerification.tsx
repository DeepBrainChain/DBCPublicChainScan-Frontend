import React from 'react';

import ContractVerificationForm from 'ui/contractVerification/ContractVerificationForm';
import useFormConfigQuery from 'ui/contractVerification/useFormConfigQuery';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import PageTitle from 'ui/shared/Page/PageTitle';
import { useTranslation } from 'next-i18next';

const ContractVerification = () => {
  const configQuery = useFormConfigQuery(true);
  const { t } = useTranslation();
  const content = (() => {
    if (configQuery.isError) {
      return <DataFetchAlert />;
    }

    if (configQuery.isPending) {
      return <ContentLoader />;
    }

    return <ContractVerificationForm config={configQuery.data} />;
  })();

  return (
    <>
      <PageTitle title={t('deep_verify_publish_contract')} />
      {content}
    </>
  );
};

export default ContractVerification;
