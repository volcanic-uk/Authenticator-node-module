const { customFetch } = require('../../helpers/index');
const envConfigs = require('../../../config');

class V1Base {
    constructor() {
        this.internalAuth = false;
    }

    async fetch(methodType, path, headers, data) {
        let token = null;
        if (this.internalAuth) {
            token = await this.login();
            token = token.response.token;
            return await customFetch(methodType, path, { ...headers, Authorization: `Bearer ${token}` }, data);
        }
        return await customFetch(methodType, path, headers, data);

    }

    withAuth() {
        this.internalAuth = true;
        return this;
    }

    async login() {
        let loginData = {
            name: envConfigs.auth.authIdentity,
            secret: envConfigs.auth.authSecret,
            principal_id: envConfigs.auth.principalID,
            audience: envConfigs.auth.audience
        };
        return await customFetch('post', '/api/v1/identity/login', null, loginData);
    }
}

module.exports = V1Base;