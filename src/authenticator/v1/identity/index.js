// require the custom api fetch from the helpers module folder
const fetch = require('../../../helpers/index').customFetch;
const routes = require('../config');
const { addTokenToCache, getTokenFromCache } = require('../cache');

//define the fetch API function as an asynchronous one and waiting for the fetch api method to process the response
exports.identityLogin = async (identityName, identitySecret) => {
    try {
        let credentials = {
            name: identityName,
            secret: identitySecret
        };

        let result = await fetch(routes.login.method, routes.login.path, null, credentials);
        // cache the user's token
        await addTokenToCache(result.response.id, result.response.token);

        return {
            token: result.response.token,
            id: result.response.id
        };
    } catch (error) {
        throw error.response.data.reason.message;
    }
};

exports.identityRegister = async (identityName, token) => {
    try {
        if (!token){
            token = await getTokenFromCache(process.env.IDENTITY);
        }
        let credential = {
            name: identityName
        };
        let header = {
            Authorization: 'Bearer ' + token
        };
        let user = await fetch(routes.register.method, routes.register.path, header, credential);
        return {
            id: user.response.id,
            name: user.response.name,
            secret: user.response.secret
        };

    } catch (error) {
        throw error.response.data.reason.message;
    }
};

exports.identityValidation = async (token) => {
    try {
        let data = {
            token
        };

        let tokenInfo = await fetch(routes.validation.method, routes.validation.path, null, data);
        return {
            expiration_time: tokenInfo.response.exp,
            issued_at: tokenInfo.response.iat,
            issuer: tokenInfo.response.iss,
            jwt_id: tokenInfo.response.jti
        };
    } catch (error) {
        throw error.response.data.result;
    }
};

exports.identityLogout = async (token) => {
    try {
        let header = {
            Authorization: 'Bearer ' + token
        };

        let logout = await fetch(routes.logout.method, routes.logout.path, header, null);
        return logout.response.message;
    } catch (error) {
        throw error.response.data.error.message;
    }
};
