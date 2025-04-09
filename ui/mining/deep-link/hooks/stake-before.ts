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
      staking_type: stakingType,
      machine_id: machineId,
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1000000); // 10秒超时

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (response.ok) {
        return await response.json();
      } else {
        const errorText = await response.text();
        throw new Error(`Register failed with status ${response.status}: ${errorText}`);
      }
    } catch (error) {
      clearTimeout(timeout);
      throw error;
    }
  };

  const unregister = async (
    { projectName = 'DeepLink BandWidth', stakingType = 2 }: RegisterParams = {},
    retries = 3
  ) => {
    const url = `${contractAddress}/api/v0/contract/unregister`;
    const data = {
      project_name: projectName,
      staking_type: stakingType,
      machine_id: machineId,
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      console.log('Request timed out after 1000 seconds');
      controller.abort();
    }, 1000000); // 1000秒超时，与你成功的设置一致

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (response.ok) {
          return await response.json();
        } else {
          const errorText = await response.text();
          throw new Error(`Unregister failed with status ${response.status}: ${errorText}`);
        }
      } catch (error: any) {
        clearTimeout(timeout);
        console.error('Fetch error (attempt ${attempt}/${retries}):', {
          message: error.message,
          name: error.name,
          url,
          data,
        });

        if (attempt === retries) {
          throw new Error(`Unregister failed after ${retries} attempts: ${error.message}`);
        }
        console.log(`Retrying unregister... (${attempt}/${retries})`);
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt)); // 指数退避
      }
    }
  };

  return { register, unregister };
}
