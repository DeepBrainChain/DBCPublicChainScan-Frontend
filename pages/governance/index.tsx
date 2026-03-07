import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const GovernanceDashboard = dynamic(() => import('ui/pages/GovernanceDashboard'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/governance">
      <GovernanceDashboard/>
    </PageNextJs>
  );
};

export default Page;

export { governance as getServerSideProps } from 'nextjs/getServerSideProps';