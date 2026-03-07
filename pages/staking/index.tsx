import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const StakingDashboard = dynamic(() => import('ui/pages/StakingDashboard'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/staking">
      <StakingDashboard/>
    </PageNextJs>
  );
};

export default Page;

export { staking as getServerSideProps } from 'nextjs/getServerSideProps';
