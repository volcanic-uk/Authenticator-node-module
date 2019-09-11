// require the custom api fetch from the helpers module folder
const routes = require('../config');
const envConfigs = require('../../../../config');
const { getFromCache } = require('../../cache');
const V1Base = require('../v1_base');

class Identity extends V1Base {
    constructor() {
        super();
    }

    //identity register method
    async register(identityName, identityPassword = null, principalId, token) {
        const authIdentity = envConfigs.auth.authIdentity;
        try {
            if (!token) {
                token = await getFromCache(authIdentity);
            }
            let credential = {
                name: identityName,
                secret: identityPassword,
                principal_id: principalId
            };
            let header = {
                Authorization: `Bearer ${token}`
            };
            let user = await super.fetch(routes.identity.register.method, routes.identity.register.path, header, credential);
            return {
                id: user.response.id,
                name: user.response.name,
                secret: user.response.secret,
                principal_id:principalId
            };

        } catch (error) {
            throw error.response.data;
        }
    }

    // async remoteValidation(token) {
    //     try {
    //         let data = {
    //             token
    //         };
    //
    //         let tokenInfo = await super.fetch(routes.identity.validation.method, routes.identity.validation.path, null, data);
    //         logger({
    //             validity: true,
    //             expiration_time: tokenInfo.response.exp,
    //             issued_at: tokenInfo.response.iat,
    //             not_before: tokenInfo.response.nbf,
    //             subject: tokenInfo.response.sub
    //         });
    //         return true;
    //     } catch (error) {
    //         logger({
    //             validity: false,
    //             error: error.response.data.reason
    //         });
    //         return false;
    //     }
    // }
    //
    // async localValidation(tokenToValidate, headerToken) {
    //     const thirdPartyTokenDuration = envConfigs.cache.thirdPartyTokenDuration;
    //     let decodedToken = null;
    //
    //     if (headerToken === null || !headerToken) {
    //         await getFromCache(headerToken);
    //     }
    //     let header = {
    //         Authorization: `Bearer ${headerToken}`
    //     };
    //
    //     try {
    //         let decode = jwt.decode(tokenToValidate, { complete: true });
    //         if (decode) {
    //             decodedToken = decode.header.kid;
    //         } else {
    //             logger('invalid token');
    //             return false;
    //         }
    //         let cache = await getFromCache(decodedToken);
    //
    //         if (!cache || cache === null) {
    //             let pub = await customFetch(routes.key.getPublicKey.method, routes.key.getPublicKey.path(decodedToken), header, null).then((success) => {
    //                 return success.response.key.public_key;
    //             }).catch((error) => {
    //                 throw error;
    //             });
    //             await putToCache(decodedToken, pub, thirdPartyTokenDuration);
    //             let verify = await jwt.verify(tokenToValidate, pub);
    //             logger({
    //                 result: verify,
    //                 message: 'token is valid'
    //             });
    //             return true;
    //         } else {
    //             let verify = await jwt.verify(tokenToValidate, cache);
    //             logger({
    //                 result: verify,
    //                 message: 'token is valid'
    //             });
    //             return true;
    //         }
    //
    //     } catch (e) {
    //         logger({
    //             internal_error: e,
    //             request_error: e.resonse
    //         });
    //         return false;
    //     }
    // }

    async logout(token) {
        try {
            let header = {
                Authorization: 'Bearer ' + token
            };

            let logout = await super.fetch(routes.identity.logout.method, routes.identity.logout.path, header, null);
            return logout.response.message;
        } catch (error) {
            throw {
                message: error.response.data.reason.message
            };
        }
    }


}

module.exports = Identity;
