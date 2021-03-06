const V1Base = require('../v1_base');

class Roles extends V1Base {
    constructor() {
        super();
    }

    async create({ name, privileges = [], parent_id = null }) {
        let role = {
            name,
            privileges,
            parent_role_id: parent_id

        };
        return super.fetch('post', 'roles', null, role);
    }

    async getById(id) {
        return super.fetch('get', `roles/${id}`, null);
    }

    async getRoles({ page = '', page_size = '', name = '', sort = 'id', order = 'asc', ids = '', query = '' }) {
        return super.fetch('get', `roles?page=${page}&page_size=${page_size}&name=${name}&sort=${sort}&order=${order}&ids=${ids}&query=${query}`, null);
    }

    async update({ id, name = '', privileges = [], parent_id = null }) {
        let role = {
            name,
            privileges,
            parent_role_id: parent_id
        };
        return super.fetch('post', `roles/${id}`, null, role);
    }

    async delete(id) {
        return super.fetch('delete', `roles/${id}`, null);
    }

    async attachPrivileges(id, privilege_ids) {
        let body = {
            privilege_ids: privilege_ids
        };
        return super.fetch('post', `roles/${id}/privileges/attach`, null, body);
    }
}

module.exports = Roles;