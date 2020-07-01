// require the custom api fetch from the helpers module folder
const V1Base = require('../v1_base');

class Service extends V1Base {
    constructor() {
        super();
    }

    async create(name) {
        let service = { name };
        return super.fetch('post', 'services', null, service);

    }

    async getByID(id) {
        return super.fetch('get', `services/${id}`, null);
    }

    async getByName(name) {
        return super.fetch('get', `services/${name}`, null);
    }

    async getServices({ page = '', page_size = '', query = '', name = 'auth', sort = 'id', order = 'asc', ids = '' }) {
        return super.fetch('get', `services?page=${page}&page_size=${page_size}&name=${name}&sort=${sort}&order=${order}&ids=${ids}&query=${query}`, null);
    }

    async update(id, name) {
        let update = {
            name
        };
        return super.fetch('post', `services/${id}`, null, update);
    }

    async delete(id) {
        return super.fetch('delete', `services/${id}`, null);
    }
}

module.exports = Service;