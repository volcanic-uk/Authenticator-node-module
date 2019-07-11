const customFetch = require('../../../helpers').customFetch;
const routes = require('../config');

/**
 * 
 * @function createRole a function to create new Role on the authentication server, which takes 2 params 
 * 
 * @param name a string whcih represents the Role name desired
 * @param creator_id a number which represents the creator of the Role 
 * 
 */

exports.createRole = async (name, serviceId, privileges, subject_id, token) => {
    let header = {
        Authorization: `Bearer ${token}`
    };

    let body = {
        name,
        service_id :serviceId,
        privileges,
        subject_id
    };

    try {
        let create = await customFetch(routes.roles.create.method, routes.roles.create.path, header, body);
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
 * @function readRole a function made to fetch a Role data from the auth server, which takes 1 parameter
 * 
 * @param Role_id the Role id desired to get its info
 * @param token is the token needed to pass to the header to authorize the action which is not required in this case
 * 
 */

exports.readRole = async (RoleId, token) => {
    try {
        let header = {
            Authorization: `Bearer ${token}`
        };
        let read = await customFetch(routes.roles.read.method, routes.roles.read.path(RoleId), header);
        return read.response;
    } catch (error) {
        throw {
            message: error.response.data.message,
            code: error.response.data.errorCode,
        };
    }
};

exports.readAllRoles = async (token, query, page, pageSize) => {
    try {
        let header = {
            Authorization: `Bearer ${token}`
        };
        let read = await customFetch(routes.roles.readAll.method, routes.roles.readAll.path(query, page, pageSize), header);
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
 * @function updateRole a function to update the name of a Role in the authenticator API which takes 2 primary params
 * 
 * @param name a string which represents the Role name update desired
 * @param RoleId a number that represents the Role id needed to update
 * @param token which is the authorization token needed in the header to authorize the action
 * 
 */

exports.updateRole = async (roleId, name, serviceId, privileges, subject_id, token) => {
    let header = {
        Authorization: `Bearer ${token}`
    };

    let body = {
        name,
        service_id: serviceId,
        privileges,
        subject_id
    };

    try {
        let update = await customFetch(routes.roles.update.method, routes.roles.update.path(roleId), header, body);
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
 * @function deleteRole a function made to delete a certain Role from the authentication server which takes 1 primary param
 * 
 * @param RoleId the id needed to delete a desired Role from the auth API
 * @param token hich is the authorization token needed in the header to authorize the action
 * 
 */

exports.deleteRole = async (RoleId, token) => {
    let header = {
        Authorization: `Bearer ${token}`
    };

    try {
        let deleteIt = await customFetch(routes.roles.delete.method, routes.roles.delete.path(RoleId), header);
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