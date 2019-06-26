const customFetch = require('../../../helpers').customFetch;
const routes = require('../config');

/**
 * 
 * @function createService a function to create new service on the authentication server, which takes 2 params 
 * 
 * @param name a string whcih represents the service name desired
 * @param creator_id a number which represents the creator of the service 
 * 
 */

exports.createService = async (name, token) => {

    let header = {
        Authorization: `Bearer ${token}`
    };

    let body = {
        name
    };


    try {

        let create = await customFetch(routes.services.create.method, routes.services.create.path, header, body);
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
 * @function readService a function made to fetch a service data from the auth server, which takes 1 parameter
 * 
 * @param service_id the service id desired to get its info
 * @param token is the token needed to pass to the header to authorize the action which is not required in this case
 * 
 */

exports.readService = async (service_id, token) => {
    try {
        let header = {
            Authorization: `Bearer ${token}`
        };
        let read = await customFetch(routes.services.read.method, routes.services.read.path(service_id), header);
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

exports.fetchAll = async (token) => {
    try {
        let header = {
            Authorization: `Bearer ${token}`
        };
        let read = await customFetch(routes.services.readAll.method, routes.services.readAll.path, header);
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
 * @function updateService a function to update the name of a service in the authenticator API which takes 2 primary params
 * 
 * @param name a string which represents the service name update desired
 * @param service_id a number that represents the service id needed to update
 * @param token which is the authorization token needed in the header to authorize the action
 * 
 */

exports.updateService = async (service_id, name, token) => {
    let header = {
        Authorization: `Bearer ${token}`
    };

    let body = {
        name
    };

    try {
        let update = await customFetch(routes.services.update.method, routes.services.update.path(service_id), header, body);
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
 * @function deleteService a function made to delete a certain service from the authentication server which takes 1 primary param
 * 
 * @param service_id the id needed to delete a desired service from the auth API
 * @param token hich is the authorization token needed in the header to authorize the action
 * 
 */

exports.deleteService = async (service_id, token) => {
    let header = {
        Authorization: `Bearer ${token}`
    };

    try {
        let deleteIt = await customFetch(routes.services.delete.method, routes.services.delete.path(service_id), header);
        return {
            message: deleteIt.response.message
        };

    } catch (error) {
        throw {
            result: error.response.data.result,
            type: error.response.data.reason.type,
            message: error.response.data.reason.message,
            code: error.response.data.reason.errorCode
        };
    }
};