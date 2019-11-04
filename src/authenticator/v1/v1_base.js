const { customFetch } = require('../../helpers/index');
const { getFromCache, putToCache, deleteFromCache } = require('../cache');
const config = require('../../../config');

class V1Base {
    constructor() {
        this.internalAuth = false;
        this.baseURL = '/api/v1/';
        this.token = null;
        this.loginAttempts = 0;
    }

    setToken(token) {
        this.token = token;
        return this;
    }

    async fetch(methodType, path, headers, data) {
        let _headers = { ...headers, Authorization: `Bearer ${this.token}` };
        if (this.internalAuth) {
            let token = await this.obtainToken();
            _headers = {
                ...headers,
                Authorization: `Bearer ${token}`
            };
        }
        try {
            let httpResponse = await customFetch(methodType, path, _headers, data);
            this.loginAttempts = 0;
            return { ...httpResponse.response, status: true };
        } catch (e) {
            // console.log('show the error  here',e);
            if (this.internalAuth && e.response.status == 403) {
                if (this.loginAttempts <= 5) {
                    this.loginAttempts++;
                    deleteFromCache('internal_token');
                    return await this.fetch(methodType, path, headers, data);
                }
            }
            throw {
                statusCode: e.response.status,
                status: false,
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
            let loginResponse = await this.internalLogin();
            token = loginResponse.response.token;
            await putToCache('internal_token', token);
        }
        return token;
    }

    async internalLogin() {
        let loginData = {
            name: config.auth.identity_name,
            secret: config.auth.secret,
            dataset_id: config.auth.dataset_id,
            audience: config.auth.audience
        };
        return await customFetch('post', 'identity/login', null, loginData);
    }
}

module.exports = V1Base;