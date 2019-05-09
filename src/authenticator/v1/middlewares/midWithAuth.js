const { addTokenToCache, getTokenFromCache } = require('../cache');
const { identityLogin, identityValidation } = require('../identity');

exports.generateToken = async () => {
    let existingToken = await getTokenFromCache(process.env.IDENTITY);
    if (!existingToken || existingToken === null) {
        try {
            let newToken = await identityLogin(process.env.IDENTITY, process.env.SECRET);
            existingToken = newToken.token;
            addTokenToCache(process.env.IDENTITY, existingToken, process.env.DURATION);
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