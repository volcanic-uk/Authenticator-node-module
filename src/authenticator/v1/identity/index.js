// require the custom api fetch from the helpers module folder
const { customFetch, logger } = require('../../../helpers/index');
const routes = require('../config');
const envConfigs = require('../../../../config');
const jwt = require('jsonwebtoken');
const { putToCache, getFromCache } = require('../cache');

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
exports.identityLogin = async (identityName, identityPassword, issuer) => {
    const thirdPartyTokenDuration = envConfigs.cache.thirdPartyTokenDuration;
    try {
        let credentials = {
            name: identityName,
            secret: identityPassword,
            issuer: issuer
        };

        let result = await customFetch(routes.identity.login.method, routes.identity.login.path, null, credentials);
        // cache the user's token
        await putToCache(result.response.token, result.response.token, thirdPartyTokenDuration);
        return {
            token: result.response.token
        };
    } catch (error) {
        throw {
            message: error.response.data.reason.message,
            code: error.response.data.reason.errorCode
        };
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
exports.identityRegister = async (identityName, identityPassword = null, principalId, token) => {
    const authIdentity = envConfigs.auth.authIdentity;
    try {
        if (!token) {
            token = await getFromCache(authIdentity);
        }
        let credential = {
            name: identityName,
            password: identityPassword,
            principal_id: principalId
        };
        let header = {
            Authorization: `Bearer ${token}`
        };
        let user = await customFetch(routes.identity.register.method, routes.identity.register.path, header, credential);
        return {
            id: user.response.id,
            name: user.response.name,
            secret: user.response.secret
        };

    } catch (error) {
        throw {
            message: error.response.data.reason.message,
            code: error.response.data.reason.errorCode
        };
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

exports.remoteIdentityValidation = async (token) => {
    try {
        let data = {
            token
        };

        let tokenInfo = await customFetch(routes.identity.validation.method, routes.identity.validation.path, null, data);
        logger({
            validity: true,
            expiration_time: tokenInfo.response.exp,
            issued_at: tokenInfo.response.iat,
            not_before: tokenInfo.response.nbf,
            subject: tokenInfo.response.sub
        });
        return true;
    } catch (error) {
        logger({
            validity: false,
            error: error.response.data.reason
        });
        return false;
    }
};

exports.localIdentityValidation = async (tokenToValidate, headerToken) => {
    const thirdPartyTokenDuration = envConfigs.cache.thirdPartyTokenDuration;
    let decodedToken = null;

    if (headerToken === null || !headerToken) {
        await getFromCache(headerToken);
    }
    let header = {
        Authorization: `Bearer ${headerToken}`
    };

    try {
        let decode = jwt.decode(tokenToValidate, { complete: true });
        if (decode) {
            decodedToken = decode.header.kid;
        } else {
            logger('invalid token');
            return false;
        }
        let cache = await getFromCache(decodedToken);

        if (!cache || cache === null) {
            let pub = await customFetch(routes.key.getPublicKey.method, routes.key.getPublicKey.path(decodedToken), header, null).then((success) => {
                return success.response.key.public_key;
            }).catch((error) => {
                throw error;
            });
            await putToCache(decodedToken, pub, thirdPartyTokenDuration);
            let verify = await jwt.verify(tokenToValidate, pub);
            logger({
                result: verify, 
                message: 'token is valid'
            });
            return true;
        } else {
            let verify = await jwt.verify(tokenToValidate, cache);
            logger({
                result: verify, 
                message: 'token is valid'
            });
            return true;
        }

    } catch (e) {
        logger({
            internal_error: e, 
            request_error: e.resonse
        });
        return false;
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

        let logout = await customFetch(routes.identity.logout.method, routes.identity.logout.path, header, null);
        return logout.response.message;
    } catch (error) {
        throw {
            message: error.response.data.reason.message
        };
    }
};
