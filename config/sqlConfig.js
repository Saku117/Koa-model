
const user = {
    loginSql: `SELECT uid FROM t_user WHERE name=? and password=? and is_delete=0`,
    rigisterSql: `INSERT INTO t_user(name,password,create_time) VALUES(?,?,?)`,
    queryUserSql: 'select * from  t_user where name=? and password=?',
    updatePwdSql: `update t_user set password=? where uid=?`,
}


module.exports = {
    user
}