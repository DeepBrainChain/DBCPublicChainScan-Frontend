async function rewrites() {
  return [
    { source: '/node-api/proxy/:slug*', destination: '/api/proxy' },
    { source: '/node-api/:slug*', destination: '/api/:slug*' },
    {
      source: '/nestapi/:path*', // 匹配 /nestapi/*
      destination: '/api/nestapi/:path*', // 重写到 /api/nestapi/*
    },
    // {
    //   source: '/nestapi/:path*',
    //   destination: 'http://8.214.76.106:3001/:path*', // :path* 直接附加到根路径
    // },
  ].filter(Boolean);
}

module.exports = rewrites;
