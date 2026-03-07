import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';
import { useRouter } from 'next/router';

import PageNextJs from 'nextjs/PageNextJs';

const SubstrateAccountDetailPage = dynamic(() => import('ui/pages/SubstrateAccountDetailPage'), { ssr: false });

const Page: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  return (
    <PageNextJs pathname="/substrate/account/[id]">
      <SubstrateAccountDetailPage id={ id }/>
    </PageNextJs>
  );
};

export default Page;

export { substrateExplorer as getServerSideProps } from 'nextjs/getServerSideProps';
