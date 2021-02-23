const db = require('../db')
const moment = require('moment');
//引入router
const router = require("koa-router")();
const { utils, generateToken } = require('../utils')
const { sqlConfig } = require('../config')
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

/**
 * 登录接口
 */
router.post('/user/login', async (ctx) => {
    const data = utils.filter(ctx.request.body, ["name", "password"]);
    const res = utils.formatData(data, [
        { key: 'name', type: 'string' },
        { key: 'password', type: 'string' }
    ])
    if (!res) {
        return (ctx.status = 400, ctx.message = `参数错误`)
    }
    const { name, password } = data;
    const sql = sqlConfig.user.loginSql;
    const values = [name, password];
    await db.query(sql, values).then(res => {
        if (res && res.length > 0) {
            let val = res[0];
            let uid = val.uid;
            ctx.state.uid = uid;
            let token = generateToken({
                name: val.name,
                uid: val.uid
            });
            ctx.body = {
                token,
                status: 200,
                message: `登陆成功`,
                uid,
            }
        } else {
            ctx.body = {
                status: 400,
                message: `账号或者密码输入错误`
            }
        }
    }).catch(e => {
        ctx.body = {
            status: 404,
            message: `系统繁忙！`
        }
    })
})

/**
 * 注册接口
 */
router.post('/user/register', async (ctx) => {
    const data = utils.filter(ctx.request.body, ["name", "password"]);
    const res = utils.formatData(data, [
        { key: 'name', type: 'string' },
        { key: 'password', type: 'string' }
    ])
    if (!res) return (ctx.body = {
        status: 400,
        message: '参数类型错误！'
    })
    let { name, password } = data;
    let create_time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    let values = [name, password, create_time];
    await db.query(sqlConfig.user.rigisterSql, values)
        .then(res => {
            let { insertId: id } = res;
            if (id) {
                ctx.body = {
                    status: 200,
                    message: `注册成功`,
                }
            } else {
                ctx.body = {
                    status: 400,
                    message: `注册失败,请重新注册`
                }
            }
        }).catch(err => {
            ctx.body = {
                status: 400,
                message: `该用户名已被使用`
            }
        })
})

/**
 * 修改密码接口
 */
router.post('/user/updatepassword', async ctx => {
    const data = utils.filter(ctx.request.body, ["name", "oldPassword", "newPassword"]);
    const res = utils.formatData(data, [
        { key: 'name', type: 'string' },
        { key: 'oldPassword', type: 'string' },
        { key: 'newPassword', type: 'string' }
    ])
    if (!res) return ctx.body = {
        status: 400,
        message: '参数类型错误'
    }
    let { name, oldPassword, newPassword } = data;
    let values = [name, oldPassword];
    await db.query(sqlConfig.user.loginSql, values)
        .then(async res => {
            if (res.length === 0) return ctx.body = {
                status: 400,
                message: `没有该用户`
            }
            let { uid } = res[0];
            let value = [newPassword, uid]
            console.log(value);
            await db.query(sqlConfig.user.updatePwdSql, value)
                .then(res => {
                    console.log(res);
                    let { affectedRows, changedRows } = res;
                    console.log(affectedRows, changedRows);
                    if (affectedRows && changedRows) {
                        ctx.body = {
                            status: 200,
                            message: '修改密码成功'
                        }
                    } else if (affectedRows) {
                        ctx.body = {
                            status: 401,
                            message: `新密码与原密码相同`
                        }
                    }
                }).catch(err => {
                    ctx.body = {
                        status: 400,
                        message: '网络错误'
                    }
                })
        })

})


//导出user
module.exports = router;