// 是否是生产环境
const isProduction = process.env.NODE_ENV === 'production';
// 开发环境baseUrl
const baseUrl = isProduction ? '/nestapi/gpu-machine' : 'http://localhost:3001/gpu-machine';
// const baseUrl = isProduction ? 'https://c00.reckonkvm.com/machine' : 'http://localhost:3001/machine';

// 获取机器列表数据
export async function fetchMachineDataGpu(address: any) {
  const url = `${baseUrl}/wallet/${address}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return response;
    }

    const data = await response.json();
    return data; // 返回数据
  } catch (error) {
    return error;
  }
}

// 创建机器
export async function createMachineGpu(req: any) {
  const url = baseUrl;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });
    if (response.ok) {
      const data = await response.json();
      return data; // 返回创建结果
    } else {
      return response;
    }
  } catch (error) {
    return error;
  }
}

// 根据机器ID删除机器

export async function deleteMachineGpu(id: string) {
  const url = `${baseUrl}/machine/${id}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data; // 返回创建结果
    } else {
      return response;
    }
  } catch (error) {
    return error;
  }
}
