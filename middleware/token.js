const { verifyToken } = require('../utils')
module.exports = (option) => async (ctx, next) => {
    let { url } = ctx;
    if (url.indexOf('/login') > -1) await next();
    else {
        try {
            //get Token
            const token = ctx.header.authorization;
            if (token) {
                try {
                    const res = verifyToken(token);
                    if (res && res.exp <= new Date() / 1000) {
                        ctx.body = {
                            message: 'token过期',
                            code: 3
                        };
                    } else {
                        await next();
                    }
                } catch (err) {
                    console.log(err);
                }
            }
            //进入下一个中间件
            await next();
        } catch (err) {
            console.log(err);
        }
    }

}