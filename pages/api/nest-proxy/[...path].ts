import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

const BACKEND_URL = 'http://8.214.55.62:3001';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { path } = req.query;
  const targetUrl = `${BACKEND_URL}/${Array.isArray(path) ? path.join('/') : path || ''}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 300000);

  try {
    const fetchOptions: RequestInit = {
      method: req.method,
      headers: { ...req.headers, host: '8.214.55.62' } as any,
      signal: controller.signal,
    };

    // 修复 body 处理
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body !== undefined) {
      fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
      fetchOptions.headers = {
        ...fetchOptions.headers,
        'Content-Type': 'application/json',
      };
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
