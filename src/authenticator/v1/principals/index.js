const V1Base = require('../v1_base');

class Principal extends V1Base {
    constructor() {
        super();
    }

    async create(name = null, datasetID = null, header = null) {
        let principal = {
            name: name,
            dataset_id: datasetID
        };
        return await super.fetch('post', 'principals', header, principal);
    }

    async getByID(id, header) {
        return await super.fetch('get', `principals/${id}`, header, null);
    }


    async getPrincipals(header, query = '', datasetId = '', page = '', pageSize = '', sort = 'id', order = 'asc') {
        return await super.fetch('get', `principals?query=${query}&dataset_id=${datasetId}&page=${page}&${pageSize}&sort=${sort}&order=${order}`, header);
    }

    async update(id, name = null, datasetId = null, header) {
        let data = {
            name,
            dataset_id: datasetId
        };
        return await super.fetch('post', `principals/${id}`, header, data);
    }

    async delete(id, header) {
        return await super.fetch('delete', `principals/${id}`, header);
    }
}

module.exports = Principal;