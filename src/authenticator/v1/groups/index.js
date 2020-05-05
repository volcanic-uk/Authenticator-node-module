const V1Base = require('../v1_base');

class Groups extends V1Base {

    constructor() {
        super();
    }

    async create(name, permissions = [], description = '') {
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

    async getGroups(query = '', page = null, pageSize = null, sort = 'id', order = 'asc') {
        return super.fetch('get', `groups?query=${query}&page=${page}&page_size=${pageSize}&sort=${sort}&order=${order}`, null);
    }

    async update(id, name = null, description = null) {
        let group = {
            name,
            description
        };
        return super.fetch('post', `groups/${id}`, null, group);
    }

    async delete(id) {
        return super.fetch('delete', `groups/${id}`, null);
    }
}

module.exports = Groups;