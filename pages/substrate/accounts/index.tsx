import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const SubstrateAccountsPage = dynamic(() => import('ui/pages/SubstrateAccountsPage'), { ssr: false });

const Page: NextPage = () => (
  <PageNextJs pathname="/substrate/accounts">
    <SubstrateAccountsPage/>
  </PageNextJs>
);

export default Page;

export { substrateExplorer as getServerSideProps } from 'nextjs/getServerSideProps';
