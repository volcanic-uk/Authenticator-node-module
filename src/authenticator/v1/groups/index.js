const V1Base = require('../v1_base');

class Groups extends V1Base {

    constructor() {
        super();
    }

    async create({ name = '', permissions = [], description = '' }) {
        let group = {
            name,
            permissions,
            description
        };
        return super.fetch('post', 'groups', null, group);
    }

    async getById(id) {
        return super.fetch('get', `groups/${id}`, null);
    }

    async getByName(name) {
        return super.fetch('get', `groups/${name}`, null);
    }

    async getGroups({ query = '', page = 1, name = '', page_size = 10, sort = 'id', order = 'asc' }) {
        return super.fetch('get', `groups?query=${query}&page=${page}&page_size=${page_size}&name=${name}&sort=${sort}&order=${order}`, null);
    }

    async update({ id, name = '', permissions = [], description = '' }) {
        let group = {
            name,
            description,
            permissions
        };
        return super.fetch('post', `groups/${id}`, null, group);
    }

    async delete(id) {
        return super.fetch('delete', `groups/${id}`, null);
    }
    async attachPermissions(id, permission_ids) {
        let body = {
            permission_ids: permission_ids
        };
        return super.fetch('post', `groups/${id}/permissions/attach`, null, body);
    }
}

module.exports = Groups;
