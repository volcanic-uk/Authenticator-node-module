// require the custom api fetch from the helpers module folder
const V1Base = require('../v1_base');

class Identity extends V1Base {
    constructor() {
        super();
    }

    //identity login method
    async login(identityName, identitySecret, audience = [], principalId) {
        let loginDetails = {
            name: identityName,
            secret: identitySecret,
            audience: audience,
            principal_id: principalId
        };

        let result = await super.fetch('post', 'identity/login', null, loginDetails);
        return {
            token: result.response.token
        };
    }

    //identity register method
    async create(identityName, identitySecret = null, principalId) {
        let identity = {
            name: identityName,
            secret: identitySecret,
            principal_id: principalId
        };
        return await super.fetch('post', 'identity', null, identity);
    }

    async update(identityName, identityId) {
        let identity = {
            name: identityName
        };
        return await super.fetch('post', `identity/${identityId}`, null, identity);
    }

    async resetSecret(identitySecret = null, identityId) {
        let identity = {
            secret: identitySecret
        };
        return await super.fetch('post', `identity/secret/reset/${identityId}`, null, identity);
    }

    async deactivateIdentity(identityId) {
        return await super.fetch('post', `identity/deactivate/${identityId}`, null);
    }

    async generateToken(identityId, audience = [], expiryDate, singleUse, nbf) {
        let identity = {
            identity: {
                id: identityId
            },
            audience: audience,
            expiry_date: expiryDate,
            single_use: singleUse,
            nbf: nbf
        };
        return await super.fetch('post', 'identity/token/generate', null, identity);
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
        let header = {
            Authorization: 'Bearer ' + token
        };
        return await super.fetch('post', 'identity/logout', header, null);
    }
}

module.exports = Identity;
