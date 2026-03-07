import { Badge, HStack } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'next-i18next';

interface Props {
  roles: Array<string>;
  size?: 'sm' | 'md';
}

const ROLE_META: Record<string, { colorScheme: string; i18nKey: string }> = {
  validator: { colorScheme: 'purple', i18nKey: 'role_validator' },
  nominator: { colorScheme: 'blue', i18nKey: 'role_nominator' },
  councilMember: { colorScheme: 'green', i18nKey: 'role_council_member' },
  techcomm: { colorScheme: 'orange', i18nKey: 'role_techcomm' },
  onChainIdentity: { colorScheme: 'teal', i18nKey: 'role_on_chain_identity' },
  registrar: { colorScheme: 'yellow', i18nKey: 'role_registrar' },
  activeBlockAuthor: { colorScheme: 'red', i18nKey: 'role_active_block_author' },
  multisig: { colorScheme: 'pink', i18nKey: 'role_multisig' },
};

const RoleBadge = ({ roles, size = 'sm' }: Props) => {
  const { t } = useTranslation('common');

  if (!roles?.length) {
    return null;
  }

  return (
    <HStack spacing={ 2 } flexWrap="wrap">
      { roles.map((role, index) => (
        <Badge
          key={ `${role}-${index}` }
          colorScheme={ ROLE_META[role]?.colorScheme ?? 'gray' }
          variant="subtle"
          fontSize={ size === 'md' ? 'sm' : 'xs' }
          px={ size === 'md' ? 2.5 : 2 }
          py={ size === 'md' ? 1 : 0.5 }
          borderRadius="md"
          textTransform="none"
        >
          { t(ROLE_META[role]?.i18nKey ?? `role_${role}`, { defaultValue: role }) }
        </Badge>
      )) }
    </HStack>
  );
};

export default RoleBadge;
