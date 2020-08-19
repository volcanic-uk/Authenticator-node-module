const Authorization = require('../authorization/index');
const authorization = function (serviceName) {
    return async function (req, res, next) {
        let auth_token;
        if (req.headers.authorization)
            auth_token = req.headers.authorization.split(' ')[1];
        req.authorize = authorize(auth_token, serviceName);
        next();
    };
};

const authorize = function (auth_token, serviceNameMain) {
    return async function ({ permissionName, resourceType, resourceID, datasetID, serviceName }) {
        const authorization = new Authorization().setToken(auth_token);
        await authorization.authorize({
            serviceName: serviceName || serviceNameMain,
            permissionName,
            resourceType,
            resourceID,
            datasetID
        });
    };
};
module.exports = authorization;
