// require the custom api fetch from the helpers module folder
const V1Base = require('../v1_base');

class Permission extends V1Base {
    constructor() {
        super();
    }

    async create({ name, description = '', service_id }) {
        let permission = { name, service_id, description };
        return super.fetch('post', 'permissions', null, permission);

    }

    async getByID(id) {
        return super.fetch('get', `permissions/${id}`, null);
    }

    async getPermissions({ page = '', page_size = '', name = '', sort = 'id', order = 'asc', ids = '', query = '' }) {
        return super.fetch('get', `permissions?page=${page}&page_size=${page_size}&name=${name}&sort=${sort}&order=${order}&ids=${ids}&query=${query}`, null);
    }

    async update({ id, name, description }) {
        let update = {
            name,
            description
        };
        return super.fetch('post', `permissions/${id}`, null, update);
    }

    async delete(id) {
        return super.fetch('delete', `permissions/${id}`, null);
    }
}

module.exports = Permission;