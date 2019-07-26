const { putToCache, getFromCache } = require('../cache');
const { identityLogin, remoteIdentityValidation } = require('../identity');
const envConfigs = require('../../../../config');

/**
 * @function generateToken this function is called whenever a token is not in the cahced memory of the run time when the user registers a new identity
 * the registration identity function in the identity folder requires a token to authorize the request sent to the authentication server 
 * the token then passed in the header to validate the request 
 * this fucntion then will check if a token already exists in the cache of the running environment, if the token is not there, the function will then 
 * call the login fucntion for the identity folder layer and request a new token and store it in the cache afterwards.
 */

exports.generateToken = async () => {
    const {
        auth,
        cache,
    } = envConfigs;
    let existingToken = await getFromCache(auth.authIdentity);
    if (!existingToken || existingToken === null) {

        try {
            let newToken = await identityLogin(auth.authIdentity, auth.authSecret, [auth.audience]);
            existingToken = newToken.token;
            putToCache(auth.authIdentity, existingToken, cache.moduleTokenDuration);
            return existingToken;
        }
        catch (e) {
            throw e;
        }
    } else {
        try {
            if (envConfigs.server.validation === true) {
                await remoteIdentityValidation(existingToken);
                return existingToken;
            } 
            return existingToken;
        } catch (e) {
            existingToken = null;
            return this.generateToken();
        }
    }
};