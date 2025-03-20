// api/index.js
import { useContractAddress } from '../../../../lib/hooks/useContractAddress';

interface RegisterParams {
  projectName?: string;
  stakingType?: number;
}

export function useContractActions(machineId: string) {
  const contractAddress = useContractAddress('CPU_CONTRACT_ADDRESS_SIGNIN');

  const register = async ({ projectName = 'DeepLink BandWidth', stakingType = 2 }: RegisterParams = {}) => {
    const url = `${contractAddress}/api/v0/contract/register`;
    const data = {
      project_name: projectName,
      staking_type: stakingType, // 保持数字类型，与成功的 JSON 示例一致
      machine_id: machineId,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Apifox/1.0.0 (https://apifox.com)', // 与成功案例一致
          Accept: '*/*',
          Connection: 'keep-alive',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        return await response.json();
      } else {
        const errorText = await response.text();
        throw new Error(`Register failed with status ${response.status}: ${errorText}`);
      }
    } catch (error) {
      throw error;
    }
  };

  const unregister = async ({ projectName = 'DeepLink BandWidth', stakingType = 2 }: RegisterParams = {}) => {
    const url = `${contractAddress}/api/v0/contract/unregister`;
    const data = {
      project_name: projectName,
      staking_type: stakingType, // 保持数字类型
      machine_id: machineId,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
          Accept: '*/*',
          Connection: 'keep-alive',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        return await response.json();
      } else {
        const errorText = await response.text();
        throw new Error(`Unregister failed with status ${response.status}: ${errorText}`);
      }
    } catch (error) {
      throw error;
    }
  };

  return { register, unregister };
}
