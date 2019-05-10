// require the custom api fetch from the helpers module folder
const fetch = require('../../../helpers/index').customFetch;
const routes = require('../config');
const { addTokenToCache, getTokenFromCache } = require('../cache');
const { envSetter } = require('../../../../config');

/**
 * 
 * @function identityLogin this function is reponsible to call the login API and pass the credentials needed to get the login needed to authenticate the user
 * to procedd to further features and services on the volcanic platform, this function takes 2 main parameters: 
 * 
 * @param identityName a string that represents the username provided by the user to login
 * @param identityPassword a string that represents the password that the user provided or a secret auto generated by us in case the user did not provide a 
 * password 
 * 
 * this function depends on the custom fetch fucntion in the helper folder.
 * 
 */
exports.identityLogin = async (identityName, identityPassword) => {
    const thirdPartyTokenDuration = envSetter().cache.thirdPartyTokenDuration;
    try {
        let credentials = {
            name: identityName,
            secret: identityPassword
        };

        let result = await fetch(routes.login.method, routes.login.path, null, credentials);
        // cache the user's token
        await addTokenToCache(result.response.id, result.response.token, thirdPartyTokenDuration);

        return {
            token: result.response.token,
            id: result.response.id
        };
    } catch (error) {
        throw error.response.data.reason.message;
    }
};


/**
 * 
 * @function identityRegister this function is reponsible to call the create identity API and pass the credentials needed to get the info needed to add a user
 * to the platfrom inorder for them to proceed and use the platform various services
 * 
 * @param identityName a string that represents the username provided by the user to login
 * @param identityPassword a string that represents the password that the user provided or a secret auto generated by us in case the user did not provide a 
 * password 
 * @param token by default it is null, this token is needed to authenticate the request to the register API if there is no token provided, the server will
 * throw an error of unauthorized, and the refisteration won't be completed
 * 
 * this function depends on the custom fetch fucntion in the helper folder.
 * 
 */
exports.identityRegister = async (identityName, identityPassword=null, token) => {
    const authIdentity = envSetter().auth.authIdentity;
    try {
        if (!token){
            token = await getTokenFromCache(authIdentity);
        }
        let credential = {
            name: identityName,
            password: identityPassword
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


/**
 * 
 * @function identityValidation this function is reponsible to call the validation API and pass the credentials to get the info needed to make sure that 
 * the provided token is actually valid and can be used furhter
 * 
 * @param token ideally a string you need to pass the token as a string to this function and the API will respond whether the token is valid, black listed, 
 * or potentially malformed
 * 
 * this function depends on the custom fetch fucntion in the helper folder.
 * 
 */

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


/**
 * 
 * @function identityLogout this function is reponsible to call the logout (black list token) API and pass the credentials to get the info needed to make sure 
 * that the provided token is black listed and can not be used anymore
 * 
 * @param token ideally a string you need to pass the token as a string to this function and the API will respond that the token is blacklisted and can not 
 * be used any more
 * 
 * this function depends on the custom fetch fucntion in the helper folder.
 * 
 */

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
