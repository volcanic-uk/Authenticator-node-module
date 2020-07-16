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
        console.log('this is it', loginDetails);
        let result = await super.fetch('post', 'identity/login', null, loginDetails);
        console.log('show the result', result);
        return {
            token: result.token
        };
    }

    //identity register method
    async create({ name, secret = null, principal_id, roles = [], privileges = [], secretless = false, source = 'password', skip_secret_encryption = false }) {
        let identity = {
            name,
            secret,
            principal_id,
            roles,
            privileges,
            secretless,
            source,
            skip_secret_encryption
        };
        return super.fetch('post', 'identity', null, identity);
    }

    async update({ name = null, id, roles = [], privileges = [] }) {
        let identity = {
            name: name,
            roles,
            privileges
        };
        return super.fetch('post', `identity/${id}`, null, identity);
    }

    async updatePrivileges({ id, privileges = [] }) {
        return super.fetch('post', `identity/${id}/privileges`, null, {
            privileges
        });
    }

    async updateRoles({ id, roles = [] }) {
        return super.fetch('post', `identity/${id}/roles`, null, {
            roles
        });
    }

    async resetSecret({ secret = null, id }) {
        let identity = {
            secret: secret
        };
        return super.fetch('post', `identity/secret/reset/${id}`, null, identity);
    }

    async getByID(secureID) {
        return super.fetch('get', `identity/${secureID}`, null, null);
    }

    async delete(secureID) {
        return super.fetch('delete', `identity/${secureID}`, null);
    }

    async deactivateIdentity(secureID) {
        return super.fetch('post', `identity/${secureID}/deactivate`, null);
    }

    async activateIdentity(secureID) {
        return super.fetch('post', `identity/${secureID}/activate`, null);
    }

    async generateToken({ id, audience = [], expiry_date, single_use, nbf }) {
        let identity = {
            identity: {
                id: id
            },
            audience: audience,
            expiry_date,
            single_use,
            nbf: nbf
        };
        return super.fetch('post', 'identity/token/generate', null, identity);
    }

    async logout() {
        return super.fetch('post', 'identity/logout', null, null);
    }

    async getIdentityById(id) {
        return super.fetch('get', `identity/${id}`, null, null);
    }

    async getIdentities({ page = 1, page_size = 10, query = '', name = '', source = 'password', dataset_id = '', sort = 'created_at', order = 'asc', principal_id = '' }) {
        return super.fetch('get', `identity?query=${query}&page=${page}&page_size=${page_size}&name=${name}&source=${source}&dataset_id=${dataset_id}&sort=${sort}&order=${order}&principal_id=${principal_id}`, null, null);
    }

    async getRoles(id) {
        return super.fetch('get', `identity/${id}/roles`, null, null);
    }

    async getPrivileges(id) {
        return super.fetch('get', `identity/${id}/privileges`, null, null);
    }
}

module.exports = Identity;