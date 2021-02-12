module.exports = (option) => async (ctx, next) => {
    try {
        //get Token
        const token = ctx.header.authorization;
        if (token) {
            try {
                await verify(token);
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