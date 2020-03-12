// require the custom api fetch from the helpers module folder
const V1Base = require('../v1_base');

class Identity extends V1Base {
    constructor() {
        super();
    }

    //identity login method
    async login(name, secret, audience = [], datasetId) {
        let loginDetails = {
            name: name,
            secret: secret,
            audience: audience,
            dataset_id: datasetId
        };

        let result = await super.fetch('post', 'identity/login', null, loginDetails);
        return {
            token: result.token
        };
    }

    //identity register method
    async create(name, secret = null, principalId, roles, privileges, secretless, source, skipSecretEncryption) {
        let identity = {
            name: name,
            secret: secret,
            principal_id: principalId,
            roles,
            privileges,
            secretless,
            source,
            skipSecretEncryption
        };
        return await super.fetch('post', 'identity', null, identity);
    }

    async update(name, id) {
        let identity = {
            name: name
        };
        return await super.fetch('post', `identity/${id}`, null, identity);
    }

    async updatePrivileges(id, privileges = []) {
        return await super.fetch('post', `identity/${id}/privileges`, null, {
            privileges
        });
    }

    async updateRoles(id, roles = []) {
        return await super.fetch('post', `identity/${id}/roles`, null, {
            roles
        });
    }

    async resetSecret(secret = null, id) {
        let identity = {
            secret: secret
        };
        return await super.fetch('post', `identity/secret/reset/${id}`, null, identity);
    }

    async getByID(secureID) {
        return await super.fetch('get', `identity/${secureID}`, null, null);
    }

    async delete(secureID) {
        return await super.fetch('delete', `identity/${secureID}`, null);
    }

    async deactivateIdentity(secureID) {
        return await super.fetch('post', `identity/${secureID}/deactivate`, null);
    }

    async activateIdentity(secureID) {
        return await super.fetch('post', `identity/${secureID}/activate`, null);
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

    async getIdentityById(id) {
        return await super.fetch('get', `identity/${id}`, null, null);
    }

    async getIdentities(page = 1, pageSize = 10, query = '', name = 'volcanic', source = 'password', datasetID = '', sort = 'created_at', order = 'asc', principalId = '') {
        return await super.fetch('get', `identity?query=${query}&page=${page}&page_size=${pageSize}&name=${name}&source=${source}&dataset_id=${datasetID}&sort=${sort}&order=${order}&principal_id=${principalId}`, null, null);
    }

    async getRoles (id) {
        const tt = await super.fetch('get', `identity/${id}/roles`, null, null);
        console.log(tt);
        return tt
    }
}

module.exports = Identity;