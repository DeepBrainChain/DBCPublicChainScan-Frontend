import { Table, Tbody, Tr, Th, Link } from '@chakra-ui/react';
import React from 'react';

import type { VerifiedContract } from 'types/api/contracts';
import type {
  VerifiedContractsSorting,
  VerifiedContractsSortingField,
  VerifiedContractsSortingValue,
} from 'types/api/verifiedContracts';

import { currencyUnits } from 'lib/units';
import IconSvg from 'ui/shared/IconSvg';
import getNextSortValue from 'ui/shared/sort/getNextSortValue';
import { default as Thead } from 'ui/shared/TheadSticky';
import { SORT_SEQUENCE } from 'ui/verifiedContracts/utils';

import VerifiedContractsTableItem from './VerifiedContractsTableItem';
import { useTranslation } from 'next-i18next';
interface Props {
  data: Array<VerifiedContract>;
  sort: VerifiedContractsSortingValue | undefined;
  setSorting: (val: VerifiedContractsSortingValue | undefined) => void;
  isLoading?: boolean;
}

const VerifiedContractsTable = ({ data, sort, setSorting, isLoading }: Props) => {
  const { t } = useTranslation('common');

  const sortIconTransform = sort?.includes('asc' as VerifiedContractsSorting['order'])
    ? 'rotate(-90deg)'
    : 'rotate(90deg)';

  const onSortToggle = React.useCallback(
    (field: VerifiedContractsSortingField) => () => {
      const value = getNextSortValue<VerifiedContractsSortingField, VerifiedContractsSortingValue>(
        SORT_SEQUENCE,
        field
      )(sort);
      setSorting(value);
    },
    [sort, setSorting]
  );

  return (
    <Table variant="simple" size="sm">
      <Thead top={80}>
        <Tr>
          <Th width="50%">{t('deep_contract')}</Th>
          <Th width="130px" isNumeric>
            <Link
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              onClick={isLoading ? undefined : onSortToggle('balance')}
              columnGap={1}
            >
              {sort?.includes('balance') && <IconSvg name="arrows/east" boxSize={4} transform={sortIconTransform} />}
              {t('deep_balance')} {currencyUnits.ether}
            </Link>
          </Th>
          <Th width="130px" isNumeric>
            <Link
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              onClick={isLoading ? undefined : onSortToggle('txs_count')}
              columnGap={1}
            >
              {sort?.includes('txs_count') && <IconSvg name="arrows/east" boxSize={4} transform={sortIconTransform} />}
              {t('deep_txs')}
            </Link>
          </Th>
          <Th width="50%">{t('deep_compiler_version')}</Th>
          <Th width="80px">{t('deep_settings')}</Th>
          <Th width="150px">{t('deep_verified')}</Th>
          <Th width="130px">{t('deep_license')}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data.map((item, index) => (
          <VerifiedContractsTableItem
            key={item.address.hash + (isLoading ? index : '')}
            data={item}
            isLoading={isLoading}
          />
        ))}
      </Tbody>
    </Table>
  );
};

export default React.memo(VerifiedContractsTable);
