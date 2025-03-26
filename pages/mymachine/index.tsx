import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React, { useEffect } from 'react';
import { getEnvValue } from '../../configs/app/utils';

import PageNextJs from 'nextjs/PageNextJs';
const MyMachine = dynamic(() => import('ui/mymachine/index'), { ssr: false });
console.log(process.env.NEXT_PUBLIC_API_URLX || '环境变量没生效'); // 应输出 "DeepBrainChain Testnet"
console.log(getEnvValue('NEXT_PUBLIC_API_URLX'), 'getEnvValue', process.env);

useEffect(() => {
  console.log(getEnvValue('NEXT_PUBLIC_API_URLX')); // 输出 "https://testnet.dbcscan.io/mymachine"
}, []);

const Page: NextPage = () => (
  <PageNextJs pathname="/mymachine">
    <MyMachine />
  </PageNextJs>
);

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps';
