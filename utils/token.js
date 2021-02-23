const jwt = require('jsonwebtoken');
const serect = 'token';

module.exports = {
    generateToken (userinfo) { //创建token并导出
        const token = jwt.sign({
            name: userinfo.name,
            uid: userinfo.uid
        }, serect, { expiresIn: '1h' });
        return token;
    },
    verifyToken (token) {
        if (token) {
            let tk = token.split(' ')[1];
            // 解析
            let decoded = jwt.decode(tk, serect);
            return decoded;
        }
    }
};
