const { server } = require('../../../../config');
const AuthV1Error = require('../errors');

const findPrivilegesByServiceNameAndPermissionName = (privilegesList = [], serviceName = '', permissionName = '') => {
    for (const service of privilegesList) {
        if (service.name === serviceName) {
            for (const permission of service.permissions) {
                if (permission.name === permissionName) {
                    return permission.privileges;
                }
            }
        }
    }
    return [];
};

const checkAuthorization = ({ privilegesList = [], serviceName = '', permissionName = '', resourceType, resourceID, datasetID = '*' }) => {
    let selectedScope = null;
    if (resourceID === '*')
        resourceID = '\\*';
    if (datasetID === '*')
        datasetID = '\\*';
    // we changed the stackID to read from local config stack id
    let privileges = findPrivilegesByServiceNameAndPermissionName(privilegesList, serviceName, permissionName);
    for (const privilege of privileges) {
        // check if scope matches
        let regex = new RegExp(`vrn:(\\*|${server.stack_id}):(\\*|${datasetID}):(\\*|${resourceType})\\/(\\*|${resourceID})`);
        if (privilege.scope.match(regex)) {
            //matched scope
            let processedScope = processScope(privilege.scope, privilege.allow);
            if (!selectedScope) {
                selectedScope = processedScope;
            } else {
                selectedScope = compareScopes(selectedScope, processedScope);
            }
        }
    }
    if (!selectedScope || !selectedScope.allow) {
        throw new AuthV1Error({
            message:`You are not allowed to perform this action for dataset_id of ${datasetID} resource type of ${resourceType} on resource id of ${resourceID}`,
            status:'forbidden',
        });
    }
    return selectedScope;
};

const processScope = (scope, allow) => {
    // example scope: 'vrn:*:*:jobs/*?create_by='
    let processedScope = { allow: allow };
    extractStackDatasetAndResourceType(processedScope, scope);
    extractResourceID(processedScope, scope);
    return processedScope;
};

const compareScopes = (scope1, scope2) => {
    //always take scope with more precedence
    //if scopes are equal, return the one which has allow false
    if (equalScopes(scope1, scope2)) {
        return !scope1.allow && scope1 || !scope2.allow && scope2 || scope1;
    }
    // if scopes are not equal then start comparing resource id
    // scope with resource id = to * take less precedence
    if (scope1.resourceID === '*' && scope2.resourceID !== '*')
        return scope2;
    else if (scope1.resourceID !== '*' && scope2.resourceID === '*')
        return scope1;
    // if resource id equal then start comparing resource type
    // scope with resource id = to * take less precedence
    if (scope1.resourceType === '*' && scope2.resourceType !== '*')
        return scope2;
    else if (scope1.resourceType !== '*' && scope2.resourceType === '*')
        return scope1;
    // if resource type are equal, then compare dataset_id
    // scope with more specific dataset_id the precedence
    if (scope1.dataset_id === '*' && scope2.dataset_id !== '*')
        return scope2;
    else if (scope1.dataset_id !== '*' && scope2.dataset_id === '*')
        return scope1;
    // if resource id equal then start comparing resource type
    // scope with resource id = to * take less precedence
    if (scope1.stack === '*' && scope2.stack !== '*')
        return scope2;
    else if (scope1.stack !== '*' && scope2.stack === '*')
        return scope1;
};

const extractStackDatasetAndResourceType = (obj, scope) => {
    let resourceRegex = new RegExp(/vrn:(\*|[\w\d-+_#.]+):(\*|-?\+?\d+):([\d\w-+]+)/gm);
    let resourceMatch = scope.match(resourceRegex);
    if (!resourceMatch) {
        obj.stack = null;
        obj.dataset_id = null;
        obj.resourceType = null;
        return;
    }
    let resourceSegments = resourceMatch[0].split(':');
    obj.stack = resourceSegments[1];
    obj.dataset_id = resourceSegments[2];
    obj.resourceType = resourceSegments[3];
};

const splitSubject = (subject) => {
    let fields = subject.split('/');
    let stackName = fields[2];
    let datasetID = fields[3];
    let principalID = fields[4];
    let identityID = fields[5];
    return {
        stack_name: stackName,
        dataset_id: datasetID,
        principal_secure_id: principalID,
        identity_secure_id: identityID,
    };
};

const extractResourceID = (obj, scope) => {
    let resourceIDRegex = new RegExp(/\/(\*|[\w\d.#+-]+)/gm);
    let resourceIDMatch = scope.match(resourceIDRegex);
    if (!resourceIDMatch) {
        obj.resourceID = null;
        return;
    }
    let resourceIDSegments = resourceIDMatch[0].split('/');
    obj.resourceID = resourceIDSegments[1];
};

const equalScopes = (scope1, scope2) => {
    return scope1.stack === scope2.stack
        && scope1.dataset_id === scope2.dataset_id
        && scope1.resourceType === scope2.resourceType
        && scope1.resourceID === scope2.resourceID;
};

module.exports = {
    findPrivilegesByServiceNameAndPermissionName,
    processScope,
    checkAuthorization,
    splitSubject
};