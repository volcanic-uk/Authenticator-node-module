const customFetch = require('../../../helpers').customFetch;
const routes = require('../config');
const envConfigs = require('../../../../config');
const { getFromCache } = require('../cache');

/**
 * 
 * @function createNewPrincipal a function to create new principal on the authentication server, which takes 2 params 
 * 
 * @param name a string whcih represents the principal name desired
 * @param dataseID a number which represents the datasetID that represents the principal
 * 
 */
exports.createNewPrincipal = async (name, datasetID=null, token) => {
    const authIdentity = envConfigs.auth.authIdentity;

    let credentials = {
        name: name,
        dataset_id: datasetID
    };

    if (!token) {
        token = await getFromCache(authIdentity);
    }

    let header = {
        Authorization: `Bearer ${token}`
    };

    try {
        let create = await customFetch(routes.principal.create.method, routes.principal.create.path, header, credentials);
        return {
            name: create.response.name,
            dataset_id: create.response.dataset_id,
            id: create.response.id
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
 * @function readPrincipal a function made to fetch a principal data from the auth server, which takes 1 parameter
 * 
 * @param PrincipalId the principal id desired to get his info
 * @param token is the token needed to pass to the header to authorize the action which is not required in this case
 * 
 */
exports.readPrincipal = async (principalId, token) => {
    const authIdentity = envConfigs.auth.authIdentity;
    try {
        if (!token){
            token = await getFromCache(authIdentity);
        }
        let header = {
            Authorization: `Bearer ${token}` 
        };
        let read = await customFetch(routes.principal.read.method, routes.principal.read.path(principalId), header);
        return {
            id: read.response.id,
            name: read.response.name,
            dataset_id: read.response.dataset_id,
            last_active_date: read.response.last_active_date,
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

/**
 * 
 * @function updatePrincipal a function to update he active state of a principal in the authenticator API which takes 2 primary params
 * 
 * @param active a number which is either 1 or 0 active or inactive
 * @param principal_id a number that represents the principal id needed to update
 * @param token which is the authorization token needed in the header to authorize the action
 * 
 */
exports.updatePrincipal = async (active, principal_id, token) => {
    const authIdentity = envConfigs.auth.authIdentity;

    if (!token){
        token = await getFromCache(authIdentity);
    }
    let header = {
        Authorization: `Bearer ${token}`
    };

    let data = {
        active
    };

    try {
        let update = await customFetch(routes.principal.update.method, routes.principal.update.path(principal_id), header, data);
        return {
            id: update.response.id,
            name: update.response.name,
            dataset_id: update.response.dataset_id,
            last_active_date: update.response.last_active_date,
            active: update.response.active,
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
 * @function deletePrincipal a function made to delete a certain principal from the authentication server which takes 1 primary param
 * 
 * @param principal_id the id needed to delete a desired principal from the auth API
 * @param token hich is the authorization token needed in the header to authorize the action
 * 
 */
exports.deletePrincipal = async (principal_id, token) => {
    const authIdentity = envConfigs.auth.authIdentity;

    if (!token){
        token = await getFromCache(authIdentity);
    }
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
            result: error.response.data.result,
            type: error.response.data.reason.type,
            message: error.response.data.reason.message,
            code: error.response.data.reason.errorCode
        };
    }

};