import { Text, Menu, MenuButton, MenuItem, MenuList, MenuButtonProps, Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { FaUserPlus, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { useContractActions } from '../../../ui/mining/deep-link/hooks/stake-before';

const langIcon = <FaUserCircle style={{ color: 'var(--chakra-colors-blue-300)' }} />;

const LANG_MAP = {
  sign: {
    label: '注册',
    icon: <FaUserPlus />,
  },
  logout: {
    label: '注销',
    icon: <FaSignOutAlt />,
  },
} as const;

const LangSelect: React.FC<MenuButtonProps> = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  // 注册函数
  const handleSign = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  // 注销函数
  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleLanguageChange = (v: string) => {
    console.log(v);
    if (v === 'sign') {
      handleSign();
    } else if (v === 'logout') {
      handleLogout();
    }
  };

  return (
    <Menu autoSelect={false}>
      <MenuButton p="12px" {...props} disabled={isLoading}>
        {isLoading ? <Spinner size="sm" /> : langIcon}
      </MenuButton>
      <MenuList w="max-content" minW="120px">
        {Object.entries(LANG_MAP).map(([key, lang]) => (
          <MenuItem
            key={key}
            display="flex"
            alignItems="center"
            fontSize="sm"
            onClick={() => handleLanguageChange(key)}
            isDisabled={isLoading}
          >
            <Text mr="8px">{lang.icon}</Text>
            <Text>{lang.label}</Text>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default LangSelect;
