// require the custom api fetch from the helpers module folder
const V1Base = require('../v1_base');

class Service extends V1Base {
    constructor() {
        super();
    }

    async create(name) {
        let service = { name };
        return await super.fetch('post', 'services', null, service);

    }

    async getByID(id) {
        return await super.fetch('get', `services/${id}`, null);
    }

    async getByName(name) {
        return await super.fetch('get', `services/${name}`, null);
    }

    async getServices(query = '', page = '', pageSize = '', sort = 'id', order = 'asc') {
        return await super.fetch('get', `services?query=${query}&page=${page}&page_size=${pageSize}&sort=${sort}&order=${order}`, null);
    }

    async update(id, name) {
        let update = {
            name
        };
        return await super.fetch('post', `services/${id}`, null, update);
    }

    async delete(id) {
        return await super.fetch('delete', `services/${id}`, null);
    }
}

module.exports = Service;