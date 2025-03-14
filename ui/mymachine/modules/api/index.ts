// 是否是生产环境
const isProduction = process.env.NODE_ENV === 'production';
// 开发环境baseUrl
const baseUrl = isProduction ? '/nestapi/machine' : 'http://localhost:3001/machine';

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
      console.log(response, 'responseresponseresponseresponseresponse');

      return response;
    }

    const data = await response.json();
    return data; // 返回数据
  } catch (error) {
    console.log(error, 'responseresponseresponseresponseresponse');
    return error;
  }
}

// 创建机器
// export async function createMachine(req: any) {
//   // const url = '/nestapi/machine';

//   const url = baseUrl;

//   try {
//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(req),
//     });
//     if (response.ok) {
//       const data = await response.json();
//       return data; // 返回创建结果
//     } else {
//       console.log(response, 'responseresponseresponseresponseresponse');

//       return response;
//     }
//   } catch (error) {
//     console.log(error, 'responseresponseresponseresponseresponse');
//     return error;
//   }
// }

// index.ts
export async function createMachine(req: any) {
  // 是否是生产环境
  const isProduction = process.env.NODE_ENV === 'production';
  // 开发环境baseUrl
  const url = isProduction ? 'https://testnet.dbcscan.io/api/nestapi/machine' : 'http://localhost:3001/machine';

  const timeout = 120000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    console.log('Status:', response.status, 'Raw:', await response.text());

    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(`请求失败: ${response.status}`);
    }
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Fetch error:', error);
    throw error;
  }
}

// 解除质押
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
      console.log(response, 'responseresponseresponseresponseresponse');

      return response;
    }

    const data = await response.json();
    return data; // 返回数据
  } catch (error) {
    console.log(error, 'responseresponseresponseresponseresponse');
    return error;
  }
}
