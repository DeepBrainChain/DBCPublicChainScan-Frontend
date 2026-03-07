import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const SubstrateExtrinsicsPage = dynamic(() => import('ui/pages/SubstrateExtrinsicsPage'), { ssr: false });

const Page: NextPage = () => (
  <PageNextJs pathname="/substrate/extrinsics">
    <SubstrateExtrinsicsPage/>
  </PageNextJs>
);

export default Page;

export { substrateExplorer as getServerSideProps } from 'nextjs/getServerSideProps';
