const Token = require('../authenticator/v1/token');
const Privilege = require('../authenticator/v1/privileges');

class Authorization {
    // allow on specific resource ID
    // allow false to all and one thing is true
    async AuthorizeAction(authObjectParams) {
        const { token, service_name: serviceName, stack_id: stackID, dataset_id: datasetID, resource_name: resourceName, resource_id: resourceID, permission_name: permissionName } = authObjectParams;
        const isTokenValid = await new Token().setToken(token).remoteValidation();
        const servicesList = await new Privilege().setToken(token).getByToken();
        const privilegeScope = `vrn:${stackID}:${datasetID}:${resourceName}/${resourceID}`;
        isTokenValid && servicesList.map(service => {
            if (service.name === serviceName) {
                service.permissions.map(permission => {
                    if (permission.name === permissionName) {
                        permission.privileges.map(privilege => {
                            if (privilege.scope === privilegeScope && privilege.allow === true) {
                                return 'yes you can do it';
                            } else {
                                throw 'no match';
                            }
                        });
                    }
                });
            }
        });
    }

}

module.exports = Authorization;