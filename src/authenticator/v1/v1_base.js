const { customFetch } = require('../../helpers/index');
const { getFromCache, putToCache } = require('../cache');
const envConfigs = require('../../../config');

class V1Base {
    constructor() {
        this.internalAuth = false;
        this.baseURL = '/api/v1/';
    }

    async fetch(methodType, path, headers, data) {
        let _headers = headers;
        if (this.internalAuth) {
            let token = await this.obtainToken();
            _headers = {
                ...headers,
                Authorization: `Bearer ${token}`
            };
        }
        try {
            return await customFetch(methodType, this.baseURL + path, _headers, data);
        } catch (e) {
            // console.log(e);
            throw {
                status: e.response.status,
                ...e.response.data
            };
        }
    }

    withAuth() {
        this.internalAuth = true;
        return this;
    }

    async obtainToken() {
        let token = await getFromCache('internal_token');
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