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

    async logout(token) {
        let header = {
            Authorization: 'Bearer ' + token
        };
        return await super.fetch('post', 'identity/logout', header, null);
    }
}

module.exports = Identity;
