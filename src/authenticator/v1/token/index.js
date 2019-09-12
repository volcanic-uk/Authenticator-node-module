const V1Base = require('../v1_base'),
    Key = require('../key'),
    { JWTDecoder, JWTValidator, md5Generator } = require('../../../helpers'),
    { putToCache, getFromCache } = require('../../cache');

class Token extends V1Base {
    constructor() {
        super();
    }

    async remoteValidation() {
        try {
            await this.fetch('post', 'token/validate');
            return true;
        } catch (e) {
            return false;
        }
    }

    async validate(token) {
        let tokenMD5 = md5Generator(token);
        //check if token is cached
        if (getFromCache(tokenMD5)) {
            return true;
        }
        let decodedToken = await JWTDecoder(token);
        let keyID = decodedToken.header.kid;
        if (decodedToken.payload.jti) {
            //the token is a single use token, and should be validated by server
            this.setToken(token);
            return await this.remoteValidation();
        }
        let keyResponse = await new Key().withAuth().getByID(keyID);
        let publicKey = keyResponse.public_key;
        try {
            await JWTValidator(token, publicKey);
            let cacheDuration = availableCacheDuration(decodedToken.payload.exp);
            putToCache(tokenMD5, token, cacheDuration);
            //cache token if it is valid
            return true;
        } catch (e) {
            return false;
        }
    }
}

function availableCacheDuration(tokenExpiryDate) {
    let now = new Date();
    let roundedMinutes = Math.floor((tokenExpiryDate * 1000 - now.getTime()) / 1000 / 60);
    if (roundedMinutes > 60) {
        return 60;
    } else {
        return roundedMinutes;
    }
}

module.exports = Token;