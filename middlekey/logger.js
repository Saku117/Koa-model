const fs = require('fs');
module.exports = (option) => async (ctx, next) => {
    const StartTime = Date.now(); //开始时间
    const RequestTime = new Date(); //请求时间
    await next(); //执行下一个中间件
    const ms = Date.now() - StartTime;
    let logout = `ip:${ctx.request.ip}--请求时间:${RequestTime} -- 请求模式:${ctx.method} -- 请求URL:${ctx.url} -- ${ms}ms`
    // 输出日志文件
    fs.appendFileSync('./log.txt', logout + '\n')
}