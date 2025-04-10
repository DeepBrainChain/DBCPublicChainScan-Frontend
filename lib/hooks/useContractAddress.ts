import { useMemo } from 'react';

// 定义多合约地址映射
const CONTRACT_ADDRESSES: any = {
  'www.dbcscan.io': {
    NFT_CONTRACT_ADDRESS: '0xFDB11c63b82828774D6A9E893f85D1998E6B36BF', // 主网长租NFT 合约
    DLC_TOKEN_ADDRESS: '0x6f8F70C74FE7d7a61C8EAC0f35A4Ba39a51E1BEe', // 主网长租DLC合约地址
    STAKING_CONTRACT_ADDRESS_LONG: '0x3c059dbe0f42d65acd763c3c3da8b5a1b12bb74f', // 主网长租质押合约
    STAKING_CONTRACT_ADDRESS_SHORT: '0x6268aba94d0d0e4fb917cc02765f631f309a7388', // 主网短租质押合约
    CPU_CONTRACT_ADDRESS_NFT: '0xFDB11c63b82828774D6A9E893f85D1998E6B36BF', //主网带宽挖矿NFT
    CPU_CONTRACT_ADDRESS_STAKING: '0xc663ee691f98d80e5f1cce3c9ad53a14da676a23', //主网带宽挖矿质押
    CPU_CONTRACT_ADDRESS_DLC: '0x6f8F70C74FE7d7a61C8EAC0f35A4Ba39a51E1BEe', //主网带宽挖矿DLC
    CPU_CONTRACT_ADDRESS_SIGNIN: 'https://health0.deepbrainchain.org',
    DBC_CONTRACT_ADDRESS: '0xb3Fe9A054Fb1F8e8b01d54EA8FA75BE80856f073',
    // gpt卡片数据
    GPT_CONTRACT_ADDRESS_CARD: '0xE7871f903AEb0379095bC830819A7Ef4E120cf16',
    // 质押dbc之前确认是否在地域内
    DBC_CONTRACT_ADDRESS2: '0xefaF6c5980CCf4CAD5c5Ee0D423BbEA66452be79',
  },
  'dbcscan.io': {
    NFT_CONTRACT_ADDRESS: '0xFDB11c63b82828774D6A9E893f85D1998E6B36BF', // 主网长租NFT 合约
    DLC_TOKEN_ADDRESS: '0x6f8F70C74FE7d7a61C8EAC0f35A4Ba39a51E1BEe', // 主网长租DLC合约地址
    STAKING_CONTRACT_ADDRESS_LONG: '0x3c059dbe0f42d65acd763c3c3da8b5a1b12bb74f', // 主网长租质押合约
    STAKING_CONTRACT_ADDRESS_SHORT: '0x6268aba94d0d0e4fb917cc02765f631f309a7388', // 主网短租质押合约
    CPU_CONTRACT_ADDRESS_NFT: '0xFDB11c63b82828774D6A9E893f85D1998E6B36BF', //主网带宽挖矿NFT
    CPU_CONTRACT_ADDRESS_STAKING: '0xc663ee691f98d80e5f1cce3c9ad53a14da676a23', //主网带宽挖矿质押
    CPU_CONTRACT_ADDRESS_DLC: '0x6f8F70C74FE7d7a61C8EAC0f35A4Ba39a51E1BEe', //主网带宽挖矿DLC
    CPU_CONTRACT_ADDRESS_SIGNIN: 'https://health0.deepbrainchain.org',
    // gpt卡片数据
    DBC_CONTRACT_ADDRESS: '0xb3Fe9A054Fb1F8e8b01d54EA8FA75BE80856f073',
    GPT_CONTRACT_ADDRESS_CARD: '0xE7871f903AEb0379095bC830819A7Ef4E120cf16',
    // 质押dbc之前确认是否在地域内
    DBC_CONTRACT_ADDRESS2: '0xefaF6c5980CCf4CAD5c5Ee0D423BbEA66452be79',
  },
  'testnet.dbcscan.io': {
    NFT_CONTRACT_ADDRESS: '0x905dE58579886C5afe9B6406CFDE82bd6a1087C1', // 测试长租NFT 合约
    DLC_TOKEN_ADDRESS: '0xa0fa2b36eFaa2Bec826850C13924850DB0Aa41B7', // 测试长租DLC合约地址
    STAKING_CONTRACT_ADDRESS_LONG: '0x7FDC6ed8387f3184De77E0cF6D6f3B361F906C21', // 测试长租质押合约
    STAKING_CONTRACT_ADDRESS_SHORT: '0x59bb02e28e8335c38a275eb0efd158f0065a447d', // 测试短租质押合约
    DBC_CONTRACT_ADDRESS: '0x8CD8F5517ab18edfA7c121140B03229cD0771B83',
    CPU_CONTRACT_ADDRESS_NFT: '0x52bd5f60d6d1e03b15418884252b16d146287254', //测试带宽挖矿NFT,
    CPU_CONTRACT_ADDRESS_STAKING: '0xa6978d5c281f3c6a94451a8e6b60e6a3958a668d', //测试带宽挖矿质押,
    CPU_CONTRACT_ADDRESS_DLC: '0xa0fa2b36eFaa2Bec826850C13924850DB0Aa41B7', //测试带宽挖矿DLC
    CPU_CONTRACT_ADDRESS_SIGNIN: 'https://health-test.deepbrainchain.org',
    // gpt卡片数据
    GPT_CONTRACT_ADDRESS_CARD: '0xC9EA0742E650110A1df5Af1ACe4A3963136cf4Ec',
    // 质押dbc之前确认是否在地域内
    DBC_CONTRACT_ADDRESS2: '0xF9335c71583132d58E5320f73713beEf6da5257D',

    // 添加更多合约地址...
  },
  localhost: {
    NFT_CONTRACT_ADDRESS: '0x905dE58579886C5afe9B6406CFDE82bd6a1087C1', // 测试长租NFT 合约
    DLC_TOKEN_ADDRESS: '0xa0fa2b36eFaa2Bec826850C13924850DB0Aa41B7', // 测试长租DLC合约地址
    STAKING_CONTRACT_ADDRESS_LONG: '0x7FDC6ed8387f3184De77E0cF6D6f3B361F906C21', // 测试长租质押合约
    STAKING_CONTRACT_ADDRESS_SHORT: '0x59bb02e28e8335c38a275eb0efd158f0065a447d', // 测试短租质押合约
    DBC_CONTRACT_ADDRESS: '0x8CD8F5517ab18edfA7c121140B03229cD0771B83',
    CPU_CONTRACT_ADDRESS_NFT: '0x52bd5f60d6d1e03b15418884252b16d146287254', //测试带宽挖矿NFT,
    CPU_CONTRACT_ADDRESS_STAKING: '0xa6978d5c281f3c6a94451a8e6b60e6a3958a668d', //测试带宽挖矿质押,
    CPU_CONTRACT_ADDRESS_DLC: '0xa0fa2b36eFaa2Bec826850C13924850DB0Aa41B7', //测试带宽挖矿DLC
    CPU_CONTRACT_ADDRESS_SIGNIN: 'https://health-test.deepbrainchain.org',
    // gpt卡片数据
    GPT_CONTRACT_ADDRESS_CARD: '0xC9EA0742E650110A1df5Af1ACe4A3963136cf4Ec',
    // 质押dbc之前确认是否在地域内
    DBC_CONTRACT_ADDRESS2: '0xF9335c71583132d58E5320f73713beEf6da5257D',
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
