const { customFetch } = require('../../helpers/index');
const Cache = require('../cache');
const config = require('../../../config');
const AuthV1Error = require('./errors');

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
            return { ...httpResponse.response, status: true };
        } catch (e) {
            const response = e.response || {};
            const responseData = response.data || {};
            if (this.internalAuth && response.status === 401) {
                if (this.loginAttempts <= 5) {
                    this.loginAttempts++;
                    Cache.del('internal_token');
                    return this.fetch(methodType, path, headers, data);
                }
            }
            this.setRequestID(responseData.requestID || null);
            this.setErrorMessage(responseData.message || e.message);
            this.setErrorCode(responseData.errorCode || null);
            throw new AuthV1Error({
                statusCode: response.status || 0,
                requestID: responseData.requestID || null,
                status: false,
                errorCode: responseData.errorCode || null,
                message: responseData.message || e.message,
                dataError: responseData || null
            });
        }
    }

    withAuth() {
        this.internalAuth = true;
        return this;
    }

    async obtainToken() {
        let token = await Cache.get('internal_token');
        if (!token) {
            let loginResponse = await this.internalLogin();
            token = loginResponse.response.token;
            await Cache.put('internal_token', token);
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
        return customFetch('post', this.baseURL + 'identity/login', null, loginData);
    }
}

module.exports = V1Base;
