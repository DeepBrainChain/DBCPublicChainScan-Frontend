import { useMemo } from 'react';

// 定义多合约地址映射
const CONTRACT_ADDRESSES: any = {
  'www.dbcscan.io': {
    NFT_CONTRACT_ADDRESS: '0xFDB11c63b82828774D6A9E893f85D1998E6B36BF', // 正式环境的 NFT 合约
    DLC_TOKEN_ADDRESS: '0x6f8F70C74FE7d7a61C8EAC0f35A4Ba39a51E1BEe', // 另一个正式环境的合约地址
    STAKING_CONTRACT_ADDRESS_LONG: '0x3c059dbe0f42d65acd763c3c3da8b5a1b12bb74f', // 示例：质押合约
    STAKING_CONTRACT_ADDRESS_SHORT: '0x6268aba94d0d0e4fb917cc02765f631f309a7388', // 示例：质押合约
    DBC_CONTRACT_ADDRESS: '0xb3Fe9A054Fb1F8e8b01d54EA8FA75BE80856f073',
    // CPU合约
    CPU_CONTRACT_ADDRESS_NFT: '0xFDB11c63b82828774D6A9E893f85D1998E6B36BF',
    CPU_CONTRACT_ADDRESS_STAKING: '0x97480a75a19281dd0ee289aae30eee21119f9c6b',
    CPU_CONTRACT_ADDRESS_DLC: '0x6f8F70C74FE7d7a61C8EAC0f35A4Ba39a51E1BEe',
    CPU_CONTRACT_ADDRESS_SIGNIN: 'https://health0.deepbrainchain.org',
    // gpt卡片数据
    GPT_CONTRACT_ADDRESS_CARD: '0xE7871f903AEb0379095bC830819A7Ef4E120cf16',
    // nest代理地址
    NEST_CONTRACT_ADDRESS: 'http://47.128.74.45:3001',
    // 添加更多合约地址...
  },
  'dbcscan.io': {
    NFT_CONTRACT_ADDRESS: '0xFDB11c63b82828774D6A9E893f85D1998E6B36BF', // 正式环境的 NFT 合约
    DLC_TOKEN_ADDRESS: '0x6f8F70C74FE7d7a61C8EAC0f35A4Ba39a51E1BEe', // 另一个正式环境的合约地址
    STAKING_CONTRACT_ADDRESS_LONG: '0x3c059dbe0f42d65acd763c3c3da8b5a1b12bb74f', // 示例：质押合约
    STAKING_CONTRACT_ADDRESS_SHORT: '0x6268aba94d0d0e4fb917cc02765f631f309a7388', // 示例：质押合约
    DBC_CONTRACT_ADDRESS: '0xb3Fe9A054Fb1F8e8b01d54EA8FA75BE80856f073',
    // CPU合约
    CPU_CONTRACT_ADDRESS_NFT: '0xFDB11c63b82828774D6A9E893f85D1998E6B36BF',
    CPU_CONTRACT_ADDRESS_STAKING: '0x97480a75a19281dd0ee289aae30eee21119f9c6b',
    CPU_CONTRACT_ADDRESS_DLC: '0x6f8F70C74FE7d7a61C8EAC0f35A4Ba39a51E1BEe',
    CPU_CONTRACT_ADDRESS_SIGNIN: 'https://health0.deepbrainchain.org',
    // gpt卡片数据
    GPT_CONTRACT_ADDRESS_CARD: '0xE7871f903AEb0379095bC830819A7Ef4E120cf16',
    // nest代理地址
    NEST_CONTRACT_ADDRESS: 'http://47.128.74.45:3001',
    // 添加更多合约地址...
  },
  'testnet.dbcscan.io': {
    NFT_CONTRACT_ADDRESS: '0x52bd5f60d6d1e03b15418884252b16d146287254', // 测试环境的 NFT 合约
    DLC_TOKEN_ADDRESS: '0xa0fa2b36eFaa2Bec826850C13924850DB0Aa41B7', // 另一个测试环境的合约地址
    STAKING_CONTRACT_ADDRESS_LONG: '0x7FDC6ed8387f3184De77E0cF6D6f3B361F906C21', // 示例：质押合约
    STAKING_CONTRACT_ADDRESS_SHORT: '0x59bb02e28e8335c38a275eb0efd158f0065a447d', // 示例：质押合约
    DBC_CONTRACT_ADDRESS: '0x8CD8F5517ab18edfA7c121140B03229cD0771B83',
    // CPU合约
    CPU_CONTRACT_ADDRESS_NFT: '0x52bd5f60d6d1e03b15418884252b16d146287254',
    CPU_CONTRACT_ADDRESS_STAKING: '0xa6978d5c281f3c6a94451a8e6b60e6a3958a668d',
    CPU_CONTRACT_ADDRESS_DLC: '0xa0fa2b36eFaa2Bec826850C13924850DB0Aa41B7',
    CPU_CONTRACT_ADDRESS_SIGNIN: 'https://health-test.deepbrainchain.org',
    // gpt卡片数据
    GPT_CONTRACT_ADDRESS_CARD: '0xC9EA0742E650110A1df5Af1ACe4A3963136cf4Ec',
    // nest代理地址
    NEST_CONTRACT_ADDRESS: 'http://3.0.25.131:3001',

    // 添加更多合约地址...
  },
  localhost: {
    NFT_CONTRACT_ADDRESS: '0x52bd5f60d6d1e03b15418884252b16d146287254', // 本地开发环境的 NFT 合约
    DLC_TOKEN_ADDRESS: '0xa0fa2b36eFaa2Bec826850C13924850DB0Aa41B7', // 使用测试环境的地址
    STAKING_CONTRACT_ADDRESS_LONG: '0x7FDC6ed8387f3184De77E0cF6D6f3B361F906C21', // 示例：质押合约
    STAKING_CONTRACT_ADDRESS_SHORT: '0x59bb02e28e8335c38a275eb0efd158f0065a447d', // 示例：质押合约
    DBC_CONTRACT_ADDRESS: '0x8CD8F5517ab18edfA7c121140B03229cD0771B83',
    // CPU合约
    CPU_CONTRACT_ADDRESS_NFT: '0x52bd5f60d6d1e03b15418884252b16d146287254',
    CPU_CONTRACT_ADDRESS_STAKING: '0xa6978d5c281f3c6a94451a8e6b60e6a3958a668d',
    CPU_CONTRACT_ADDRESS_DLC: '0xa0fa2b36eFaa2Bec826850C13924850DB0Aa41B7',
    CPU_CONTRACT_ADDRESS_SIGNIN: 'https://health-test.deepbrainchain.org',
    // gpt卡片数据
    GPT_CONTRACT_ADDRESS_CARD: '0xC9EA0742E650110A1df5Af1ACe4A3963136cf4Ec',
    // nest代理地址
    NEST_CONTRACT_ADDRESS: 'http://3.0.25.131:3001',

    // 添加更多合约地址...
  },
} as const;

// 类型定义，确保类型安全
type Environment = keyof typeof CONTRACT_ADDRESSES;
type ContractNames = keyof (typeof CONTRACT_ADDRESSES)['localhost']; // 以 localhost 的合约名为基准

export function useContractAddresses() {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const contractAddresses = useMemo(() => {
    const env = hostname as Environment;
    return CONTRACT_ADDRESSES[env] || CONTRACT_ADDRESSES['localhost'];
  }, [hostname]);

  return contractAddresses;
}

// 可选：单个地址的便捷访问
export function useContractAddress(contractName: ContractNames) {
  const addresses = useContractAddresses();
  return addresses[contractName];
}
