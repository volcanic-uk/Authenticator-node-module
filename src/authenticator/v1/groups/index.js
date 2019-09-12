const V1Base = require('../v1_base');

class Groups extends V1Base {

    constructor() {
        super();
    }

    async create(name) {
        let body = {
            name
        };
        return await super.fetch('post', 'groups', null, body);
    }

    async get(id) {
        return await super.fetch('get', `groups/${id}`, null);
    }

    async getGroups(query = '', page = null, pageSize = null, sort = 'id', order = 'asc') {
        return await super.fetch('get', `groups?query=${query}&page=${page}&page_size=${pageSize}&sort=${sort}&order=${order}`, null);
    }

    async update(id, name) {
        let body = {
            name
        };
        return await super.fetch('post', `groups/${id}`, null, body);
    }

    async delete(id) {
        return await super.fetch('delete', `groups/${id}`, null);
    }
}

module.exports = Groups;