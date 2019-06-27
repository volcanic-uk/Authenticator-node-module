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
        return {
            name: create.response.name,
            creator_id: create.response.creator_id,
            id: create.response.id,
            updated_at: create.response.updated_at,
            created_at: create.response.created_at
        };

    } catch (error) {
        throw {
            result: error.response.data.result,
            message: error.response.data.reason.message,
            code: error.response.data.reason.errorCode,
            name: error.response.data.reason.name
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
        return {
            id: read.response.id,
            name: read.response.name,
            description: read.response.description,
            creator_id: read.response.creator_id,
            active: read.response.active,
            created_at: read.response.created_at,
            updated_at: read.response.updated_at
        };
    } catch (error) {
        throw {
            result: error.response.data.result,
            type: error.response.data.reason.name,
            message: error.response.data.reason.message,
            code: error.response.data.reason.errorCode
        };
    }
};

exports.readAllGroups = async (token) => {
    let header = {
        Authorization: `Bearer ${token}`
    };

    try {
        let read = await customFetch(routes.groups.readAll.method, routes.groups.readAll.path, header);
        return read.response;
    } catch (error) {
        throw {
            result: error.response.data.result,
            type: error.response.data.reason.name,
            message: error.response.data.reason.message,
            code: error.response.data.reason.errorCode
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
        return {
            id: update.response.id,
            name: update.response.name,
            creator_id: update.response.creator_id,
            description: update.response.description,
            active_status: update.response.active,
            created_at: update.response.created_at,
            updated_at: update.response.updated_at
        };
    } catch (error) {
        throw {
            result: error.response.data.result,
            type: error.response.data.reason.name,
            message: error.response.data.reason.message,
            code: error.response.data.reason.errorCode
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
            result: error.response.data.result,
            type: error.response.data.reason.name,
            message: error.response.data.reason.message,
            code: error.response.data.reason.errorCode
        };
    }
};