const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      // target: 'https://django-ecommerce-render.onrender.com/',
      target: 'http://localhost:8000/',
      changeOrigin: true,
    })
  );
};