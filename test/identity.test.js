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

// test variables 

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


describe('principals tests', () => {
    // principal creation
    it('should fail if principal creation function is called without a valid token and it will throw an error', async () => {
        try {
            await createNewPrincipal(tempPrincipalName, tempPrincipalId, 'asdasd');
            throw 'can not create principal with malformed or no token';
        } catch (e) {
            expect(e.message).to.be.equal('Invalid JWT token');
        }
    });

    it('should be a success when passing valid data, hence it will return an object carrying the created principal data', async () => {
        let principal = await createPrincipalAuth(tempPrincipalName, tempPrincipalId, [1, 2]);
        principal_id = principal.id;
        expect(principal).to.be.instanceOf(Object).and.have.property('dataset_id').that.equals(tempPrincipalId);
    });

    it('should not create a principal and it will throw an error if the name already exist', async () => {
        try {
            await createPrincipalAuth(tempPrincipalName, tempPrincipalId, [1, 2]);
            throw 'should not reach this line, as the name is duplicated';
        } catch (e) {
            expect(e.message).equals(`Duplicate entry ${tempPrincipalName}`);
        }
    });

    // reading principal
    it('should not proceed if the principal does not exist upon read request, and it will throw an error', async () => {
        try {
            await readPrincipalAuth(tempPrincipalId);
            throw 'can not retrieve a principal that does not exist';
        } catch (e) {
            expect(e.message).equals('Principal does not exist');
        }
    });

    it('should fail when requesting a read request when there is no token in the request header, and it will throw an error', async () => {
        try {
            await readPrincipal(principal_id, 'asddas');
            throw 'should not reach this line, because the read request has no token, or it is malformed';
        } catch (e) {
            expect(e.message).to.be.equals('Invalid JWT token');
        }
    });

    it('should return an object if the principal is found successfully whlile passing valid data', async () => {
        expect(readPrincipalAuth(principal_id)).to.be.instanceOf(Object).and.eventually.have.nested.property('dataset_id').that.equals(tempPrincipalId);
    });

    //update principal
    it('upon principal update, the request should not be completed if there is no authorization token in the request header, and it will throw an error', async () => {
        try {
            await updatePrincipal(tempPrincipalName, principal_id, null, 'asdasd');
            throw 'should not read this line because the update request has no token, or it is malformed';
        } catch (e) {
            expect(e.message).to.exist;
        }
    });

    it('should not update a principal that does not exist hence an error is thrown', async () => {
        try {
            await updatePrincipalAuth(tempPrincipalName, 123123, null);
            throw 'should not reach this line because the principal requested does not exist';
        } catch (e) {
            expect(e.message).to.exist;
        }
    });

    it('should be a success when the principal is updated, thus it will return an object carrying the new attributes for the principal', async () => {
        expect(updatePrincipalAuth(tempPrincipalName, principal_id)).to.be.instanceOf(Object).and.eventually.have.nested.property('dataset_id').that.equals(tempPrincipalId);
    });

    // delete principal

    it('should not pass upon deleting because the header does not have a valid authorization token, and it will throw an error', async () => {
        try {
            await deletePrincipal(principal_id, 'asdasdasdasdsa');
            throw 'should not reach this line, because the token is not valid';
        } catch (e) {
            expect(e.message).equals('Invalid JWT token');
        }
    });

    it('should return a success message upon valid request of deleting the principal via ID', async () => {
        expect(deletePrincipalAuth(principal_id)).to.be.instanceOf(Object).and.eventually.have.property('message', 'Successfully deleted');
    });
});

/* identities tests goes here */

describe('identities tests', () => {
    // register
    it('should return a result ok upon identity registration, hence it will return an object carrying the identity info', async () => {
        identity = await identityRegisterAuth(tmpIdentityName, null, principal_id, [1]);
        expect(identity).to.be.an('object');
    });

    it('should fail and it will throw an error if the request sent carries a duplicate name for the identity', async () => {
        await expect(identityRegisterAuth(identity.name, null, principal_id)).to.be.rejectedWith(`Duplicate entry ${identity.name}`).and.be.instanceOf(Object).and.eventually.has.nested.property('code').that.equals(1003);
    });

    it('should not pass and it will throw an error if the identity name provided is too short upon identity registration request', async () => {
        try {
            await identityRegisterAuth('V' + 1, tmpIdentityPassword, principal_id);
            throw 'it should not reach this line, because the name provided is too short';
        } catch (e){
            expect(e.message).to.exist;
        }
    });

    // register with given password
    it('should return a result ok and identity params as an object containing identity params along with the password provided by the user', async () => {
        let identitys = await identityRegisterAuth(tmpIdentityName + 1, tmpIdentityPassword, principal_id);
        expect(identitys).to.be.an('object');
    });

    // it('should not pass if the password provided is too long', async () => {
    //     try {
    //         await identityRegisterAuth(tmpIdentityName + 123, 'mksdfkjbsdgkbdsgkbsdgkbsfgksbfgksbfgbsfgnkrgrksfgksgsaskdjbaskbasifbdafkbdsgkbsfgbsfjgsfjhgsfjg', principal_id);
    //         throw 'should not reach this line because the password is not valid';
    //     } catch (e) {
    //         console.log('long pass', e);
    //         expect(e.message).to.exist;
    //     }
    // });

    it('should not pass and it will throw an error upon identity registration if the identity already exists', async () => {
        try {
            await identityRegisterAuth(identity.name);
            throw 'should not reach this line because the identity provided is already created';
        } catch (e) {
            expect(e.message).to.exist;
        }
    });

    // login
    it('should pass upon succesful login and an authentication token is issued', async () => {
        let result = await identityLogin(identity.name, identity.secret, tmpArray);
        token = result.token;
        expect(result.token).to.exist;
    });

    it('should not pass and it will throw an error upon login with invalid login credentials', async () => {
        await expect(identityLogin(identity.name, identity.secret + 'testing purposes *&^%$', tmpArray)).to.be.rejectedWith('invalid identity name or secret').and.be.instanceOf(Object).and.eventually.has.nested.property('code').that.equals(1001);
    });

    // validation
    it('should pass and return a result true when the token is valid', async () => {
        let result = await remoteIdentityValidation(token);
        expect(result).to.be.a('boolean').that.equals(true);
    });

    it('should not pass and it will throw an error and return a result false because the token is not valid', async () => {
        let reject = await remoteIdentityValidation(token + 'testing purposes *&^%$');
        await expect(reject).to.be.a('boolean').that.equals(false);
    });

    // logout
    it('should black list the token upon logout request if the token is valid, after that the token is no longe usable', async () => {
        let logout = await identityLogout(token);
        expect(logout).to.be.a('string');
    });

    it('should not and it will throw an error pass if the token provied is invalid', async () => {
        try {
            await identityLogout('V');
            throw 'should not reach this line because the token is not valid';
        } catch (e) {
            expect(e.message).to.exist;
        }
    });
});

describe('groups test', () => {

    it('should not pass and it will throw an error if the request sent has no valid token', async () => {
        try {
            await createGroup(tmpGroupName, 'asdasd');
            throw 'should not reach this line because the token is not valid';
        } catch (e) {
            expect(e.message).to.be.equal('Invalid JWT token');
        }
    });

    it('should pass upon successful group creation, and returns an object', async () => {
        let group = await createGroupAuth(tmpGroupName);
        group_id = group.id;
        expect(group).to.be.instanceOf(Object).and.have.property('id');
    });

    it('should not pass and it will throw an error because the group name provided is duplicated', async () => {
        try {
            await createGroupAuth(tmpGroupName);
            throw 'should not reach this line because the group name already exists';
        } catch (e) {
            expect(e.message).equals(`Duplicate entry ${tmpGroupName}`);
        }
    });

    // read a group
    it('should not pass and it will throw an error because the request header has an invalid token', async () => {
        try {
            await readGroup(tmpGroupName, 'asdasd');
            throw 'should not reach this line because the token is not valid';
        } catch (e) {
            expect(e.message).to.be.equal('Invalid JWT token');
        }
    });

    it('should pass and return an object with the passing a valid id for the group', async () => {
        let group = await readGroupAuth(group_id);
        expect(group).to.be.instanceOf(Object).and.have.property('id');
    });

    it('should not pass and it will throw an error when an id provided does not exist', async () => {
        try {
            await readGroupAuth(123123);
            throw 'shoudl not read this line because the id is not valid';
        } catch (e) {
            expect(e.message).equals('Group does not exist');
        }
    });

    // group update
    it('should not pass and it will throw an error because the token provided is not valid', async () => {
        try {
            await updateGroup(group_id, 'the new name', 'asdasd');
            throw 'should not read this line because the token is not valid';
        } catch (e) {
            expect(e.message).to.be.equal('Invalid JWT token');
        }
    });

    it('should pass when the request provided is valid, hence an object will be returned with new info', async () => {
        let group = await updateGroupAuth(group_id, tmpGroupName);
        expect(group).to.be.instanceOf(Object).and.have.property('id');
    });

    it('should not pass and it will throw an error upon an update request with invalid data such as the id', async () => {
        try {
            await updateGroupAuth('894976355', tmpGroupName);
            throw 'should not read this line, because the id is not valid';
        } catch (e) {
            expect(e.message).equals('Permission group does not exist');
        }
    });

    //delete group 
    it('should not pass and it will throw an error if the request header on delete group has an invalid token', async () => {
        try {
            await deleteGroup(group_id, 'asdasd');
            throw 'should not read this line because the token provided is invalid';
        } catch (e) {
            expect(e.message).to.be.equal('Invalid JWT token');
        }
    });

    it('should pass when the request sent has a valid token and a valid id', async () => {
        let group = await deleteGroupAuth(group_id);
        expect(group).to.be.instanceOf(Object).and.have.property('message').that.equals('Successfully deleted');
    });

    it('should pass when the request sent has a valid token and a valid id', async () => {
        try {
            await deleteGroupAuth(group_id);
            throw 'should not read this line because the group is deleted already';
        } catch (e){
            expect(e.message).to.exist;
        }
    });

    it('should not pass and it will throw an error because the group does not exist', async () => {
        try {
            await deleteGroupAuth(1231231, tmpGroupName);
            throw 'should not read this line because the group does not exist';
        } catch (e) {
            expect(e.message).equals('Group does not exist');
        }
    });
});

describe('services tests', () => {
    // create services
    it('should not pass and it will throw an error because the header auth token is malformed', async () => {
        try {
            await createService(tmpServiceName, 'asdasd');
            throw 'sould not reach this line as the token is malformed';
        } catch (e) {
            expect(e.message).to.be.equal('Invalid JWT token');
        }
    });

    it('should pass and return an object carryig the service info', async () => {
        let service = await createServiceAuth(tmpServiceName);
        service_id = service.id;
        expect(service).to.be.instanceOf(Object).and.have.property('id');
    });

    it('should not pass and it will throw an error because the name is duplicated', async () => {
        try {
            await createServiceAuth(tmpServiceName);
            throw 'should not reach this line because the name is duplicated';
        } catch (e) {
            expect(e.message).equals(`Duplicate entry ${tmpServiceName}`);
        }
    });

    // read services
    it('should not pass and it will throw an error this test, because the header auth token is malformed', async () => {
        try {
            await readService(service_id, 'asdasd');
            throw 'should not reach this line because for the token is malformed';
        } catch (e) {
            expect(e.message).to.be.equal('Invalid JWT token');
        }
    });

    it('should pass this test and return an object upon successful read request with valid id', async () => {
        let service = await readServiceAuth(service_id);
        expect(service).to.be.instanceOf(Object).and.have.property('id');
    });

    it('should not pass and it will throw an error this test because the id provided is not valid', async () => {
        try {
            await readServiceAuth(1231231);
            throw 'should not reach this line because the id doesnt exist';
        } catch (e) {
            expect(e.message).equals('Service does not exist');
        }
    });


    // update service
    it('should not pass and it will throw an error this test because the auth token in the header is malformed and not valid', async () => {
        try {
            await updateService(service_id, tmpServiceName, 'asdasd');
            throw 'should not reach this line, because the auth token is corrupted';
        } catch (e) {
            expect(e.message).to.be.equal('Invalid JWT token');
        }
    });

    it('should pass this test and retrieve and object having he new service info upon successful update request', async () => {
        let service = await updateServiceAuth(service_id, tmpServiceName + '123');
        expect(service).to.be.instanceOf(Object).and.have.property('id').to.equal(service_id);
    });

    it('should not pass and it will throw an error this test because the service id provided is invalid', async () => {
        try {
            await await updateServiceAuth(1231231, tmpServiceName);
            throw 'must not reach this line because the id is invalid';
        } catch (e) {
            expect(e.message).equals('Service does not exist');
        }
    });

    // delete service
    it('should not pass and it will throw an error this for the auth token in the header is invalid', async () => {
        try {
            await deleteService(service_id, 'asdasd');
            throw 'should not reach this line, because th auth header token is invalid';
        } catch (e) {
            expect(e.message).to.be.equal('Invalid JWT token');
        }
    });

    it('should pass this test and return an object with the property message upon successful deletion', async () => {
        let service = await deleteServiceAuth(service_id);
        expect(service).to.be.instanceOf(Object).and.have.property('message').to.equal('Successfully deleted');
    });

    it('should not pass this test and it will throw an error as the service id provided has already been deactivated', async () => {
        try {
            await deleteServiceAuth(service_id);
            throw 'should not reach this line because the service is deleted';
        } catch (e) {
            expect(e.message).to.exist;
        }
    });

    it('should not pass this test and it will throw an error because the id provided does not exist in the database', async () => {
        try {
            await await deleteServiceAuth(1233214, tmpServiceName);
            throw 'should not reach this line because the service id is invalid';
        } catch (e) {
            expect(e.message).equals('Service does not exist');
        }
    });
});

describe('permissions tests', () => {

    it('should not pass this test and it will throw an error because the auth header token is invalid, hence this test should fail', async () => {
        try {
            await createPermission(tempPermissionName, 'the permission description', service_id, 'asdasd');
            throw 'must not reach this line as the token provided is corrupted';
        } catch (e) {
            expect(e.message).to.be.equal('Invalid JWT token');
        }
    });

    it('should pass this test and return an object carrying all the info of the new permission created upon successful create request with valid data', async () => {
        let permission = await createPermissionAuth(service_id, tempPermissionName, 'the permission description');
        permission_id = permission.id;
        expect(permission).to.be.instanceOf(Object).and.have.property('subject_id');
    });

    it('should not pass this test, and must fail on duplicated entries', async () => {
        try {
            await createPermissionAuth(service_id, tempPermissionName, 'the permission description');
            throw 'should not reach this line because the permission is duplicated';
        } catch (e) {
            expect(e.message).equals(`Duplicate entry ${tempPermissionName}`);
        }
    });

    // read permissions
    it('should not pass this test and it will throw an error, for the id provided is invalid', async () => {
        try {
            await readPermissionAuth(1231234);
            throw 'can not retrieve a permissions that does not exist';
        } catch (e) {
            expect(e.message).equals('Permission does not exist');
        }
    });

    it('should not pass this test and it will throw an error because the header token provided is not a valid one', async () => {
        try {
            await readPermission(permission_id, 'this is a token');
            throw 'should not reach this line, because your token is malformed';
        } catch (e) {
            expect(e.message).to.be.equals('Invalid JWT token');
        }
    });

    it('it should pass the test and returns an object upon valid permission retreival', async () => {
        expect(readPermissionAuth(permission_id)).to.be.instanceOf(Object).and.eventually.have.nested.property('dataset_id').that.equals(tempPermissionName);
    });

    //update permissions
    it('should not pass this test and it will throw an error upon update request with no valid token', async () => {
        try {
            await updatePermission(1, permission_id, 'asdasd');
            throw 'should not reach this line because the tokenis malformed';
        } catch (e) {
            expect(e.message).equals('Invalid JWT token');
        }
    });

    it('should fail this test because the id provided is not valid', async () => {
        try {
            await updatePermissionAuth(tmpCreatorId, 'whatevre');
            throw 'must not reach this line because the id doesnt exist';
        } catch (e) {
            expect(e.message).equals('Permission does not exist');
        }
    });

    it('should pass this test and return an object with the updated info upon successul permission update request', async () => {
        expect(updatePermissionAuth(principal_id)).to.be.instanceOf(Object).and.eventually.have.nested.property('dataset_id').that.equals(principal_id);
    });

    // delete permissions
    it('should not pass this test and throw an error when the id is invalid upon delete request', async () => {
        try {
            await deletePermissionAuth(1231234);
            throw 'must not reach this line because the id does not exist';
        } catch (e) {
            expect(e.message).equals('Permission does not exist');
        }
    });

    it('should not pass this fail and it will also throw an error because the header auth token is malformed', async () => {
        try {
            await deletePermission(principal_id, 'asdasdasdasdsa');
            throw 'should not reach this line, for the token is invalid';
        } catch (e) {
            expect(e.message).equals('Invalid JWT token');
        }
    });

    it('shuuld pass this test, and return a message saying that the permission has been deleted', async () => {
        expect(deletePermissionAuth(principal_id)).to.be.instanceOf(Object).and.eventually.have.property('message', 'Successfully deleted');
    });
});

describe('privileges tests', () => {

    // create privileges
    it('should not pass this test and it will throw an error because the auth header token is invalid', async () => {
        try {
            await createPrivilege(permission_id, group_id, 'some scope for testing purposes', 'asdasdasdasda');
            throw 'must not reach this line because the token is invalid';
        } catch (e) {
            expect(e.message).to.equal('Invalid JWT token');
        }
    });

    it('should pass this test and return an object having the data for the new privilege created', async () => {
        let create = await createPrivilegeAuth(permission_id, group_id, 'some scope for testing purposes');
        privilegeId = create.id;
        expect(create).to.be.an.instanceOf(Object).and.have.property('group_id');
    });

    // read privilege 
    it('should fail this test and it will throw an error because the auth token in the header is invalid', async () => {
        try {
            await readPrivilege(privilegeId, 'this is a token');
            throw 'must not reach this line because the token is invalid';
        } catch (e) {
            expect(e.message).to.equal('Invalid JWT token');
        }
    });

    it('should pass this test and it will return an object carrying all the data from the fetched privilege', async () => {
        let read = await readPrivilegeAuth(privilegeId);
        expect(read).to.be.an.instanceOf(Object).and.have.property('group_id');
    });

    it('should not pass this test and it will throw an error because the id provided is invalid', async () => {
        try {
            await await readPrivilegeAuth(privilegeId + 123123);
            throw 'should not reach this line because privilege does not exist';
        } catch (e) {
            expect(e.message).to.equal('privilege does not exist');
        }
    });

    // update privilege 
    it('should not pass and it will throw an error because the header auth token is not valid', async () => {
        try {
            await updatePrivilege(privilegeId, group_id, permission_id, 'some new scope for testing', 'asdasdsd');
            throw 'should not reach this line, because the token is malformed';
        } catch (e) {
            expect(e.message).to.equal('Invalid JWT token');
        }
    });

    it('should not pass this test becuase the provied id is invalid', async () => {
        try {
            await updatePrivilegeAuth(privilegeId+123123123, group_id, permission_id, 'some new scope for testing');
            throw 'should not reach this line, because the id doesnt exist';
        } catch (e) {
            expect(e.message).to.exist;
        }
    });

    it('should pass this test and will return an object upon successful update delete', async () => {
        let update = await updatePrivilegeAuth(privilegeId, group_id, permission_id, 'some new scope for testing');
        expect(update).to.be.an.instanceOf(Object).and.have.property('group_id');
    });

    // delete privilege
    it('should not pass this test and it will throw an error because the header auth token is invalid', async () => {
        try {
            await deletePrivilege(privilegeId, 'asdasdsd');
            throw 'must not reach this line, because the token is invalid';
        } catch (e) {
            expect(e.message).to.equal('Invalid JWT token');
        }
    });

    it('should not pass and it will throw an error because the id provided is invalid', async () => {
        try {
            await deletePrivilegeAuth(1231234);
            throw 'must not reach this line, the id is invalid';
        } catch (e) {
            expect(e.message).to.exist;
        }
    });

    it('should pass this test and ill return an object with a message property that says it has been deleted successfully', async () => {
        let deletePrev = await deletePrivilegeAuth(privilegeId);
        expect(deletePrev.message).to.exist;
    });
});