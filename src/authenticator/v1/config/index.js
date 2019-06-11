const envConfigs = require('../../../../config');

module.exports = {
    identity : {
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
        }
    },
    principal: {
        create: {
            path: '/api/v1/principal',
            method: 'POST'
        },
        read: {
            path: (prinicpalID) => {
                return `/api/v1/principal/${prinicpalID}`;
            },
            method: 'GET'
        },
        update: {
            path: (prinicpalID) => {
                return `/api/v1/principal/update/${prinicpalID}`;
            },
            method: 'POST'
        },
        delete: {
            path: (prinicpalID) => {
                return `/api/v1/principal/delete/${prinicpalID}`;
            },
            method: 'POST'
        }
    },
    permissions: {
        create: {
            path: '/api/v1/permission',
            method: 'POST'
        },
        read: {
            path: (permission_id) => {
                return `/api/v1/permission/${permission_id}`;
            },
            method: 'GET'
        },
        update: {
            path: (permission_id) => {
                return `/api/v1/permission/update/${permission_id}`;
            },
            method: 'POST'
        },
        delete: {
            path: (permission_id) => {
                return `/api/v1/permission/delete/${permission_id}`;
            },
            method: 'POST'
        }
    },
    env: {
        domain: envConfigs.server.domainName
    },
    key: {
        getPublicKey :{
            path: (kid) => {
                return `/api/v1/key/${kid}`;
            },
            method: 'GET'
        }
    }
};
