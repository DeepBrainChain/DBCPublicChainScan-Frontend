import {
  Badge, Box, Button, Code, Flex, Grid, GridItem, HStack, Skeleton, Table, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'next-i18next';

import LinkInternal from 'ui/shared/LinkInternal';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

interface Props {
  blockId: string;
}

const InfoRow = ({
  label, children, isLoading, labelColor,
}: { label: string; children: React.ReactNode; isLoading: boolean; labelColor: string }) => (
  <Grid templateColumns="180px 1fr" gap={ 4 } py={ 3 } borderBottomWidth="1px" borderColor="inherit">
    <GridItem><Text color={ labelColor } fontWeight="medium">{ label }</Text></GridItem>
    <GridItem><Skeleton isLoaded={ !isLoading }>{ children }</Skeleton></GridItem>
  </Grid>
);

const formatTime = (timestamp: number | undefined) => {
  if (!timestamp) return '-';
  return new Date(timestamp * 1000).toLocaleString();
};

const truncateHash = (hash: string) => {
  if (!hash || hash.length <= 20) return hash || '-';
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
};

const SubstrateBlockDetail = ({ blockId }: Props) => {
  const { t } = useTranslation('common');
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const labelColor = useColorModeValue('gray.600', 'gray.400');

  const [ detail, setDetail ] = React.useState<any>(null);
  const [ isLoading, setIsLoading ] = React.useState(true);

  React.useEffect(() => {
    if (!blockId) return;
    setIsLoading(true);
    fetch(`/node-api/proxy/api/v2/substrate/block/${blockId}`)
      .then((r) => r.json())
      .then((d) => { setDetail(d); setIsLoading(false); })
      .catch(() => setIsLoading(false));
  }, [ blockId ]);

  const extrinsics = detail?.extrinsics || [];
  const blockNum = detail?.block_num;
  const prevBlock = blockNum && blockNum > 0 ? blockNum - 1 : null;
  const nextBlock = blockNum ? blockNum + 1 : null;

  return (
    <>
      <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } p={ 6 } mb={ 6 }>
        <Flex justify="space-between" align="center" mb={ 4 }>
          <HStack spacing={ 2 }>
            { prevBlock !== null && (
              <LinkInternal href={ `/substrate/block/${prevBlock}` }>
                <Button size="sm" variant="outline">&larr; { prevBlock }</Button>
              </LinkInternal>
            ) }
          </HStack>
          <Text fontWeight="bold" fontSize="lg">
            { t('substrate_block', { defaultValue: 'Block' }) } #{ blockNum ?? blockId }
          </Text>
          <HStack spacing={ 2 }>
            { nextBlock !== null && (
              <LinkInternal href={ `/substrate/block/${nextBlock}` }>
                <Button size="sm" variant="outline">{ nextBlock } &rarr;</Button>
              </LinkInternal>
            ) }
          </HStack>
        </Flex>

        <InfoRow label={ t('substrate_timestamp', { defaultValue: 'Timestamp' }) } isLoading={ isLoading } labelColor={ labelColor }>
          <Text>{ formatTime(detail?.block_timestamp) }</Text>
        </InfoRow>
        <InfoRow label={ t('substrate_status', { defaultValue: 'Status' }) } isLoading={ isLoading } labelColor={ labelColor }>
          <Badge colorScheme={ detail?.finalized ? 'green' : 'yellow' } variant="subtle">
            { detail?.finalized ? t('substrate_finalized', { defaultValue: 'Finalized' }) : t('substrate_pending', { defaultValue: 'Pending' }) }
          </Badge>
        </InfoRow>
        <InfoRow label={ t('substrate_hash', { defaultValue: 'Hash' }) } isLoading={ isLoading } labelColor={ labelColor }>
          <Text fontFamily="mono" fontSize="sm" wordBreak="break-all">
            { detail?.hash }<CopyToClipboard text={ detail?.hash || '' } ml={ 2 }/>
          </Text>
        </InfoRow>
        <InfoRow label={ t('substrate_parent_hash', { defaultValue: 'Parent Hash' }) } isLoading={ isLoading } labelColor={ labelColor }>
          { detail?.parent_hash ? (
            <LinkInternal href={ `/substrate/block/${prevBlock ?? ''}` } color="link_hovered">
              <Text fontFamily="mono" fontSize="sm" wordBreak="break-all">{ detail.parent_hash }</Text>
            </LinkInternal>
          ) : <Text>-</Text> }
        </InfoRow>
        <InfoRow label={ t('substrate_state_root', { defaultValue: 'State Root' }) } isLoading={ isLoading } labelColor={ labelColor }>
          <Text fontFamily="mono" fontSize="sm" wordBreak="break-all">
            { detail?.state_root || '-' }
            { detail?.state_root && <CopyToClipboard text={ detail.state_root } ml={ 2 }/> }
          </Text>
        </InfoRow>
        <InfoRow label={ t('substrate_extrinsics_root', { defaultValue: 'Extrinsics Root' }) } isLoading={ isLoading } labelColor={ labelColor }>
          <Text fontFamily="mono" fontSize="sm" wordBreak="break-all">
            { detail?.extrinsics_root || '-' }
            { detail?.extrinsics_root && <CopyToClipboard text={ detail.extrinsics_root } ml={ 2 }/> }
          </Text>
        </InfoRow>
        <InfoRow label={ t('substrate_validator', { defaultValue: 'Validator' }) } isLoading={ isLoading } labelColor={ labelColor }>
          { detail?.validator ? (
            <LinkInternal href={ `/substrate/account/${detail.validator}` } color="link_hovered">
              <Text fontFamily="mono" fontSize="sm">
                { detail.validator_name ? `${detail.validator_name} (${truncateHash(detail.validator)})` : detail.validator }
              </Text>
            </LinkInternal>
          ) : <Text>-</Text> }
        </InfoRow>
        <InfoRow label={ t('substrate_spec_version', { defaultValue: 'Spec Version' }) } isLoading={ isLoading } labelColor={ labelColor }>
          <Code>{ detail?.spec_version }</Code>
        </InfoRow>
        <InfoRow label={ t('substrate_extrinsics_count', { defaultValue: 'Extrinsics' }) } isLoading={ isLoading } labelColor={ labelColor }>
          <Text>{ detail?.extrinsics_count }</Text>
        </InfoRow>
        <InfoRow label={ t('substrate_events_count', { defaultValue: 'Events' }) } isLoading={ isLoading } labelColor={ labelColor }>
          <Text>{ detail?.event_count }</Text>
        </InfoRow>
      </Box>

      { extrinsics.length > 0 && (
        <Box bg={ bg } borderRadius="lg" borderWidth="1px" borderColor={ borderColor } overflowX="auto">
          <Box p={ 4 } borderBottomWidth="1px" borderColor={ borderColor }>
            <Text fontSize="lg" fontWeight="bold">
              { t('substrate_extrinsics', { defaultValue: 'Extrinsics' }) } ({ extrinsics.length })
            </Text>
          </Box>
          <Table variant="simple" size="sm" minWidth="800px">
            <Thead>
              <Tr>
                <Th>{ t('substrate_extrinsic_id', { defaultValue: 'Extrinsic ID' }) }</Th>
                <Th>{ t('substrate_module_call', { defaultValue: 'Module/Call' }) }</Th>
                <Th>{ t('substrate_signer', { defaultValue: 'Signer' }) }</Th>
                <Th>{ t('substrate_result', { defaultValue: 'Result' }) }</Th>
                <Th isNumeric>{ t('substrate_fee', { defaultValue: 'Fee' }) }</Th>
              </Tr>
            </Thead>
            <Tbody>
              { extrinsics.map((ext: any, idx: number) => (
                <Tr key={ ext.extrinsic_index || idx }>
                  <Td>
                    <LinkInternal href={ `/substrate/extrinsic/${ext.extrinsic_index}` } color="link_hovered" fontWeight="medium">
                      { ext.extrinsic_index }
                    </LinkInternal>
                  </Td>
                  <Td>{ `${ext.call_module}.${ext.call_module_function}` }</Td>
                  <Td>
                    { ext.signer ? (
                      <LinkInternal href={ `/substrate/account/${ext.signer}` } color="link_hovered">
                        <Text fontFamily="mono" fontSize="xs">
                          { ext.signer_name || truncateHash(ext.signer) }
                        </Text>
                      </LinkInternal>
                    ) : (
                      <Badge colorScheme="purple" variant="subtle" fontSize="xs">Inherent</Badge>
                    ) }
                  </Td>
                  <Td>
                    <Badge colorScheme={ ext.success ? 'green' : 'red' } variant="subtle" fontSize="xs">
                      { ext.success ? 'Success' : 'Failed' }
                    </Badge>
                  </Td>
                  <Td isNumeric fontSize="sm">{ ext.fee !== '0.0000' ? `${ext.fee} DBC` : '-' }</Td>
                </Tr>
              )) }
            </Tbody>
          </Table>
        </Box>
      ) }
    </>
  );
};

export default SubstrateBlockDetail;
