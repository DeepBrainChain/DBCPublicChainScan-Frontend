import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';
import { useRouter } from 'next/router';

import PageNextJs from 'nextjs/PageNextJs';

const SubstrateBlockDetailPage = dynamic(() => import('ui/pages/SubstrateBlockDetailPage'), { ssr: false });

const Page: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  return (
    <PageNextJs pathname="/substrate/block/[id]">
      <SubstrateBlockDetailPage id={ id }/>
    </PageNextJs>
  );
};

export default Page;

export { substrateExplorer as getServerSideProps } from 'nextjs/getServerSideProps';
