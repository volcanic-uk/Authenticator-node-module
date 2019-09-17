const V1Base = require('../v1_base');

class Permission extends V1Base {
    constructor() {
        super();
    }

    async create(serviceId, name, description) {
        let permission = {
            name,
            description,
            service_id: serviceId
        };

        return await super.fetch('post', 'permissions', null, permission);
    }

    async getById(id) {
        return await super.fetch('get', `permissions/${id}`, null);
    }

    async getPermissions(query = '', page = '', pageSize = '', sort = 'id', order = 'asc') {
        return await super.fetch('get', `permissions?query=${query}&page=${page}&page_size=${pageSize}&sort=${sort}&order=${order}`, null);
    }

    async update(id, name, description) {
        let permission = {
            name,
            description
        };
        return await super.fetch('post', `permissions/${id}`, null, permission);
    }

    async delete(id) {
        return await super.fetch('delete', `permissions/${id}`);
    }
}

module.exports = Permission;