const user = require('./user.js');

module.exports = (app) => {
    app.use(user.routes()).use(user.allowedMethods());
}