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
//     console.log(response, '创建机器返回的数据');

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

export async function createMachine(req: any) {
  const url = baseUrl;
  const timeout = 1200000; // 固定超时时间为 120 秒（可调整）

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
      signal: controller.signal, // 添加超时控制
    });
    clearTimeout(timeoutId); // 请求成功后清除超时

    console.log(response, '创建机器返回的数据');

    if (response.ok) {
      const data = await response.json();
      return data; // 返回创建结果
    } else {
      console.log(response, 'responseresponseresponseresponseresponse');
      return response; // 返回原始 response 给调用者处理
    }
  } catch (error) {
    clearTimeout(timeoutId); // 出错时也清除超时
    console.log(error, 'responseresponseresponseresponseresponse');
    return error; // 返回错误给调用者处理
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
