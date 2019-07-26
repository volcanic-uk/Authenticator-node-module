const customFetch = require('../../../helpers').customFetch;
const routes = require('../config');


/**
 * 
 * @function createPrevilege a function to create new Privilege on the authentication server, which takes 2 params 
 * 
 * @param name a string whcih represents the Privilege name desired
 * @param creator_id a number which represents the creator of the Privilege 
 * 
 */

exports.createPrivilege = async (permissionId, groupId, scope, token) => {
    let header = {
        Authorization: `Bearer ${token}`
    };

    let body = {
        permission_id: permissionId,
        group_id: groupId,
        scope
    };

    try {
        let create = await customFetch(routes.privileges.create.method, routes.privileges.create.path, header, body);
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
 * @function readPrivilege a function made to fetch a Privilege data from the auth server, which takes 1 parameter
 * 
 * @param privilege_id the Privilege id desired to get its info
 * @param token is the token needed to pass to the header to authorize the action which is not required in this case
 * 
 */

exports.readPrivilege = async (privilegeId, token) => {
    try {
        let header = {
            Authorization: `Bearer ${token}`
        };
        let read = await customFetch(routes.privileges.read.method, routes.privileges.read.path(privilegeId), header);
        return read.response;
    } catch (error) {
        throw {
            message: error.response.data.message,
            code: error.response.data.errorCode,
        };
    }
};

exports.readAllPrivileges = async (token, query = null, page = null, pageSize = null, sort = 'id', order = 'asc') => {
    try {
        let header = {
            Authorization: `Bearer ${token}`
        };
        let read = await customFetch(routes.privileges.readAll.method, routes.privileges.readAll.path(query, page, pageSize, sort, order), header);
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
 * @function updatePrivilege a function to update the name of a Privilege in the authenticator API which takes 2 primary params
 * 
 * @param name a string which represents the Privilege name update desired
 * @param privilegeId a number that represents the Privilege id needed to update
 * @param token which is the authorization token needed in the header to authorize the action
 * 
 */

exports.updatePrivilege = async (privilegeId, groupId, permissionId, scope, token) => {
    let header = {
        Authorization: `Bearer ${token}`
    };

    let body = {
        scope,
        group_id: groupId,
        permission_id: permissionId
    };

    try {
        let update = await customFetch(routes.privileges.update.method, routes.privileges.update.path(privilegeId), header, body);
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
 * @function deletePrivilege a function made to delete a certain Privilege from the authentication server which takes 1 primary param
 * 
 * @param privilegeId the id needed to delete a desired Privilege from the auth API
 * @param token hich is the authorization token needed in the header to authorize the action
 * 
 */

exports.deletePrivilege = async (privilegeId, token) => {
    let header = {
        Authorization: `Bearer ${token}`
    };

    try {
        let deleteIt = await customFetch(routes.privileges.delete.method, routes.privileges.delete.path(privilegeId), header);
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