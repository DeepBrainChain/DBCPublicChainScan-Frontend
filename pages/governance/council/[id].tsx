import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';
import { useRouter } from 'next/router';

import PageNextJs from 'nextjs/PageNextJs';
import PageTitle from 'ui/shared/Page/PageTitle';

const CouncilProposalDetail = dynamic(() => import('ui/governance/CouncilProposalDetail'), { ssr: false });

const Page: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  return (
    <PageNextJs pathname="/governance/council/[id]">
      <PageTitle title={ `Council Motion #${id || ''}` } mb={ 6 }/>
      <CouncilProposalDetail proposalId={ id }/>
    </PageNextJs>
  );
};

export default Page;

export { governance as getServerSideProps } from 'nextjs/getServerSideProps';
