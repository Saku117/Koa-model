
const user = {
    loginSql: `SELECT uid FROM t_user WHERE name=? and password=? and is_delete=0`,
    rigisterSql: `INSERT INTO t_user(name,password,create_time) VALUES(?,?,?)`,
    queryUserSql: 'select * from  t_user where name=? and password=?',
    updatePwdSql: `update t_user set password=? where uid=?`,
}
const note = {
    addNoteSql: `INSERT INTO t_note(name,uid,create_time) VALUES(?,?,?)`,
    modifyNoteSql: `update t_note set name=? where id=? AND uid=?`,
}


module.exports = {
    user,
    note,
}