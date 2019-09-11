const envConfigs = require('../../../../config');
module.exports = {
    identity: {
        login: {
            path: '/api/v1/identity/login',
            method: 'POST'
        },
        register: {
            path: '/api/v1/identity',
            method: 'POST'
        },
        validation: {
            path: '/api/v1/token/validate',
            method: 'POST'
        },
        logout: {
            path: '/api/v1/identity/logout',
            method: 'POST'
        },
        resetSecret: {
            path: '/api/v1/identity/secret/reset',
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
            path: (query = '', datasetId = '', page = '', pageSize = '', sort = 'id', order = 'asc') => {
                return `/api/v1/principals?query=${query}&dataset_id=${datasetId}&page=${page}&page_size=${pageSize}&sort=${sort}&order=${order}`;
            },
            method: 'GET'
        },
        update: {
            path: (prinicpalID) => {
                return `/api/v1/principals/${prinicpalID}`;
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
            path: (permissionID) => {
                return `/api/v1/permissions/${permissionID}`;
            },
            method: 'GET'
        },
        readAll: {
            path: (query = '', page = '', pageSize = '', sort = 'id', order = 'asc') => {
                return `/api/v1/permissions?&query=${query}&page=${page}&page_size=${pageSize}&sort=${sort}&order=${order}`;
            },
            method: 'GET'
        },
        update: {
            path: (permissionID) => {
                return `/api/v1/permissions/${permissionID}`;
            },
            method: 'POST'
        },
        delete: {
            path: (permissionID) => {
                return `/api/v1/permissions/${permissionID}`;
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
            path: (groupID) => {
                return `/api/v1/groups/${groupID}`;
            },
            method: 'GET'
        },
        readAll: {
            path: (query = '', page = '', pageSize = '', sort = 'id', order = 'asc') => {
                return `/api/v1/groups?query=${query}&page=${page}&page_size=${pageSize}&sort=${sort}&order=${order}`;
            },
            method: 'GET'
        },
        update: {
            path: (groupID) => {
                return `/api/v1/groups/${groupID}`;
            },
            method: 'POST'
        },
        delete: {
            path: (groupID) => {
                return `/api/v1/groups/${groupID}`;
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
            path: (privilegeID) => {
                return `/api/v1/privileges/${privilegeID}`;
            },
            method: 'GET'
        },
        readAll: {
            path: (query = '', page = '', pageSize = '', sort = 'id', order = 'asc') => {
                return `/api/v1/privileges?&query=${query}&page=${page}&page_size=${pageSize}&sort=${sort}&order=${order}`;
            },
            method: 'GET'
        },
        update: {
            path: (privilegeID) => {
                return `/api/v1/privileges/${privilegeID}`;
            },
            method: 'POST'
        },
        delete: {
            path: (privilegeID) => {
                return `/api/v1/privileges/${privilegeID}`;
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
            path: (serviceID) => {
                return `/api/v1/services/${serviceID}`;
            },
            method: 'GET'
        },
        readAll: {
            path: (query = '', page = '', pageSize = '', sort = 'id', order = 'asc') => {
                return `/api/v1/services?query=${query}&page=${page}&page_size=${pageSize}&sort=${sort}&order=${order}`;
            },
            method: 'GET'
        },
        update: {
            path: (serviceID) => {
                return `/api/v1/services/${serviceID}`;
            },
            method: 'POST'
        },
        delete: {
            path: (serviceID) => {
                return `/api/v1/services/${serviceID}`;
            },
            method: 'DELETE'
        }
    },
    roles: {
        create: {
            path: '/api/v1/roles',
            method: 'POST'
        },
        read: {
            path: (roleID) => {
                return `/api/v1/roles/${roleID}`;
            },
            method: 'GET'
        },
        readAll: {
            path: (query = '', page = '', pageSize = '', sort = 'id', order = 'asc') => {
                return `/api/v1/roles?&query=${query}&page=${page}&page_size=${pageSize}&sort=${sort}&order=${order}`;
            },
            method: 'GET'
        },
        update: {
            path: (roleID) => {
                return `/api/v1/roles/${roleID}`;
            },
            method: 'POST'
        },
        delete: {
            path: (roleID) => {
                return `/api/v1/roles/${roleID}`;
            },
            method: 'DELETE'
        }
    },
    env: {
        domain: envConfigs.server.domainName
    },
    key: {
        getPublicKey: {
            path: (kid) => {
                return `/api/v1/key/${kid}`;
            },
            method: 'GET'
        }
    }
};
