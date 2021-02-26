const user = require('./user.js');
const note = require('./note.js');
module.exports = (app) => {
    app.use(user.routes()).use(user.allowedMethods());
    app.use(note.routes()).use(user.allowedMethods());
}