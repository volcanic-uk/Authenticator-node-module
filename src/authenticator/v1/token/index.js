const V1Base = require('../v1_base'),
    Key = require('../key'),
    { JWTDecoder, JWTValidator } = require('../../../helpers');

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
        let decodedToken = await JWTDecoder(token);
        let keyID = decodedToken.header.kid;
        if (decodedToken.payload.jti) {
            //the token is a single use token, and should be validated by server
            this.setToken(token);
            return await this.remoteValidation();
        }
        let keyResponse = await new Key().withAuth().getByID(keyID);
        let publicKey = keyResponse.response.public_key;
        try {
            await JWTValidator(token, publicKey);
            return true;
        } catch (e) {
            return false;
        }
    }
}

module.exports = Token;