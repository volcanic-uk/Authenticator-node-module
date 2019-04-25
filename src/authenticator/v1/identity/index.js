// require the custom api fetch from the helpers module folder
const fetch = require('../../../helpers/index').customFetch;
const routes = require('../config');

//define the fetch API function as an asynchronous one and waiting for the fetch api method to process the response
exports.identityLogin = async (identityName, identitySecret) => {
    try {
        let credentials = {
            name: identityName,
            secret: identitySecret
        };

        let result = await fetch(routes.login.method, routes.login.path, null, credentials);
        return result.token;
    } catch (error) {
        throw error.response.data.reason.message;
    }
};

exports.identityRegister = async (identityName, token) => {
    try {
        let credential = {
            name: identityName
        };
        let header = {
            Authorization: 'Bearer ' + token
        };

        let user = await fetch(routes.register.method, routes.register.path, header, credential);
        return user = {
            id: user.identity.id,
            name: user.identity.name,
            secret: user.identity.secret
        };
    } catch (error) {
        throw error.response.data.reason.message;
    }
};

exports.validateToken = async (token) => {
    try {
        let data = {
            token
        };

        let tokenInfo = await fetch(routes.validation.method, routes.validation.path, null, data);
        return tokenInfo = {
            expiration_time: tokenInfo.message.exp,
            issued_at: tokenInfo.message.iat,
            issuer: tokenInfo.message.iss,
            jwt_id: tokenInfo.message.jti
        };
    } catch (error) {
        throw error.response.data.result;
    }
};