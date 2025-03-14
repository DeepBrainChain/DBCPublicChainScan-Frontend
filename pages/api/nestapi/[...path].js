const handler = async (nextReq, nextRes) => {
  const backendHost = 'http://localhost:3001';
  const url = `${backendHost}/${nextReq.query.path?.join('/') || ''}`;
  console.log('Proxying to:', url);
  console.log('Request method:', nextReq.method, 'Body:', nextReq.body);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000);

    const fetchOptions = {
      method: nextReq.method,
      headers: { 'Content-Type': 'application/json' },
      body: nextReq.body ? JSON.stringify(nextReq.body) : undefined,
      signal: controller.signal,
    };
    console.log('Fetch options:', fetchOptions);

    const apiRes = await fetch(url, fetchOptions);

    clearTimeout(timeoutId);

    const data = await apiRes.text();
    console.log('Backend response:', apiRes.status, data);
    nextRes.status(apiRes.status).send(data);
  } catch (error) {
    console.error('Proxy error:', error);
    console.error('Error details:', error.cause); // Node.js 18+ 提供更多信息
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
