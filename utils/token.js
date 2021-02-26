const jwt = require('jsonwebtoken');
const path = require('path')
const fs = require('fs')
module.exports = {
  /**
   * 生成token
   * @param {Number} data uid
   */
  generateToken (data) {
    let created = Math.floor(Date.now() / 1000);
    let cert = fs.readFileSync(path.join(__dirname, "../config/pri.pem"));
    let token = jwt.sign(
      {
        data,
        exp: created + 3600 * 24,
      },
      cert,
      { algorithm: "RS256" }
    );
    return token;
  },
  /**
   * 验证token
   * @param {*} token
   */
  verifyToken (token) {
    let cert = fs.readFileSync(path.join(__dirname, "../confih/pub.pem"));
    try {
      let result = jwt.verify(token, cert, { algorithms: ["RS256"] });
      let { exp = 0 } = result,
        current = Math.floor(Date.now() / 1000);
      if (current <= exp) {
        res = result.data || {};
      }
    } catch (e) {
      return e;
    }
    return res;
  },

};
