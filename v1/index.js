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
const { createPrivilege, readprivilege, updatePrivilege, deletePrivilege } = require('../src/authenticator/v1/privileges');
const { generateToken } = require('../src/authenticator/v1/middlewares/midWithAuth');

const identityRegisterAuth = async (name, password = null, id) => {
    return await identityRegister(name, password, id, await generateToken());
};

// principal authorised functions

const createPrincipalAuth = async (name, datasetId) => {
    return await createNewPrincipal(name, datasetId, await generateToken());
};

const deletePrincipalAuth = async (principalId) => {
    return await deletePrincipal(principalId, await generateToken());
};

const readPrincipalAuth = async (principalId) => {
    return await readPrincipal(principalId, await generateToken());
};

const updatePrincipalAuth = async (active, principalId) => {
    return await updatePrincipal(active, principalId, await generateToken());
};

// permissions authorisation functions
const createPermissionAuth = async (name, creatorId) => {
    return await createPermission(name, creatorId, await generateToken());
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

const craeteGroupAuth = async (name) => {
    return await createGroup(name, await generateToken());
};

const readGroupAuth = async (groupId) => {
    return await readGroup(groupId, await generateToken());
};

const updateGroupAuth = async (groupId, name) => {
    return await updateGroup(groupId, name, await generateToken());
};

const deleteGroupAuth = async (groupId) => {
    return await deleteGroup(groupId, await generateToken());
};

// services authorization functions

const craeteServiceAuth = async (name) => {
    return await createService(name, await generateToken());
};

const readServiceAuth = async (serviceId) => {
    return await readService(serviceId, await generateToken());
};

const updateServiceAuth = async (serviceId, name) => {
    return await updateService(serviceId, name, await generateToken());
};

const deleteServiceAuth = async (serviceId) => {
    return await deleteService(serviceId, await generateToken());
};

// privilege with auth functions

const createPrivilegeAuth = async (premissionId, groupId, scope) => {
    return await createPrivilege(premissionId, groupId, scope, await generateToken());
};

const readPrivilegeAuth = async (privilegeId) => {
    return await readprivilege(privilegeId, await generateToken());
};

const updatePrivilegeAuth = async (privilegeId, groupId, permissionId, scope) => {
    return await updatePrivilege(privilegeId, groupId, permissionId, scope, await generateToken());
};

const deletePrivilegeAuth = async (privilegeId) => {
    return await deletePrivilege(privilegeId, await generateToken());
};

//token validation
const localValidationAuth = async (tokenToValidate) => {
    return await localIdentityValidation(tokenToValidate, await generateToken());
};

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
    },
    privilege: {
        createPrivilegeAuth,
        readPrivilegeAuth,
        updatePrivilegeAuth,
        deletePrivilegeAuth
    }
};
