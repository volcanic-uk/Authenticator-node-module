const V1Base = require('../v1_base');

class Principal extends V1Base {
    constructor() {
        super();
    }

    async create(name = null, datasetID = null, privileges = [], roles = []) {
        let principal = {
            name,
            dataset_id: datasetID,
            privileges,
            roles
        };
        return super.fetch('post', 'principals', null, principal);
    }

    async getByID(secureID) {
        return super.fetch('get', `principals/${secureID}`, null, null);
    }


    async getPrincipals(query = '', datasetId = '', page = '', pageSize = '', sort = 'id', order = 'asc') {
        return super.fetch('get', `principals?query=${query}&dataset_id=${datasetId}&page=${page}&page_size=${pageSize}&sort=${sort}&order=${order}`, null);
    }

    async update(id, name = null) {
        let data = {
            name
        };
        return super.fetch('post', `principals/${id}`, null, data);
    }

    async delete(id) {
        return super.fetch('delete', `principals/${id}`, null);
    }

    async updatePrivileges(id, privileges = []) {
        return super.fetch('post', `principals/${id}/privileges`, null, {
            privileges
        });
    }

    async updateRoles(id, roles = []) {
        return super.fetch('post', `principals/${id}/roles`, null, {
            roles
        });
    }

    async deactivatePrincipal(id) {
        return super.fetch('post', `principals/${id}/deactivate`, null, {});
    }

    async activatePrincipal(id) {
        return super.fetch('post', `principals/${id}/activate`, null, {});
    }

    async getIdentities(page = 1, pageSize = 10, query = null, name = null, source = null, datasetId = null, sort = 'id', order = 'asc', id = null) {
        return super.fetch('post', `principals/${id}/identities?query=${query}&dataset_id=${datasetId}&page=${page}&${pageSize}&sort=${sort}&order=${order}&name=${name}&source=${source}`, null, {});
    }

    async getRoles(id) {
        return super.fetch('get', `principals/${id}/roles`, null, {});
    }
}


module.exports = Principal;