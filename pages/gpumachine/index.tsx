import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';
const GpuMachine = dynamic(() => import('ui/gpumachine/index'), { ssr: false });

const Page: NextPage = () => (
  <PageNextJs pathname="/gpumachine">
    <GpuMachine />
  </PageNextJs>
);

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps';
