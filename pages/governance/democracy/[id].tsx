import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';
import { useRouter } from 'next/router';

import PageNextJs from 'nextjs/PageNextJs';
import PageTitle from 'ui/shared/Page/PageTitle';

const DemocracyProposalDetail = dynamic(() => import('ui/governance/DemocracyProposalDetail'), { ssr: false });

const Page: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  return (
    <PageNextJs pathname="/governance/democracy/[id]">
      <PageTitle title={ `Democracy Proposal #${id || ''}` } mb={ 6 }/>
      <DemocracyProposalDetail proposalId={ id }/>
    </PageNextJs>
  );
};

export default Page;

export { governance as getServerSideProps } from 'nextjs/getServerSideProps';
