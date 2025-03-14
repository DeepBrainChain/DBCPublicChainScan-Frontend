// 是否是生产环境
const isProduction = process.env.NODE_ENV === 'production';
// 开发环境baseUrl
const baseUrl = isProduction ? '/nestapi/machine' : 'http://localhost:3001/machine';
import axios from 'axios';

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

// 创建机器
export async function createMachine(req: any) {
  const url = baseUrl; // 保持您的 baseUrl，例如 'https://testnet.dbcscan.io/nestapi/machine'

  try {
    const response = await axios.post(url, req, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 100000000,
    });

    // axios 的 response.data 直接是解析后的 JSON
    return response.data; // 返回创建结果
  } catch (error: any) {
    if (error.response) {
      // 请求已发出，但服务器返回错误状态码（如 500）
      console.log(error.response, 'responseresponseresponseresponseresponse');
      return error.response; // 返回错误响应
    } else {
      // 请求未发出（如网络错误）
      console.log(error, 'responseresponseresponseresponseresponse');
      return error;
    }
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
