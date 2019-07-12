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
const { createNewPrincipal, deletePrincipal, readPrincipal, fetchAllPrincipals, updatePrincipal } = require('../src/authenticator/v1/principals');
const { createPermission, readPermission, updatePermission, deletePermission, fetchAllPermissions } = require('../src/authenticator/v1/permissions');
const { createGroup, readGroup, readAllGroups, updateGroup, deleteGroup } = require('../src/authenticator/v1/groups');
const { createService, readService, updateService, deleteService, fetchAll } = require('../src/authenticator/v1/services');
const { createPrivilege, readPrivilege, readAllPrivileges, updatePrivilege, deletePrivilege } = require('../src/authenticator/v1/privileges');
const { createRole, readRole, readAllRoles, updateRole, deleteRole } = require('../src/authenticator/v1/roles');
const { generateToken } = require('../src/authenticator/v1/middlewares/midWithAuth');

const identityRegisterAuth = async (name, password = null, id, privileges) => {
    return await identityRegister(name, password, id, await generateToken(), privileges);
};

// principal authorised functions

const createPrincipalAuth = async (name, datasetId, privileges) => {
    return await createNewPrincipal(name, datasetId, await generateToken(), privileges);
};

const deletePrincipalAuth = async (principalId) => {
    return await deletePrincipal(principalId, await generateToken());
};

const readPrincipalAuth = async (principalId) => {
    return await readPrincipal(principalId, await generateToken());
};

const updatePrincipalAuth = async (name, principalId, datasetId) => {
    return await updatePrincipal(name, principalId, datasetId, await generateToken());
};

const fetchAllPrincipalsAuth = async (query, datasetId, page, pageSize) => {
    return await fetchAllPrincipals(await generateToken(), query, datasetId, page, pageSize);
};

// permissions authorisation functions
const createPermissionAuth = async (serviceId, name, description) => {
    return await createPermission(serviceId, name, description, await generateToken());
};

const readPermissionAuth = async (id) => {
    return await readPermission(id, await generateToken());
};

const fetchAllPermissionsAuth = async (query, page, pageSize) => {
    return fetchAllPermissions(await generateToken(), query, page, pageSize);
};

const updatePermissionAuth = async (id, name) => {
    return await updatePermission(id, name, await generateToken());
};

const deletePermissionAuth = async (id) => {
    return await deletePermission(id, await generateToken());
};

// groups authorization functions

const createGroupAuth = async (name) => {
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

const fetchAllGroupsAuth = async (query, page, pageSize) => {
    return await readAllGroups(await generateToken(), query, page, pageSize);
};

// services authorization functions

const createServiceAuth = async (name) => {
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

const fetchAllAuth = async (query, page, pageSize) => {
    return await fetchAll(await generateToken(), query, page, pageSize);
};

// privilege with auth functions

const createPrivilegeAuth = async (premissionId, groupId, scope) => {
    return await createPrivilege(premissionId, groupId, scope, await generateToken());
};

const readPrivilegeAuth = async (privilegeId) => {
    return await readPrivilege(privilegeId, await generateToken());
};

const updatePrivilegeAuth = async (privilegeId, groupId, permissionId, scope) => {
    return await updatePrivilege(privilegeId, groupId, permissionId, scope, await generateToken());
};

const deletePrivilegeAuth = async (privilegeId) => {
    return await deletePrivilege(privilegeId, await generateToken());
};

const fetchAllPrivilegesAuth = async (query, page, pageSize) => {
    return await readAllPrivileges(await generateToken(), query, page, pageSize);
};

// Roles API
const createRoleAuth = async (name, serviceId, privileges) => {
    return await createRole(name, serviceId, privileges, await generateToken());
};

const readRoleAuth = async (id) => {
    return await readRole(id, await generateToken());
};

const readAllRolesAuth = async (query, page, pageSize) => {
    return await readAllRoles(await generateToken(), query, page, pageSize);
};

const updateRoleAuth = async (id, name, serviceId, privileges) => {
    return await updateRole(id, name, serviceId, privileges, await generateToken());
};

const deleteRoleAuth = async (id) => {
    return await deleteRole(id, await generateToken());
};

//token validation
const localValidationAuth = async (tokenToValidate) => {
    return await localIdentityValidation(tokenToValidate, await generateToken());
};

module.exports = {
    identities: {
        identityLogin,
        identityRegisterAuth,
        remoteIdentityValidation,
        localValidationAuth,
        identityLogout,
    },
    principalsAuth: {
        createPrincipalAuth,
        deletePrincipalAuth,
        readPrincipalAuth,
        updatePrincipalAuth,
        fetchAllPrincipalsAuth
    },
    principals: {
        createNewPrincipal,
        deletePrincipal,
        readPrincipal,
        fetchAllPrincipals,
        updatePrincipal
    },
    permissionsAuth: {
        createPermissionAuth,
        readPermissionAuth,
        updatePermissionAuth,
        deletePermissionAuth,
        fetchAllPermissionsAuth
    },
    permissions: {
        createPermission,
        readPermission,
        updatePermission,
        deletePermission,
        fetchAllPermissions
    },
    groupsAuth: {
        createGroupAuth,
        readGroupAuth,
        updateGroupAuth,
        deleteGroupAuth,
        fetchAllGroupsAuth
    },
    groups: {
        createGroup,
        readGroup,
        readAllGroups,
        updateGroup,
        deleteGroup
    },
    servicesAuth: {
        createServiceAuth,
        readServiceAuth,
        updateServiceAuth,
        deleteServiceAuth,
        fetchAllAuth
    },
    services: {
        createService,
        readService,
        updateService,
        deleteService,
        fetchAll
    },
    privilegesAuth: {
        createPrivilegeAuth,
        readPrivilegeAuth,
        updatePrivilegeAuth,
        deletePrivilegeAuth,
        fetchAllPrivilegesAuth
    },
    privileges: {
        createPrivilege,
        readPrivilege,
        readAllPrivileges,
        updatePrivilege,
        deletePrivilege
    },
    roles: {
        createRole,
        readRole,
        readAllRoles,
        updateRole,
        deleteRole
    },
    rolesAuth: {
        createRoleAuth,
        readRoleAuth,
        readAllRolesAuth,
        updateRoleAuth,
        deleteRoleAuth
    }
};
