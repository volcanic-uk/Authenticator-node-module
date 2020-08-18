const { Authorization } = require('@volcanic-uk/auth-module/v1');
let t;
module.exports = async (req, res, next) => {
    if (req.headers.authorization) {
        t = req.headers.authorization.split(' ')[1];
    }
    req.authorize = await authorize;
    next();


};
const authorize = async function (object) {
    object.serviceName = 'aggregator';
    const authorization = new Authorization().setToken(t);
    await authorization.authorize(object);


};
