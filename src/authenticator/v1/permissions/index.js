const customFetch = require('../../../helpers').customFetch;
const routes = require('../config');


/**
 * 
 * @function createPermission a function to create new permission on the authentication server, which takes 2 params 
 * 
 * @param name a string whcih represents the permission name desired
 * @param creator_id a number which represents the creator of the permission 
 * 
 */

exports.createPermission = async (serviceId, name, description, token) => {
    let header = {
        Authorization: `Bearer ${token}`
    };

    let body = {
        name: name,
        description: description,
        service_id: serviceId
    };


    try {

        let create = await customFetch(routes.permissions.create.method, routes.permissions.create.path, header, body);
        return create.response;

    } catch (error) {
        throw {
            message: error.response.data.message,
            code: error.response.data.errorCode,
        };
    }

};

/**
 * 
 * @function readPermission a function made to fetch a permission data from the auth server, which takes 1 parameter
 * 
 * @param permission_id the permission id desired to get its info
 * @param token is the token needed to pass to the header to authorize the action which is not required in this case
 * 
 */

exports.readPermission = async (permission_id, token) => {
    try {
        let header = {
            Authorization: `Bearer ${token}`
        };
        let read = await customFetch(routes.permissions.read.method, routes.permissions.read.path(permission_id), header);
        return read.response;
    } catch (error) {
        throw {
            message: error.response.data.message,
            code: error.response.data.errorCode,
        };
    }
};

exports.fetchAllPermissions = async (token, query = null, page = null, pageSize = null, sort = 'id', order = 'asc') => {
    try {
        let header = {
            Authorization: `Bearer ${token}`
        };
        let read = await customFetch(routes.permissions.readAll.method, routes.permissions.readAll.path(query, page, pageSize, sort, order), header);
        return read.response;
    } catch (error) {
        throw {
            message: error.response.data.message,
            code: error.response.data.errorCode,
        };
    }
};

/**
 * 
 * @function updatePermission a function to update the name of a permission in the authenticator API which takes 2 primary params
 * 
 * @param name a string which represents the permission name update desired
 * @param permission_id a number that represents the permission id needed to update
 * @param token which is the authorization token needed in the header to authorize the action
 * 
 */

exports.updatePermission = async (permission_id, name, token) => {
    let header = {
        Authorization: `Bearer ${token}`
    };

    let body = {
        name
    };

    try {
        let update = await customFetch(routes.permissions.update.method, routes.permissions.update.path(permission_id), header, body);
        return update.response;
    } catch (error) {
        throw {
            message: error.response.data.message,
            code: error.response.data.errorCode,
        };
    }
};

/**
 * 
 * @function deletePermission a function made to delete a certain permission from the authentication server which takes 1 primary param
 * 
 * @param permission_id the id needed to delete a desired permission from the auth API
 * @param token hich is the authorization token needed in the header to authorize the action
 * 
 */

exports.deletePermission = async (permission_id, token) => {
    let header = {
        Authorization: `Bearer ${token}`
    };

    try {
        let deleteIt = await customFetch(routes.permissions.delete.method, routes.permissions.delete.path(permission_id), header);
        return {
            message: deleteIt.response.message
        };

    } catch (error) {
        throw {
            message: error.response.data.message,
            code: error.response.data.errorCode,
        };
    }
};