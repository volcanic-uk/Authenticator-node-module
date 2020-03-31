const V1Base = require('../v1_base'),
    Key = require('../key'),
    { JWTDecoder, JWTValidator, md5Generator } = require('../../../helpers'),
    { put, get } = require('../../cache');

class Token extends V1Base {
    constructor() {
        super();
        this.decoded = {};
    }

    async remoteValidation() {
        try {
            this.decoded = await this.fetch('post', 'token/validate');
            return true;
        } catch (e) {
            return false;
        }
    }

    async validate(token) {
        let tokenMD5 = md5Generator(token);
        //check if token is cached
        if (get(tokenMD5)) {
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
            //cache token if it is valid
            cacheDuration > 0 && put(tokenMD5, token, cacheDuration);
            return true;
        } catch (e) {
            return false;
        }
    }

    async isSingleUser(token) {
        let decodedToken = await JWTDecoder(token);
        return !!decodedToken.payload.jti;
    }

    parseSubject() {
        if (this.decoded) {
            let spiltSubject = this.decoded.sub.split('/');
            return {
                actor: spiltSubject[0],
                stack_id: spiltSubject[2],
                dataset_id: spiltSubject[3],
                principal_id: spiltSubject[4],
                identity_id: spiltSubject[5]
            };
        }
        return null;
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