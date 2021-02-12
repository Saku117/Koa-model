const Koa = require('koa');
const app = new Koa();
const port = process.env.PORT || 3000;
const { logger } = require('./middlekey')
const router = require('./router');


//中间件
app.use(logger())


//设置路由
router(app);
app.listen(port, () => {
    console.log(`Node.js Koa running in 127:0.0.1:${port}`);
})