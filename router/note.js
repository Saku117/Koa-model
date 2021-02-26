const db = require('../db')
const moment = require('moment');
//引入router
const router = require("koa-router")();
const { utils, generateToken } = require('../utils')
const { sqlConfig } = require('../config')

/**
 * 添加笔记
 */
router.post('/note/addNote', async ctx => {
    const data = utils.filter(ctx.request.body, ["name", "uid"]);
    const res = utils.formatData(data, [{ key: 'name', type: 'string' }]);
    if (!res) return ctx.body = {
        status: 403,
        message: '参数类型错误！'
    }
    const { name, uid } = data;
    // 获得本地时间
    const create_time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    const values = [name, uid, create_time]
    await db
        .query(sqlConfig.note.addNoteSql, values)
        .then(res => {
            console.log(res);
            let { insertId: id } = res;
            if (id) {
                ctx.body = {
                    status: 200,
                    data: {
                        id,
                    },
                    message: '添加笔记成功'
                }
            } else {
                ctx.body = {
                    status: 400,
                    message: '系统繁忙！'
                }
            }
        })
        .catch(err => {
            if (+err.errno === 1062) {
                //笔记本不能重复
                ctx.body = {
                    status: 401,
                    msg: "笔记本已存在！",
                };
            } else {
                ctx.body = {
                    status: 400,
                    message: '系统繁忙！'
                };
            }
        })

})

/**
 * 修改笔记名称
 */
router.post('/note/modifyNote', async ctx => {
    const data = utils.filter(ctx.request.body, ["name", "id", "uid"]);
    console.log(data);
    const res = utils.formatData(data, [
        { key: 'name', type: 'string' },
        { key: 'id', type: 'number' },
        { key: 'uid', type: 'number' }
    ])
    if (!res) return ctx.body = {
        status: 403,
        message: '参数类型错误！'
    }
    console.log(ctx.state.uid);
    const { name, id, uid } = data;
    const values = [name, id, uid];
    await db
        .query(sqlConfig.note.modifyNoteSql, values)
        .then(res => {
            ctx.body = { status: 200, message: '修改成功' };
        })
        .catch(err => {
            ctx.body = { status: 400, message: '系统繁忙！' }
        })
})

/**
 * 我的笔记列表
 */
router.post('/note/myNote', async ctx => {
    const data = utils.filter(ctx.request.body, ["pageSize", "pageNum", "type", "uid"]);
    const res = utils.formatData(data, [{ key: "type", type: "number" }]);
    if (!res) return ctx.body = {
        status: 403,
        message: '参数类型错误！'
    }
    let { pageSize = 15, pageNum = 1, type = 0, uid } = data;
    pageSize = Number(pageSize);
    pageNum = Number(pageNum);
    let offset = (pageNum - 1) * pageSize;
    let sql1 = `SELECT count(1) FROM  t_note WHERE uid=${uid} AND is_delete=0;`,
        sql = `SELECT name,id,create_time,update_time  FROM  t_note WHERE uid=${uid} AND is_delete=0 ORDER BY create_time DESC`;
    if (+type === 1) {
        sql += `limit${offset},${pageSize}`;
    }
    const values = [pageSize, pageNum, type, uid];
    await db
        .query(sql1 + sql)
        .then(res => {
            let res1 = res[0],
                res2 = res[1],
                total = 0,
                list = [];
            if (res1 && res1.length > 0 && res2 && res2.length > 0) {
                total = res1[0]["count(1)"];
                list = res2;
            };
            ctx.body = {
                status: 200,
                data: {
                    list,
                    pageSize,
                    total,
                },
            };
        })
        .catch(err => {
            ctx.body = { status: 400, message: '系统繁忙！' }
        })
})

/**
 * 删除笔记
 */
router.post(`/note/romoveNote`, async ctx => {
    const data = utils.filter(ctx.request.body, ["id", "uid"]);
    const res = utils.formatData(data, [
        { key: 'id', type: 'number' },
        { key: 'uid', type: 'number' }
    ]);
    if (!res) return ctx.body = {
        status: 403,
        message: '参数类型错误！'
    }

    let { id, uid } = data;
    let sql = `UPDATE t_note set is_delete=1 WHERE id=${id} AND uid=${uid};`,
        sql1 = `UPDATE t_blog set is_delete=1 WHERE note_id=${id}  AND uid=${uid}`;
    await db
        .query(sql + sql1)
        .then(res => {
            ctx.body = {
                status: 200,
                messgae: '删除笔记成功'
            }
        })
        .catch(err => {
            ctx.body = { status: 400, message: '系统繁忙！' }
        })
})
module.exports = router;