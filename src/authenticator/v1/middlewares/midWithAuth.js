const { addTokenToCache, getTokenFromCache } = require('../cache');
const { identityLogin, identityValidation } = require('../identity');
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
    let existingToken = await getTokenFromCache(auth.authIdentity);

    if (!existingToken || existingToken === null) {
        try {
            let newToken = await identityLogin(auth.authIdentity, auth.authSecret, auth.authIssuer);
            existingToken = newToken.token;
            addTokenToCache(auth.authIdentity, existingToken, cache.moduleTokenDuration);
            return existingToken;
        }
        catch (e) {
            throw e;
        }
    } else {
        try {
            await identityValidation(existingToken);
        } catch (e) {
            existingToken = null;
            return this.generateToken();
        }
    }
};