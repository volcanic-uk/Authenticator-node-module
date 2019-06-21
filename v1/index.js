/**
 * @function identityLogin to fetch data from the login API by passing the name and the secret
 * the function then will return a token as a string 
 * 
 * @function identityRegister to to register a user using the register identity api by passing identity name 
 * and an authorization token that'll be passed implicitly in the header
 * the response will then return an object containing name, secret, creation date, update date
 * 
 * @function identityValidation to get a validation response from the identity token validation api by passing the token
 * the function then will return an object containing all the info related to the token provided 
 * as an object containing the following: token expiry date, token issue time, token issuer, and the token id
 * 
 * @function identityLogout to black list a token by passing the token as a string parameter 
 * the function then will return a success or a fail message depending on the token whether it is valid,
 * blacklisted already, or invalid
 */


// local dependencies & modules call 

const { identityLogin, identityRegister, remoteIdentityValidation, localIdentityValidation, identityLogout } = require('../src/authenticator/v1/identity');
const { createNewPrincipal, deletePrincipal, readPrincipal, updatePrincipal } = require('../src/authenticator/v1/principals');
const { createPermission, readPermission, updatePermission, deletePermission } = require('../src/authenticator/v1/permissions');
const { createGroup, readGroup, updateGroup, deleteGroup } = require('../src/authenticator/v1/groups');
const { createService, readService, updateService, deleteService } = require('../src/authenticator/v1/services');
const { generateToken } = require('../src/authenticator/v1/middlewares/midWithAuth');

const identityRegisterAuth = async (name, password = null, id) => {
    return await identityRegister(name, password, id, await generateToken());
};

// principal authorised functions

const createPrincipalAuth = async (name, dataset_id) => {
    return await createNewPrincipal(name, dataset_id, await generateToken());
};

const deletePrincipalAuth = async (principalId) => {
    return await deletePrincipal(principalId, await generateToken());
};

const readPrincipalAuth = async (principal_id) => {
    return await readPrincipal(principal_id, await generateToken());
};

const updatePrincipalAuth = async (active, principal_id) => {
    return await updatePrincipal(active, principal_id, await generateToken());
};

// permissions authorisation functions
const createPermissionAuth = async (name, creator_id) => {
    return await createPermission(name, creator_id, await generateToken());
};

const readPermissionAuth = async (id) => {
    return await readPermission(id, await generateToken());
};

const updatePermissionAuth = async (id, name) => {
    return await updatePermission(id, name, await generateToken());
};

const deletePermissionAuth = async (id) => {
    return await deletePermission(id, await generateToken());
};

// groups authorization functions

const craeteGroupAuth = async (name, creator_id) => {
    return await createGroup(name, creator_id, await generateToken());
};

const readGroupAuth = async (group_id) => {
    return await readGroup(group_id, await generateToken());
};

const updateGroupAuth = async (group_id, name) => {
    return await updateGroup(group_id, name, await generateToken());
};

const deleteGroupAuth = async (group_id) => {
    return await deleteGroup(group_id, await generateToken());
};

// services authorization functions

const craeteServiceAuth = async (name) => {
    return await createService(name, await generateToken());
};

const readServiceAuth = async (service_id) => {
    return await readService(service_id, await generateToken());
};

const updateServiceAuth = async (service_id, name) => {
    return await updateService(service_id, name, await generateToken());
};

const deleteServiceAuth = async (service_id) => {
    return await deleteService(service_id, await generateToken());
};

//token validation
const localValidationAuth = async (tokenToValidate) => {
    return await localIdentityValidation(tokenToValidate, await generateToken());
};

updatePrincipalAuth(1 ,2);

module.exports = {
    identity: {
        identityLogin,
        identityRegisterAuth,
        remoteIdentityValidation,
        localValidationAuth,
        identityLogout,
    },
    principalWithAuth: {
        createPrincipalAuth,
        deletePrincipalAuth,
        readPrincipalAuth,
        updatePrincipalAuth
    },
    principal: {
        createNewPrincipal,
        deletePrincipal,
        readPrincipal,
        updatePrincipal
    },
    permissions: {
        createPermissionAuth,
        readPermissionAuth,
        updatePermissionAuth,
        deletePermissionAuth
    },
    groups: {
        craeteGroupAuth,
        readGroupAuth,
        updateGroupAuth,
        deleteGroupAuth
    },
    services: {
        craeteServiceAuth,
        readServiceAuth,
        updateServiceAuth,
        deleteServiceAuth
    }
};
