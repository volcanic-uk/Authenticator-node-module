// require the custom api fetch from the helpers module folder
const V1Base = require('../v1_base');

class Identity extends V1Base {
    constructor() {
        super();
    }

    //identity login method
    async login(name, secret, audience = [], principalId) {
        let loginDetails = {
            name: name,
            secret: secret,
            audience: audience,
            principal_id: principalId
        };

        let result = await super.fetch('post', 'identity/login', null, loginDetails);
        return {
            token: result.response.token
        };
    }

    //identity register method
    async create(name, secret = null, principalId) {
        let identity = {
            name: name,
            secret: secret,
            principal_id: principalId
        };
        return await super.fetch('post', 'identity', null, identity);
    }

    async update(name, id) {
        let identity = {
            name: name
        };
        return await super.fetch('post', `identity/${id}`, null, identity);
    }

    async resetSecret(secret = null, id) {
        let identity = {
            secret: secret
        };
        return await super.fetch('post', `identity/secret/reset/${id}`, null, identity);
    }

    async deactivateIdentity(id) {
        return await super.fetch('post', `identity/deactivate/${id}`, null);
    }

    async generateToken(id, audience = [], expiryDate, singleUse, nbf) {
        let identity = {
            identity: {
                id: id
            },
            audience: audience,
            expiry_date: expiryDate,
            single_use: singleUse,
            nbf: nbf
        };
        return await super.fetch('post', 'identity/token/generate', null, identity);
    }

    async logout() {
        return await super.fetch('post', 'identity/logout', null, null);
    }
}

module.exports = Identity;
