const mysql = require('mysql');
const { dbConfig } = require('../config');

const pool = mysql.createPool(dbConfig);

//创建查询语句函数
const query = (sql, values) => {
    return new Promise((reslove, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, values, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        reslove(data);
                    }
                })
            }
        })
    })
}


module.exports = {
    query
};