import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const SubstrateEventsPage = dynamic(() => import('ui/pages/SubstrateEventsPage'), { ssr: false });

const Page: NextPage = () => (
  <PageNextJs pathname="/substrate/events"><SubstrateEventsPage/></PageNextJs>
);

export default Page;

export { substrateExplorer as getServerSideProps } from 'nextjs/getServerSideProps';
