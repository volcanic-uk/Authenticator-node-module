const customFetch = require('../../../helpers').customFetch;
const routes = require('../config');

/**
 * 
 * @function createNewPrincipal a function to create new principal on the authentication server, which takes 2 params 
 * 
 * @param name a string whcih represents the principal name desired
 * @param dataseID a number which represents the datasetID that represents the principal
 * 
 */
exports.createNewPrincipal = async (name, datasetID = null, token, privileges) => {
    let body = {
        name: name,
        dataset_id: datasetID,
        privileges
    };

    let header = {
        Authorization: `Bearer ${token}`
    };

    try {
        let create = await customFetch(routes.principal.create.method, routes.principal.create.path, header, body);
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
 * @function readPrincipal a function made to fetch a principal data from the auth server, which takes 1 parameter
 * 
 * @param PrincipalId the principal id desired to get his info
 * @param token is the token needed to pass to the header to authorize the action which is not required in this case
 * 
 */
exports.readPrincipal = async (principalId, token) => {
    try {
        let header = {
            Authorization: `Bearer ${token}`
        };
        let read = await customFetch(routes.principal.read.method, routes.principal.read.path(principalId), header, '');
        return read.response;
    } catch (error) {
        throw {
            message: error.response.data.message,
            code: error.response.data.errorCode,
        };
    }

};

exports.fetchAllPrincipals = async (token, query, datasetId, page, pageSize) => {
    try {
        let header = {
            Authorization: `Bearer ${token}`
        };
        let fetch = await customFetch(routes.principal.readAll.method, routes.principal.readAll.path(query, datasetId, page, pageSize), header);
        return fetch.response;
    } catch (error) {
        throw {
            message: error.response.data.message,
            code: error.response.data.errorCode,
        };
    }
};

/**
 * 
 * @function updatePrincipal a function to update he active state of a principal in the authenticator API which takes 2 primary params
 * 
 * @param active a number which is either 1 or 0 active or inactive
 * @param principal_id a number that represents the principal id needed to update
 * @param token which is the authorization token needed in the header to authorize the action
 * 
 */
exports.updatePrincipal = async (name, principal_id, dataset_id, token) => {
    let header = {
        Authorization: `Bearer ${token}`
    };

    let body = {
        name,
        dataset_id
    };

    try {
        let update = await customFetch(routes.principal.update.method, routes.principal.update.path(principal_id), header, body);
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
 * @function deletePrincipal a function made to delete a certain principal from the authentication server which takes 1 primary param
 * 
 * @param principal_id the id needed to delete a desired principal from the auth API
 * @param token hich is the authorization token needed in the header to authorize the action
 * 
 */
exports.deletePrincipal = async (principal_id, token) => {
    let header = {
        Authorization: `Bearer ${token}`
    };

    try {
        let deletePrincipal = await customFetch(routes.principal.delete.method, routes.principal.delete.path(principal_id), header);
        return {
            message: deletePrincipal.response.message
        };

    } catch (error) {
        throw {
            message: error.response.data.message,
            code: error.response.data.errorCode,
        };
    }

};