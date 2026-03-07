import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const SubstrateBlocksPage = dynamic(() => import('ui/pages/SubstrateBlocksPage'), { ssr: false });

const Page: NextPage = () => (
  <PageNextJs pathname="/substrate/blocks">
    <SubstrateBlocksPage/>
  </PageNextJs>
);

export default Page;

export { substrateExplorer as getServerSideProps } from 'nextjs/getServerSideProps';
