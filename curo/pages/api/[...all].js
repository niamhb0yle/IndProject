import { createProxyMiddleware } from 'http-proxy-middleware';

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

const proxy = createProxyMiddleware({
  target: 'http://localhost:4000/api',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/',
  },
  logLevel: 'debug', // Optional: For debugging purposes
});

export default function (req, res) {
  if (req.method === 'OPTIONS') {
    res.end();
    return;
  }
  return proxy(req, res);
}
