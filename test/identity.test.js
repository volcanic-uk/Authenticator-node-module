const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const expect = chai.expect;
chai.use(chaiAsPromised);
const { identityLogin, identityRegisterAuth, remoteIdentityValidation, identityLogout } = require('../v1/index').identity;
const { createPrincipalAuth, readPrincipalAuth, updatePrincipalAuth, deletePrincipalAuth } = require('../v1/index').principal;
const { createNewPrincipal, deletePrincipal, readPrincipal, updatePrincipal } = require('../src/authenticator/v1/principals/index');
const { createPermissionAuth, readPermissionAuth, updatePermissionAuth, deletePermissionAuth } = require('../v1/index').permissions;
const { createPermission, readPermission, updatePermission, deletePermission } = require('../src/authenticator/v1/permissions/index');
const { createGroup, readGroup, updateGroup, deleteGroup } = require('../src/authenticator/v1/groups');
const { createGroupAuth, readGroupAuth, updateGroupAuth, deleteGroupAuth } = require('../v1/index').groups;
const { createService, readService, updateService, deleteService } = require('../src/authenticator/v1/services');
const { createServiceAuth, readServiceAuth, updateServiceAuth, deleteServiceAuth } = require('../v1/index').services;
const { createPrivilege, readPrivilege, updatePrivilege, deletePrivilege } = require('../src/authenticator/v1/privileges');
const { createPrivilegeAuth, readPrivilegeAuth, updatePrivilegeAuth, deletePrivilegeAuth } = require('../v1/index').privilege;

describe('identity', () => {

    let tmpIdentityName = 'Volcanic' + Math.floor(Math.random() * 10000);
    let tmpArray = [tmpIdentityName];
    let tmpIdentityPassword = 'Password' + Math.floor(Math.random() * 10000);
    let tempPrincipalName = 'Volcanic' + Math.floor(Math.random() * 10000);
    let tempPrincipalId = Math.floor(Math.random() * 10000);
    let tmpCreatorId = Math.floor(Math.random() * 10000);
    let tempPermissionName = 'Volcanic' + Math.floor(Math.random() * 10000);
    let identity = null;
    let token = null;
    let principal_id = null;
    let permission_id = null;
    let tmpGroupName = 'Volcanic' + Math.floor(Math.random() * 10000);
    let group_id = null;
    let tmpServiceName = 'Volcanic' + Math.floor(Math.random() * 10000);
    let service_id = null;
    let privilegeId = null;

    // principal creation
    it('should return an error if the Authorization header is missing or token is malformed', async () => {
        try {
            await createNewPrincipal(tempPrincipalName, tempPrincipalId, 'asdasd');
            throw 'can not create principal with malformed or no token';
        } catch (e) {
            expect(e.message).to.be.equal('Invalid JWT token');
        }
    });

    it('should return an object when the principal is successfully created', async () => {
        let principal = await createPrincipalAuth(tempPrincipalName, tempPrincipalId);
        principal_id = principal.id;
        expect(principal).to.be.instanceOf(Object).and.have.property('dataset_id').that.equals(tempPrincipalId);
    });

    it('should return an error when a duplicate entry occurs', async () => {
        try {
            await createPrincipalAuth(tempPrincipalName, tempPrincipalId);
            throw 'can not craete a duplicate identiy name';
        } catch (e) {
            expect(e.message).equals(`Duplicate entry ${tempPrincipalName}`);
        }
    });

    // reading principal
    it('should return an error if the principal does not exist', async () => {
        try {
            await readPrincipalAuth(tempPrincipalId);
            throw 'can not retrieve a principal that does not exist';
        } catch (e) {
            expect(e.message).equals('Principal does not exist');
        }
    });

    it('should return an error if the request does not have a jwt authorization header', async () => {
        try {
            await readPrincipal(principal_id, 'asddas');
            throw 'can not read principal with malformed or no token';
        } catch (e) {
            expect(e.message).to.be.equals('Invalid JWT token');
        }
    });

    it('should return an object if the principal is found', async () => {
        expect(readPrincipalAuth(principal_id)).to.be.instanceOf(Object).and.eventually.have.nested.property('dataset_id').that.equals(tempPrincipalId);
    });

    //update principal
    it('should return an error if the header has no auhtorization token or a malformed one', async () => {
        try {
            await updatePrincipal(1, principal_id, 'asdasd');
            throw 'can not read principal with malformed or no token';
        } catch (e) {
            expect(e.message).equals('Invalid JWT token');
        }
    });

    it('should return an error if the principal does not exist', async () => {
        try {
            await updatePrincipalAuth(1, principal_id + 8686896668);
            throw 'principal does not exist';
        } catch (e) {
            expect(e.message).equals('Principal does not exist');
        }
    });

    it('should return an object having the new upfated status of the principal if they exist', async () => {
        expect(updatePrincipalAuth(1, principal_id)).to.be.instanceOf(Object).and.eventually.have.nested.property('dataset_id').that.equals(tempPrincipalId);
    });

    // delete principal
    it('should return an error if the principal does not exist', async () => {
        try {
            await deletePrincipalAuth(principal_id + 868689666813144);
            throw 'principal requested does not exist';
        } catch (e) {
            expect(e.message).to.equal('Principal does not exist');
        }
    });

    it('should return an error if the request header has no token or it is malformed', async () => {
        try {
            await deletePrincipal(principal_id, 'asdasdasdasdsa');
            throw 'principal requested does not exist';
        } catch (e) {
            expect(e.message).equals('Invalid JWT token');
        }
    });

    it('should return a message type of string sayng that the principal is gone if they exist', async () => {
        expect(deletePrincipalAuth(principal_id)).to.be.instanceOf(Object).and.eventually.have.property('message', 'Successfully deleted');
    });

    // register
    it('should return a result ok and identity params as an object containing: secret, name, and an id OR a string when it is rejected', async () => {
        identity = await identityRegisterAuth(tmpIdentityName, null, principal_id, null);
        expect(identity).to.be.an('object');
    });

    it('should be rejected if it is a duplicate entry', async () => {
        await expect(identityRegisterAuth(identity.name, null, principal_id)).to.be.rejectedWith(`Duplicate entry ${identity.name}`).and.be.instanceOf(Object).and.eventually.has.nested.property('code').that.equals(1003);
    });

    // register with given password
    it('should return a result ok and identity params as an object containing: password provided by the user, name, and an id', async () => {
        let identitys = await identityRegisterAuth(tmpIdentityName + 1, tmpIdentityPassword, principal_id);
        expect(identitys).to.be.an('object');
    });

    it('should return a string if the name added already exists', async () => {
        try {
            await identityRegisterAuth(identity.name);
            throw 'can not create duplicates';
        } catch (e) {
            expect(e.message).to.exist;
        }
    });

    // login
    it('should return a token as an object type when login', async () => {
        let result = await identityLogin(identity.name, identity.secret, tmpArray);
        token = result.token;
        expect(result).to.be.an('object');
    });

    it('should on login return a string if the credentials were wrong, containing a bad request', async () => {
        await expect(identityLogin(identity.name, identity.secret + 'testing purposes *&^%$', tmpArray)).to.be.rejectedWith('invalid identity name or secret').and.be.instanceOf(Object).and.eventually.has.nested.property('code').that.equals(1001);
    });

    // validation
    it('should return an object when the token is valid with the info related to it', async () => {
        let result = await remoteIdentityValidation(token);
        expect(result).to.be.a('boolean').that.equals(true);
    });

    it('should return a string as an error when the token is not valid', async () => {
        let reject = await remoteIdentityValidation(token + 'testing purposes *&^%$');
        await expect(reject).to.be.a('boolean').that.equals(false);
    });

    // logout
    it('should return a string saying the token has been blacklisted on logout', async () => {
        let logout = await identityLogout(token);
        expect(logout).to.be.a('string');
    });

    // groups tests

    // create group
    it('should return an error on group create, if there is no token present in the header or a token is malformed', async () => {
        try {
            await createGroup(tmpGroupName, 'asdasd');
            throw 'can not create group with malformed or no token';
        } catch (e) {
            expect(e.message).to.be.equal('Invalid JWT token');
        }
    });

    it('should return an object when the group is successfully created', async () => {
        let group = await createGroupAuth(tmpGroupName);
        group_id = group.id;
        expect(group).to.be.instanceOf(Object).and.have.property('id');
    });

    it('should return an error when a duplicate entry occurs', async () => {
        try {
            await createGroupAuth(tmpGroupName);
            throw 'can not craete a duplicate group name';
        } catch (e) {
            expect(e.message).equals(`Duplicate entry ${tmpGroupName}`);
        }
    });

    // read a group
    it('should return an error on group read, if there is no token present in the header or a token is malformed', async () => {
        try {
            await readGroup(tmpGroupName, 'asdasd');
            throw 'can not read group with malformed or no token';
        } catch (e) {
            expect(e.message).to.be.equal('Invalid JWT token');
        }
    });

    it('should return an object when the group is successfully fetched', async () => {
        let group = await readGroupAuth(group_id);
        expect(group).to.be.instanceOf(Object).and.have.property('id');
    });

    it('should return an error when a group id does not exist', async () => {
        try {
            await readGroupAuth('testingPurposes++++++++');
            throw 'this group id does not exist';
        } catch (e) {
            expect(e.message).equals('Group does not exist');
        }
    });

    // group update
    it('should return an error on group update, if there is no token present in the header or a token is malformed', async () => {
        try {
            await updateGroup(group_id, 'the new name', 'asdasd');
            throw 'can not read group with malformed or no token';
        } catch (e) {
            expect(e.message).to.be.equal('Invalid JWT token');
        }
    });

    it('should return an object when the group is successfully updated', async () => {
        let group = await updateGroupAuth(group_id, tmpGroupName);
        expect(group).to.be.instanceOf(Object).and.have.property('id');
    });

    it('should return an error when a group id does not exist on update', async () => {
        try {
            await updateGroupAuth('testingPurposes++++++++', tmpGroupName);
            throw 'this group id does not exist';
        } catch (e) {
            expect(e.message).equals('Permission group does not exist');
        }
    });

    //delete group 
    it('should return an error on group delete, if there is no token present in the header or a token is malformed', async () => {
        try {
            await deleteGroup(group_id, 'asdasd');
            throw 'can not read group with malformed or no token';
        } catch (e) {
            expect(e.message).to.be.equal('Invalid JWT token');
        }
    });

    it('should return an object when the group is successfully deleted', async () => {
        let group = await deleteGroupAuth(group_id);
        expect(group).to.be.instanceOf(Object).and.have.property('message').that.equals('Successfully deleted');
    });

    it('should return an error when a group id does not exist on delete', async () => {
        try {
            await deleteGroupAuth('testingPurposes++++++++', tmpGroupName);
            throw 'this group id does not exist';
        } catch (e) {
            expect(e.message).equals('Group does not exist');
        }
    });

    // services tests

    // create services
    it('should return an error on service create, if there is no token present in the header or a token is malformed', async () => {
        try {
            await createService(tmpServiceName, 'asdasd');
            throw 'can not create group with malformed or no token';
        } catch (e) {
            expect(e.message).to.be.equal('Invalid JWT token');
        }
    });

    it('should return an object when the group is successfully created', async () => {
        let service = await createServiceAuth(tmpServiceName);
        service_id = service.id;
        expect(service).to.be.instanceOf(Object).and.have.property('id');
    });

    it('should return an error when a duplicate entry occurs on service create', async () => {
        try {
            await createServiceAuth(tmpServiceName);
            throw 'can not craete a duplicate service name';
        } catch (e) {
            expect(e.message).equals(`Duplicate entry ${tmpServiceName}`);
        }
    });

    // create services
    it('should return an error on service create, if there is no token present in the header or a token is malformed', async () => {
        try {
            await readService(service_id, 'asdasd');
            throw 'can not create group with malformed or no token';
        } catch (e) {
            expect(e.message).to.be.equal('Invalid JWT token');
        }
    });

    it('should return an object when the group is successfully read', async () => {
        let service = await readServiceAuth(service_id);
        expect(service).to.be.instanceOf(Object).and.have.property('id');
    });

    it('should return an error when a service does not exist read', async () => {
        try {
            await readServiceAuth('some wierd id for testing purposes');
            throw 'can not craete a duplicate service name';
        } catch (e) {
            expect(e.message).equals('Service does not exist');
        }
    });


    // update service
    it('should return an error on service create, if there is no token present in the header or a token is malformed', async () => {
        try {
            await updateService(service_id, tmpServiceName + 'testing purposes++++++++', 'asdasd');
            throw 'can not create group with malformed or no token';
        } catch (e) {
            expect(e.message).to.be.equal('Invalid JWT token');
        }
    });

    it('should return an object when the service is successfully udated', async () => {
        let service = await updateServiceAuth(service_id, tmpServiceName + '123');
        expect(service).to.be.instanceOf(Object).and.have.property('id').to.equal(service_id);
    });

    it('should return an error when a service does not exist on update', async () => {
        try {
            await await updateServiceAuth(service_id + '123123dkfjnkdjb488483', tmpServiceName);
            throw 'service id does not exist';
        } catch (e) {
            expect(e.message).equals('Service does not exist');
        }
    });

    // update service
    it('should return an error on service delete, if there is no token present in the header or a token is malformed', async () => {
        try {
            await deleteService(service_id, 'asdasd');
            throw 'can not delete group with malformed or no token';
        } catch (e) {
            expect(e.message).to.be.equal('Invalid JWT token');
        }
    });

    it('should return an object when the service is successfully delete', async () => {
        let service = await deleteServiceAuth(service_id);
        expect(service).to.be.instanceOf(Object).and.have.property('message').to.equal('Successfully deleted');
    });

    it('should return an object when the service is successfully delete', async () => {
        try {
            await deleteServiceAuth(service_id);
            throw 'principal already deleted';
        } catch (e) {
            expect(e.message).to.exist;
        }
    });

    it('should return an error when a service does not exist on delete', async () => {
        try {
            await await deleteServiceAuth(service_id + '123123dkfjnkdjb488483', tmpServiceName);
            throw 'service id does not exist';
        } catch (e) {
            expect(e.message).equals('Service does not exist');
        }
    });

    // permissions tests
    // register
    it('should return an error if there is no token present in the header or a token is malformed', async () => {
        try {
            await createPermission(tempPermissionName, 'the permission description', service_id, 'asdasd');
            throw 'can not create permissions with malformed or no token';
        } catch (e) {
            expect(e.message).to.be.equal('Invalid JWT token');
        }
    });

    it('should return an object when the permissions is successfully created', async () => {
        let permission = await createPermissionAuth(service_id, tempPermissionName, 'the permission description');
        permission_id = permission.id;
        expect(permission).to.be.instanceOf(Object).and.have.property('subject_id');
    });

    it('should return an error when a duplicate entry occurs', async () => {
        try {
            await createPermissionAuth(service_id, tempPermissionName, 'the permission description');
            throw 'can not craete a duplicate permission name';
        } catch (e) {
            expect(e.message).equals(`Duplicate entry ${tempPermissionName}`);
        }
    });

    // read permissions
    it('should return an error if the permission does not exist', async () => {
        try {
            await readPermissionAuth(permission_id + '1231231231231232');
            throw 'can not retrieve a permissions that does not exist';
        } catch (e) {
            expect(e.message).equals('Permission does not exist');
        }
    });

    it('should return an error if the request does not have a jwt authorization header', async () => {
        try {
            await readPermission(permission_id, 'asddas');
            throw 'can not read permissions with malformed or no token';
        } catch (e) {
            expect(e.message).to.be.equals('Invalid JWT token');
        }
    });

    it('should return an object if the permissions is found', async () => {
        expect(readPermissionAuth(permission_id)).to.be.instanceOf(Object).and.eventually.have.nested.property('dataset_id').that.equals(tempPermissionName);
    });

    //update permissions
    it('should return an error if the header has no auhtorization token or a malformed one', async () => {
        try {
            await updatePermission(1, permission_id, 'asdasd');
            throw 'can not read permissions with malformed or no token';
        } catch (e) {
            expect(e.message).equals('Invalid JWT token');
        }
    });

    it('should return an error if the permissions does not exist', async () => {
        try {
            await updatePermissionAuth(tmpCreatorId, 'whatevre');
            throw 'permissions does not exist';
        } catch (e) {
            expect(e.message).equals('Permission does not exist');
        }
    });

    it('should return an object having the new upfated status of the permissions if they exist', async () => {
        expect(updatePermissionAuth(principal_id)).to.be.instanceOf(Object).and.eventually.have.nested.property('dataset_id').that.equals(principal_id);
    });

    // delete permissions
    it('should return an error if the permissions does not exist', async () => {
        try {
            await deletePermissionAuth(principal_id + 868689666813144);
            throw 'permissions requested does not exist';
        } catch (e) {
            expect(e.message).equals('Permission does not exist');
        }
    });

    it('should return an error if the request header has no token or it is malformed', async () => {
        try {
            await deletePermission(principal_id, 'asdasdasdasdsa');
            throw 'principal requested does not exist';
        } catch (e) {
            expect(e.message).equals('Invalid JWT token');
        }
    });

    it('should return a message type of string sayng that the permissions is gone if they exist', async () => {
        expect(deletePermissionAuth(principal_id)).to.be.instanceOf(Object).and.eventually.have.property('message', 'Successfully deleted');
    });

    // privileges test
    // create privileges
    it('should return an error if no token is present in the request header', async () => {
        try {
            await createPrivilege(permission_id, group_id, 'some scope for testing purposes', 'asdasdasdasda');
            throw 'should not create a permission with no token';
        } catch (e) {
            expect(e.message).to.equal('Invalid JWT token');
        }
    });

    it('should return an object if the request is valid and the privilege is created', async () => {
        let create = await createPrivilegeAuth(permission_id, group_id, 'some scope for testing purposes');
        privilegeId = create.id;
        expect(create).to.be.an.instanceOf(Object).and.have.property('group_id');
    });

    // read privilege 
    it('should return an error if there is not token in the header present', async () => {
        try {
            await readPrivilege(privilegeId, 'asdasd');
            throw 'can\'t create privilege with an invalid token';
        } catch (e) {
            expect(e.message).to.equal('Invalid JWT token');
        }
    });

    it('should return an object if the privilege is fetched correctly', async () => {
        let read = await readPrivilegeAuth(privilegeId);
        expect(read).to.be.an.instanceOf(Object).and.have.property('group_id');
    });

    it('should return an error if the privilege doesn\'t exist', async () => {
        try {
            await await readPrivilegeAuth(privilegeId + 123123);
            throw 'privilege does not exist';
        } catch (e) {
            expect(e.message).to.equal('privilege does not exist');
        }
    });

    // update privilege 
    it('should return an error if the request header has an invalid token', async () => {
        try {
            await updatePrivilege(privilegeId, group_id, permission_id, 'some new scope for testing', 'asdasdsd');
            throw 'can not update identity of an unothorized request';
        } catch (e) {
            expect(e.message).to.equal('Invalid JWT token');
        }
    });

    it('should return an object with the updated data for privileges', async () => {
        let update = await updatePrivilegeAuth(privilegeId, group_id, permission_id, 'some new scope for testing');
        expect(update).to.be.an.instanceOf(Object).and.have.property('group_id');
    });

    // delete privilege
    it('should return an error if the request header has an invalid token', async () => {
        try {
            await deletePrivilege(privilegeId, 'asdasdsd');
            throw 'can not update identity of an unothorized request';
        } catch (e) {
            expect(e.message).to.equal('Invalid JWT token');
        }
    });

    it('should return a success message when the privilege is deleted', async () => {
        let deletePrev = await deletePrivilegeAuth(privilegeId);
        expect(deletePrev.message).to.exist;
    });
});