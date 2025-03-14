// 是否是生产环境
const isProduction = process.env.NODE_ENV === 'production';
// 开发环境baseUrl
const baseUrl = isProduction ? '/nestapi/machine' : 'http://localhost:3001/machine';
import { useToast } from '@chakra-ui/react';

// 获取机器列表数据
export async function fetchMachineData(address: any) {
  // const url = `/nestapi/machine?address=${encodeURIComponent(address)}`;
  const url = `${baseUrl}?address=${encodeURIComponent(address)}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data; // 返回数据
  } catch (error) {
    console.error('Error fetching machine data:', error);
    throw error; // 抛出错误，供调用者处理
  }
}

// 创建机器
export async function createMachine(req: any) {
  // const url = '/nestapi/machine';

  const url = baseUrl;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });
    console.log(response, '创建机器返回的数据');

    if (response.ok) {
      const data = await response.json();
      return data; // 返回创建结果
    } else {
      const toast = useToast();
      toast({
        title: '错误',
        description: '请求失败',
        status: 'error',
        duration: 5000,
      });
      console.log(response, 'responseresponseresponseresponseresponse');
    }
  } catch (error) {
    const toast = useToast();

    console.error('Error creating machine:', error);
    toast({
      title: '错误',
      description: '请求失败',
      status: 'error',
      duration: 5000,
    });
  }
}

// 删除机器
export async function deleteMachine(id: any) {
  // /nestapi/machine
  try {
    const response = await fetch(`${baseUrl}/?id=${id}`, {
      method: 'DELETE', // 指定 DELETE 方法
      headers: {
        'Content-Type': 'application/json', // 可选，视后端要求
      },
    });

    if (!response.ok) {
      throw new Error(`删除失败: ${response.status} ${response.statusText}`);
    }

    const result = await response.json(); // 假设后端返回 JSON 数据
    console.log('删除成功:', result);
    return result;
  } catch (error: any) {
    console.error('删除机器出错:', error.message);
    throw error;
  }
}

// 获得时间戳
export async function usStake(mashineId: any) {
  // const url = `/nestapi/machine?address=${encodeURIComponent(address)}`;
  const url = `${baseUrl}/unStake?mashineId=${mashineId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data; // 返回数据
  } catch (error) {
    console.error('Error fetching machine data:', error);
    throw error; // 抛出错误，供调用者处理
  }
}
