import Koa from 'koa';
import Router from 'koa-router';
import cors from '@koa/cors'
import { useDouyin } from './douyin.js';

const app = new Koa();
const router = new Router();

app.use(cors({
  origin: '*',
  allowMethods: ['GET', 'POST'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
}));

router.get('/douyin', async (ctx) => {
  const { url, cookie } = ctx.query;
  if (!url || !cookie) {
    ctx.status = 400;
    ctx.body = { error: 'Missing url or cookie parameter' };
    return;
  }

  try {
    const data = await useDouyin(url, cookie);
    ctx.body = data;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});

app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 1145;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});