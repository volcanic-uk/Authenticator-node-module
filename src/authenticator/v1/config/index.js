require('dotenv').config();

module.exports = {
    login: {
        path: '/api/v1/identity/login',
        method: 'POST'
    },
    register: {
        path: '/api/v1/identity',
        method: 'POST'
    },
    validation: {
        path: '/api/v1/identity/validate',
        method: 'POST'
    },
    env: {
        domain: process.env.AUTH_DOMAIN
    }
};
