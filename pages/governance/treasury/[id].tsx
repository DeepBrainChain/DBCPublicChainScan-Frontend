import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';
import { useRouter } from 'next/router';

import PageNextJs from 'nextjs/PageNextJs';
import PageTitle from 'ui/shared/Page/PageTitle';

const TreasuryProposalDetail = dynamic(() => import('ui/governance/TreasuryProposalDetail'), { ssr: false });

const Page: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  return (
    <PageNextJs pathname="/governance/treasury/[id]">
      <PageTitle title={ `Treasury Proposal #${id || ''}` } mb={ 6 }/>
      <TreasuryProposalDetail proposalId={ id }/>
    </PageNextJs>
  );
};

export default Page;

export { governance as getServerSideProps } from 'nextjs/getServerSideProps';
