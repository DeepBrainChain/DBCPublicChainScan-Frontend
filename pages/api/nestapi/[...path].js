// pages/api/nestapi/[...path].js

const handler = async (nextReq, nextRes) => {
  const url = `http://localhost:3001/${nextReq.query.path?.join('/') || ''}`; // 移除 /nestapi/
  console.log('Proxying to:', url);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000); // 300 秒超时

    const apiRes = await fetch(url, {
      method: nextReq.method,
      headers: { 'Content-Type': 'application/json' },
      body: nextReq.body ? JSON.stringify(nextReq.body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await apiRes.text();
    nextRes.status(apiRes.status).send(data);
  } catch (error) {
    console.error('Proxy error:', error);
    nextRes.status(500).json({ code: 1001, msg: '代理错误', error: error.message });
  }
};

export default handler;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
};
