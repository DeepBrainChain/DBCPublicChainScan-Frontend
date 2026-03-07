import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const PriceOracleDashboard = dynamic(() => import('ui/pages/PriceOracleDashboard'), { ssr: false });

const Page: NextPage = () => (
  <PageNextJs pathname="/price"><PriceOracleDashboard/></PageNextJs>
);

export default Page;

export { priceOracle as getServerSideProps } from 'nextjs/getServerSideProps';