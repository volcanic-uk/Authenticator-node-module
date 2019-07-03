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
            path: '/api/v1/principals',
            method: 'POST'
        },
        read: {
            path: (prinicpalID) => {
                return `/api/v1/principals/${prinicpalID}`;
            },
            method: 'GET'
        },
        readAll: {
            path:  '/api/v1/principals',
            method: 'GET'
        },
        update: {
            path: (prinicpalID) => {
                return `/api/v1/principals/update/${prinicpalID}`;
            },
            method: 'POST'
        },
        delete: {
            path: (prinicpalID) => {
                return `/api/v1/principals/${prinicpalID}`;
            },
            method: 'DELETE'
        }
    },
    permissions: {
        create: {
            path: '/api/v1/permissions',
            method: 'POST'
        },
        read: {
            path: (permission_id) => {
                return `/api/v1/permissions/${permission_id}`;
            },
            method: 'GET'
        },
        readAll: {
            path: '/api/v1/permissions',
            method: 'GET'
        },
        update: {
            path: (permission_id) => {
                return `/api/v1/permissions/${permission_id}`;
            },
            method: 'POST'
        },
        delete: {
            path: (permission_id) => {
                return `/api/v1/permissions/${permission_id}`;
            },
            method: 'DELETE'
        }
    },
    groups: {
        create: {
            path: '/api/v1/groups',
            method: 'POST'
        },
        read: {
            path: (group_id) => {
                return `/api/v1/groups/${group_id}`;
            },
            method: 'GET'
        },
        readAll: {
            path: '/api/v1/groups/all',
            method: 'GET'
        },
        update: {
            path: (group_id) => {
                return `/api/v1/groups/${group_id}`;
            },
            method: 'POST'
        },
        delete: {
            path: (group_id) => {
                return `/api/v1/groups/${group_id}`;
            },
            method: 'DELETE'
        }
    },
    privileges: {
        create: {
            path: '/api/v1/privileges',
            method: 'POST'
        },
        read: {
            path: (privilege_id) => {
                return `/api/v1/privileges/${privilege_id}`;
            },
            method: 'GET'
        },
        readAll: {
            path: '/api/v1/privileges',
            method: 'GET'
        },
        update: {
            path: (privilege_id) => {
                return `/api/v1/privileges/${privilege_id}`;
            },
            method: 'POST'
        },
        delete: {
            path: (privilege_id) => {
                return `/api/v1/privileges/${privilege_id}`;
            },
            method: 'DELETE'
        }
    },
    services: {
        create: {
            path: '/api/v1/services',
            method: 'POST'
        },
        read: {
            path: (service_id) => {
                return `/api/v1/services/${service_id}`;
            },
            method: 'GET'
        },
        readAll: {
            path: '/api/v1/services',
            method: 'GET'
        },
        update: {
            path: (service_id) => {
                return `/api/v1/services/${service_id}`;
            },
            method: 'POST'
        },
        delete: {
            path: (service_id) => {
                return `/api/v1/services/${service_id}`;
            },
            method: 'DELETE'
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
