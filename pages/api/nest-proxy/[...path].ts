import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

// const BACKEND_URL = 'http://47.128.74.45:3001';
const BACKEND_URL = 'http://3.0.25.131:3001';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { path, ...queryParams } = req.query; // 分离路径和查询参数
  const basePath = Array.isArray(path) ? path.join('/') : path || '';
  const queryString = new URLSearchParams(queryParams as Record<string, string>).toString();
  const targetUrl = `${BACKEND_URL}/${basePath}${queryString ? `?${queryString}` : ''}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 300000);

  try {
    const fetchOptions: RequestInit = {
      method: req.method,
      // headers: { ...req.headers, host: '47.128.74.45' } as any,
      headers: { ...req.headers, host: '3.0.25.131' } as any,
      signal: controller.signal,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body !== undefined) {
      fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
      fetchOptions.headers = { ...fetchOptions.headers, 'Content-Type': 'application/json' };
    }

    console.log('代理请求:', { targetUrl, method: req.method, body: fetchOptions.body });

    const backendRes = await fetch(targetUrl, fetchOptions as any);

    clearTimeout(timeoutId);
    backendRes.headers.forEach((value, key) => res.setHeader(key, value));
    const responseBody = await backendRes.buffer();
    console.log('后端响应:', { status: backendRes.status, body: responseBody.toString() });
    res.status(backendRes.status).send(responseBody);
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('代理错误:', error);
    res.status(504).json({ error: 'Request timed out or failed' });
  }
};

export default handler;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
    externalResolver: true,
  },
};
