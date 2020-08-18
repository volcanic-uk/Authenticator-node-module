const Authorization = require('../authorization/index');
let t;
module.exports = async (req, res, next) => {
    if (req.headers.authorization) {
        t = req.headers.authorization.split(' ')[1];
    }
    req.authorize = await authorize;
    next();


};
const authorize = async function (object) {
    const authorization = new Authorization().setToken(t);
    await authorization.authorize(object);
};
