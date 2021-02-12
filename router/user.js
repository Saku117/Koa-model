const db = require('../db')
//引入router
const router = require("koa-router")();

router.get('/user', async (ctx, next) => {
    let sql = `SELECT * from t_user`
    await db.query(sql)
        .then((data) => {
            console.log(data);
            ctx.body = data;
        })
        .catch((e) => {
            ctx.body = e;
        })
});


//导出user
module.exports = router;