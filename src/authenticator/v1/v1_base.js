const { customFetch } = require('../../helpers/index');
const { getFromCache, putToCache } = require('../cache');
const envConfigs = require('../../../config');

class V1Base {
    constructor() {
        this.internalAuth = false;
    }

    async fetch(methodType, path, headers, data) {
        if (this.internalAuth) {
            let token = await this.obtainToken();
            return await customFetch(methodType, path, { ...headers, Authorization: `Bearer ${token}` }, data);
        }
        return await customFetch(methodType, path, headers, data);

    }

    withAuth() {
        this.internalAuth = true;
        return this;
    }

    async obtainToken() {
        let token = null;
        token = await getFromCache('internal_token');
        if (!token) {
            let loginResponse = await this.login();
            token = loginResponse.response.token;
            await putToCache('internal_token', token);
        }
        return token;
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