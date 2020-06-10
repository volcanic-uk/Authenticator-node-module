const V1Base = require('../v1_base');

class Principal extends V1Base {
    constructor() {
        super();
    }

    /**
     *
     * @param name name of the principal
     * @param dataset_id dataset id of the principal
     * @param privileges an array of privilege ids
     * @param roles an array of role ids
     * @returns {Promise<*|{status}|undefined>}
     */
    async create({ name = null, dataset_id = null, privileges = [], roles = [] }) {
        let principal = {
            name,
            dataset_id,
            privileges,
            roles
        };
        return super.fetch('post', 'principals', null, principal);
    }

    /**
     * Get principal by id
     * @param id the id of the principal
     * @returns {Promise<*|{status}|undefined>}
     */
    async getByID(id) {
        return super.fetch('get', `principals/${id}`, null, null);
    }


    /**
     * Get a list of principals with pagination and sort
     * @param query query to search for
     * @param dataset_id dataset id to search for
     * @param page page number
     * @param page_size size of page
     * @param sort sort by
     * @param order sort order (desc,asc)
     * @param name the name of a principal to search for
     * @param ids ids of principals to search for
     * @returns {Promise<*|{status}|undefined>}
     */
    async getPrincipals({ query = '', dataset_id = '', page = '', page_size = '', sort = 'id', order = 'asc', name = '', ids = '' }) {
        return super.fetch('get', `principals?query=${query}&dataset_id=${dataset_id}&page=${page}&page_size=${page_size}&sort=${sort}&order=${order}&name=${name}&ids=${ids}`, null);
    }

    /**
     * Update a principal by ID
     * @param id the id of principal to update
     * @param name the new name
     * @param roles list of roles as array of ids
     * @param privileges list of privileges as array of ids
     * @returns {Promise<*|{status}|undefined>}
     */
    async update({ id, name = null, roles = [], privileges = [] }) {
        let data = {
            name,
            privileges,
            roles
        };
        return super.fetch('post', `principals/${id}`, null, data);
    }

    async delete(id) {
        return super.fetch('delete', `principals/${id}`, null);
    }

    /**
     *
     * @param id
     * @param privileges
     * @returns {Promise<*|{status}|undefined>}
     */
    async updatePrivileges({ id, privileges = [] }) {
        return super.fetch('post', `principals/${id}/privileges`, null, {
            privileges
        });
    }

    /**
     *
     * @param id
     * @param roles
     * @returns {Promise<*|{status}|undefined>}
     */
    async updateRoles({ id, roles = [] }) {
        return super.fetch('post', `principals/${id}/roles`, null, {
            roles
        });
    }

    /**
     *
     * @param id
     * @returns {Promise<*|{status}|undefined>}
     */
    async deactivatePrincipal(id) {
        return super.fetch('post', `principals/${id}/deactivate`, null, {});
    }

    /**
     *
     * @param id
     * @returns {Promise<*|{status}|undefined>}
     */
    async activatePrincipal(id) {
        return super.fetch('post', `principals/${id}/activate`, null, {});
    }

    /**
     *
     * @param page
     * @param pageSize
     * @param query
     * @param name
     * @param source
     * @param dataset_id
     * @param sort
     * @param order
     * @param id the id of the principal
     * @returns {Promise<*|{status}|undefined>}
     */
    async getIdentities({ page = 1, pageSize = 10, query = null, name = null, source = null, dataset_id = null, sort = 'id', order = 'asc', id = null }) {
        return super.fetch('post', `principals/${id}/identities?query=${query}&dataset_id=${dataset_id}&page=${page}&${pageSize}&sort=${sort}&order=${order}&name=${name}&source=${source}`, null, {});
    }

    /**
     *
     * @param id
     * @returns {Promise<*|{status}|undefined>}
     */
    async getRoles(id) {
        return super.fetch('get', `principals/${id}/roles`, null, {});
    }
}


module.exports = Principal;