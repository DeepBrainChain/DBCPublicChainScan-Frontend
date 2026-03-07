import { Grid, GridItem } from '@chakra-ui/react';
import React from 'react';

import PageTitle from 'ui/shared/Page/PageTitle';
import TokenDistributionDynamic from 'ui/token/TokenDistributionDynamic';
import useTokenData from 'ui/token/useTokenData';
import useStakingData from 'ui/staking/useStakingData';
import StakingOverview from 'ui/staking/StakingOverview';
import StakingEraProgress from 'ui/staking/StakingEraProgress';
import StakingValidatorTable from 'ui/staking/StakingValidatorTable';

const StakingDashboard = () => {
  const { overview, validators } = useStakingData();
  const { distribution } = useTokenData();

  return (
    <>
      <PageTitle title="Staking Dashboard"/>

      <StakingOverview data={ overview.data } isLoading={ overview.isPlaceholderData }/>

      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={ 6 } mb={ 8 }>
        <GridItem>
          <StakingEraProgress data={ overview.data } isLoading={ overview.isPlaceholderData }/>
        </GridItem>
        <GridItem>
          <TokenDistributionDynamic data={ distribution.data } isLoading={ distribution.isPlaceholderData }/>
        </GridItem>
      </Grid>

      <StakingValidatorTable data={ validators.data } isLoading={ validators.isPlaceholderData }/>
    </>
  );
};

export default StakingDashboard;
