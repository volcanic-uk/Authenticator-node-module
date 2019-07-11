const customFetch = require('../../../helpers').customFetch;
const routes = require('../config');

/**
 * 
 * @function createGroup a function to create new group on the authentication server, which takes 2 params 
 * 
 * @param name a string whcih represents the group name desired
 * 
 */

exports.createGroup = async (name, token) => {
    let header = {
        Authorization: `Bearer ${token}`
    };

    let body = {
        name
    };

    try {
        let create = await customFetch(routes.groups.create.method, routes.groups.create.path, header, body);
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
 * @function readGroup a function made to fetch a group data from the auth server, which takes 1 parameter
 * 
 * @param group_id the group id desired to get its info
 * @param token is the token needed to pass to the header to authorize the action which is not required in this case
 * 
 */

exports.readGroup = async (group_id, token) => {
    let header = {
        Authorization: `Bearer ${token}`
    };

    try {
        let read = await customFetch(routes.groups.read.method, routes.groups.read.path(group_id), header);
        return read.response;
    } catch (error) {
        throw {
            message: error.response.data.message,
            code: error.response.data.errorCode,
        };
    }
};

exports.readAllGroups = async (token, query, page, pageSize) => {
    let header = {
        Authorization: `Bearer ${token}`
    };

    try {
        let read = await customFetch(routes.groups.readAll.method, routes.groups.readAll.path(query, page, pageSize), header);
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
 * @function updateGroup a function to update the name of a group in the authenticator API which takes 2 primary params
 * 
 * @param name a string which represents the group name update desired
 * @param group_id a number that represents the group id needed to update
 * @param token which is the authorization token needed in the header to authorize the action
 * 
 */

exports.updateGroup = async (group_id, name, token) => {
    let header = {
        Authorization: `Bearer ${token}`
    };

    let body = {
        name
    };

    try {
        let update = await customFetch(routes.groups.update.method, routes.groups.update.path(group_id), header, body);
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
 * @function deleteGroup a function made to delete a certain group from the authentication server which takes 1 primary param
 * 
 * @param group_id the id needed to delete a desired group from the auth API
 * @param token hich is the authorization token needed in the header to authorize the action
 * 
 */

exports.deleteGroup = async (group_id, token) => {
    let header = {
        Authorization: `Bearer ${token}`
    };

    try {
        let deleteIt = await customFetch(routes.groups.delete.method, routes.groups.delete.path(group_id), header);
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