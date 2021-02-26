const IS = require('is')
const { generateToken, verifyToken } = require('./token')
const utils = {
  /**
   * 得到数据中过滤数组对应的值
   * @param {Object} params 数据 
   * @param {Array} filterArr 过滤数组
   */
  filter (params, filterArr) {
    if (IS.object(params) && IS.array(filterArr)) {
      let data = {};
      filterArr.forEach(item => {
        let value = params[item];
        if (!!value) {
          data[item] = value;
        }
      });
      return data;
    } else {
      return params;
    }
  },
  /**
   * 
   * @param {Object} params 
   * @param {Array} valids 
   */
  formatData (params, valids) {
    let res = true;
    if (!IS.object(params)) return false;
    if (!IS.array(valids)) return false;
    for (let i = 0; i < valids.length; i++) {
      let item = valids[i];
      let { key, type } = item;
      if (!key) {
        res = false;
        break;
      }
      let value = params[key] || "";
      switch (type) {
        case 'not_empty':
          if (IS.empty(value)) {
            res = false;
            break;
          }
        case 'number':
          value = Number(value);
          if (!IS.number(value) || IS.nan(value)) {
            res = false;
            break;
          }
        case 'reg':
          let reg = item['reg'];
          if (!reg || !reg.test(value)) {
            res = false;
            break
          }
        default:
          let valueType = typeof value;
          if (valueType !== type) {
            res = false;
            break;
          }
      }
    }
    return res;
  },
  
}


module.exports = { utils, generateToken, verifyToken };