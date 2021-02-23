const Koa = require('koa');
const bodyParser = require('koa-bodyparser')
const app = new Koa();
const port = process.env.PORT || 3000;
const { logger, cors, token } = require('./middleware');
const { verifyToken } = require('./utils')
const router = require('./router');

//中间件
// 打印数据
app.use(logger())
// 解决跨域问题
app.use(cors)
// 获取post请求的参数
app.use(bodyParser())
// app.use(token());
//设置路由
router(app);
app.listen(port, () => {
    console.log(`Node.js Koa running in 127:0.0.1:${port}`);
})
