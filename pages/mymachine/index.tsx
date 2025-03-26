import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';
const MyMachine = dynamic(() => import('ui/mymachine/index'), { ssr: false });
console.log(process.env.NEXT_PUBLIC_API_URLx || '环境变量没生效'); // 应输出 "DeepBrainChain Testnet"
const Page: NextPage = () => (
  <PageNextJs pathname="/mymachine">
    <MyMachine />
  </PageNextJs>
);

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps';
