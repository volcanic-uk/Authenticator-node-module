const { customFetch } = require('../../helpers/index');
const { getFromCache, putToCache, deleteFromCache } = require('../cache');
const config = require('../../../config');

class V1Base {
    constructor() {
        this.internalAuth = false;
        this.baseURL = '/api/v1/';
        this.token = null;
        this.loginAttempts = 0;
        this.requestID = null;
        this.errorMessage = null;
        this.errorCode = null;
    }

    setToken(token) {
        this.token = token;
        return this;
    }

    getToken() {
        return this.token;
    }

    setErrorMessage(errorMessage) {
        this.errorMessage = errorMessage;
    }

    getErrorMessage() {
        return this.errorMessage;
    }

    setErrorCode(errorCode) {
        this.errorCode = errorCode;
    }

    getErrorCode() {
        return this.errorCode;
    }

    setRequestID(requestID) {
        this.requestID = requestID;
    }

    getRequestID() {
        return this.requestID;
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
            let httpResponse = await customFetch(methodType, this.baseURL + path, _headers, data);
            this.loginAttempts = 0;
            this.setRequestID(httpResponse.requestID);
            if (Array.isArray(httpResponse.response))
                return httpResponse.response;
            const processed = { ...httpResponse.response, status: true };
            return processed;
            // return { ...httpResponse.response, status: true };
        } catch (e) {
            if (this.internalAuth && e.response.status === 403) {
                if (this.loginAttempts <= 5) {
                    this.loginAttempts++;
                    deleteFromCache('internal_token');
                    return await this.fetch(methodType, path, headers, data);
                }
            }
            this.setRequestID(e.response.requestID);
            this.setErrorMessage(e.response.message);
            this.setErrorCode(e.response.errorCode);
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
        return await customFetch('post', this.baseURL + 'identity/login', null, loginData);
    }
}

module.exports = V1Base;