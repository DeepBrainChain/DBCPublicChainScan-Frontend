async function rewrites() {
  return [
    { source: '/node-api/proxy/:slug*', destination: '/api/proxy' },
    { source: '/node-api/:slug*', destination: '/api/:slug*' },
    { source: '/nestapi/:path*', destination: '/api/nest-proxy/:path*' }, // 处理所有 /nestapi/*
    // {
    //   source: '/nestapi/:path*',
    //   destination: 'http://8.214.76.106:3001/:path*', // :path* 直接附加到根路径
    // },
  ].filter(Boolean);
}

module.exports = rewrites;
