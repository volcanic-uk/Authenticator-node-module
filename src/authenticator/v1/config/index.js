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
    env: {
        domain: process.env.AUTH_DOMAIN
    }
};
