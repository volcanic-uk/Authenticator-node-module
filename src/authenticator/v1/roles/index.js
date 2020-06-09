const V1Base = require('../v1_base');

class Roles extends V1Base {
    constructor() {
        super();
    }

    async create(name, privileges = [], parentId) {
        let role = {
            name,
            privileges,
            parent_id: parentId

        };
        return super.fetch('post', 'roles', null, role);
    }

    async getById(id) {
        return super.fetch('get', `roles/${id}`, null);
    }

    async getRoles(page = '', pageSize = '', name = '', sort = 'id', order = 'asc', ids) {
        return super.fetch('get', `roles?page=${page}&page_size=${pageSize}&name=${name}&sort=${sort}&order=${order}&ids=${ids}`, null);
    }

    async update(id, name, privileges, parentId) {
        let role = {
            name,
            privileges,
            parent_id: parentId
        };
        return super.fetch('post', `roles/${id}`, null, role);
    }

    async delete(id) {
        return super.fetch('delete', `roles/${id}`, null);
    }
}

module.exports = Roles;