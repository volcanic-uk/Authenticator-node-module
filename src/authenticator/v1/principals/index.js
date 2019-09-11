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

        try {
            return await super.fetch('post', 'principals', header, principal);
        } catch (e) {
            throw e;
        }
    }

    async getByID(id, header) {
        return await super.fetch('get', `principals/${id}`, header, null);
    }


    async getAll(header, query = '', datasetId = '', page = '', pageSize = '', sort = 'id', order = 'asc') {
        try {
            return await super.fetch('get', `principals?query=${query}&dataset_id=${datasetId}&page=${page}&${pageSize}&sort=${sort}&order=${order}`, header);
        } catch (e) {
            throw e;
        }
    }

    async update(id, name = null, datasetId = null, header) {
        let data = {
            name,
            dataset_id: datasetId
        };

        try {
            return await super.fetch('post', `principals/${id}`, header, data);
        } catch (e) {
            throw e;
        }
    }

    async delete(id, header) {
        try {
            return await super.fetch('delete', `principals/${id}`, header);
        } catch (e) {
            throw e;
        }
    }
}

module.exports = Principal;