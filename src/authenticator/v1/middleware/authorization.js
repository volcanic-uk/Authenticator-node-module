const Authorization = require('../authorization/index');
let token;
module.exports = async (req, res, next) => {
    if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    }
    req.authorize = await authorize;
    next();


};
const authorize = async function (object) {
    const authorization = new Authorization().setToken(token);
    await authorization.authorize(object);
};
