const V1Base = require('../v1_base');

class Privileges extends V1Base {
    constructor() {
        super();
    }

    async create(scope, permissionID, groupID, allow) {
        let privilege = {
            permission_id: permissionID,
            group_id: groupID,
            scope,
            allow
        };
        return super.fetch('post', 'privileges', null, privilege);
    }

    async getById(id) {
        return super.fetch('get', `privileges/${id}`, null);
    }

    async getByServicePermissions(serviceName, permissionName) {
        return super.fetch('get', `privileges/${serviceName}/${permissionName}`, null);
    }

    async getByToken() {
        return super.fetch('get', 'privileges/identity', null);
    }

    async getPrivileges(page = '', pageSize = '', sort = 'id', order = 'asc') {
        return super.fetch('get', `privileges?page=${page}&page_size=${pageSize}&sort=${sort}&order=${order}`, null);

    }

    async update(id, scope, permissionID, groupID, allow) {
        let body = {
            permission_id: permissionID,
            group_id: groupID,
            scope,
            allow
        };
        return super.fetch('post', `privileges/${id}`, null, body);
    }

    async delete(id) {
        return super.fetch('delete', `privileges/${id}`, null);
    }
}

module.exports = Privileges;