const V1Base = require('../v1_base');

class Privileges extends V1Base {
    constructor() {
        super();
    }

    async create({ scope, permission_id = null, group_id = null, allow = true, tag = null }) {
        let privilege = {
            permission_id: permission_id,
            group_id: group_id,
            scope,
            allow,
            tag
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

    async getPrivileges({ page = '', page_size = '', sort = 'id', order = 'asc', scope = '', group_id = '', permission_id = '', query = '', tag = '', allow =true }) {
        return super.fetch('get', `privileges?page=${page}&page_size=${page_size}&sort=${sort}&order=${order}&scope=${scope}&permission_id=${permission_id}&group_id=${group_id}&query=${query}&tag=${tag}&allow=${allow}`, null);

    }

    async update({ id, scope, permission_id = null, group_id = null, allow = true, tag = null }) {
        let body = {
            permission_id: permission_id,
            group_id: group_id,
            scope,
            allow,
            tag
        };
        return super.fetch('post', `privileges/${id}`, null, body);
    }

    async delete(id) {
        return super.fetch('delete', `privileges/${id}`, null);
    }

}

module.exports = Privileges;