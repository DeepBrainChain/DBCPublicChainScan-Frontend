import {
  Box, Tab, TabList, TabPanel, TabPanels, Tabs, useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'next-i18next';

import PageTitle from 'ui/shared/Page/PageTitle';
import useGovernanceData from 'ui/governance/useGovernanceData';
import GovernanceOverview from 'ui/governance/GovernanceOverview';
import DemocracyProposalsList from 'ui/governance/DemocracyProposalsList';
import CouncilMotionsList from 'ui/governance/CouncilMotionsList';
import TreasuryProposalsList from 'ui/governance/TreasuryProposalsList';

const GovernanceDashboard = () => {
  const { t } = useTranslation('common');
  const {
    overview,
    democracyProposals,
    councilMotions,
    treasuryProposals,
  } = useGovernanceData();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const hasDemocracy = (overview.data?.democracy_proposal_count ?? 0) > 0;

  return (
    <>
      <PageTitle title={ t('governance_title', { defaultValue: 'Governance' }) }/>

      <GovernanceOverview data={ overview.data } isLoading={ overview.isPlaceholderData }/>

      <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } p={ 4 }>
        <Tabs isLazy>
          <TabList>
            <Tab>{ t('governance_council_tab', { defaultValue: 'Council' }) }</Tab>
            <Tab>{ t('governance_treasury_tab', { defaultValue: 'Treasury' }) }</Tab>
            { hasDemocracy && (
              <Tab>{ t('governance_democracy_tab', { defaultValue: 'Democracy' }) }</Tab>
            ) }
          </TabList>
          <TabPanels mt={ 4 }>
            <TabPanel p={ 0 }>
              <CouncilMotionsList
                data={ councilMotions.data }
                isLoading={ councilMotions.isPlaceholderData }
              />
            </TabPanel>
            <TabPanel p={ 0 }>
              <TreasuryProposalsList
                data={ treasuryProposals.data }
                isLoading={ treasuryProposals.isPlaceholderData }
              />
            </TabPanel>
            { hasDemocracy && (
              <TabPanel p={ 0 }>
                <DemocracyProposalsList
                  data={ democracyProposals.data }
                  isLoading={ democracyProposals.isPlaceholderData }
                />
              </TabPanel>
            ) }
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
};

export default GovernanceDashboard;
