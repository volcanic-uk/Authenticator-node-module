// require the custom api fetch from the helpers module folder
const V1Base = require('../v1_base');

class Permission extends V1Base {
    constructor() {
        super();
    }

    async create(name, description, serviceId) {
        let permission = { name, service_id: serviceId, description };
        return await super.fetch('post', 'permissions', null, permission);

    }

    async getByID(id) {
        return await super.fetch('get', `permissions/${id}`, null);
    }

    async getByName(name) {
        return await super.fetch('get', `permissions/${name}`, null);
    }

    async getPermissions(page = '', pageSize = '', sort = 'id', order = 'asc') {
        return await super.fetch('get', `permissions?page=${page}&page_size=${pageSize}&sort=${sort}&order=${order}`, null);
    }

    async update(id, name, description) {
        let update = {
            name,
            description
        };
        return await super.fetch('post', `permissions/${id}`, null, update);
    }

    async delete(id) {
        return await super.fetch('delete', `permissions/${id}`, null);
    }
}

module.exports = Permission;