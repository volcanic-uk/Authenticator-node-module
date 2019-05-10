const { envSetter } = require('../../../../config');

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
    logout: {
        path: '/api/v1/identity/logout',
        method: 'POST'
    },
    env: {
        domain: envSetter().server.domainName
    }
};
