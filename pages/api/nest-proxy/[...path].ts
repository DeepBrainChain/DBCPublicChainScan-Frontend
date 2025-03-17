import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

const BACKEND_URL = 'http://8.214.55.62:3001'; // 后端基础地址

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { path } = req.query; // 获取动态路径
  const targetUrl = `${BACKEND_URL}/${Array.isArray(path) ? path.join('/') : path || ''}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 分钟超时

  try {
    const backendRes = await fetch(targetUrl, {
      method: req.method,
      headers: { ...req.headers, host: '8.214.55.62' } as any, // 确保后端收到正确 host
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    backendRes.headers.forEach((value, key) => res.setHeader(key, value));
    res.status(backendRes.status).send(await backendRes.buffer());
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
      sizeLimit: '100mb', // 支持大请求体
    },
    externalResolver: true, // 允许外部处理
  },
};
