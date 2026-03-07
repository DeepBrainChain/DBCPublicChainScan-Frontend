import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const SubstrateTransfersPage = dynamic(() => import('ui/pages/SubstrateTransfersPage'), { ssr: false });

const Page: NextPage = () => (
  <PageNextJs pathname="/substrate/transfers"><SubstrateTransfersPage/></PageNextJs>
);

export default Page;

export { substrateExplorer as getServerSideProps } from 'nextjs/getServerSideProps';
