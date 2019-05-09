const { addTokenToCache, getTokenFromCache } = require('../cache');
const { identityLogin, identityValidation } = require('../identity');

exports.generateToken = async () => {
    let existingToken = await getTokenFromCache(process.env.VS_IDENTITY);
    if (!existingToken || existingToken === null) {
        try {
            let newToken = await identityLogin(process.env.VS_IDENTITY, process.env.VS_SECRET);
            existingToken = newToken.token;
            addTokenToCache(process.env.VS_IDENTITY, existingToken, process.env.CACHE_DURATION);
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