const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const expect = chai.expect;
chai.use(chaiAsPromised);
const { identityLogin, identityRegisterAuth, remoteIdentityValidation, identityLogout } = require('../v1/index').identity;
const { createPrincipalAuth, readPrincipalAuth, updatePrincipalAuth, deletePrincipalAuth } = require('../v1/index').principalWithAuth;
const { createNewPrincipal, deletePrincipal, readPrincipal, updatePrincipal } = require('../v1').principal;
const { createPermissionAuth, readPermissionAuth, updatePermissionAuth, deletePermissionAuth } = require('../v1/index').permissions;
const { createPermission, readPermission, updatePermission, deletePermission } = require('../src/authenticator/v1/permissions/index');

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
            await updatePrincipalAuth(1, principal_id+8686896668);
            throw 'principal does not exist';
        } catch (e) {
            expect(e.message).equals('Principal does not exist');
        }
    });

    it('should return an object having the new upfated status of the principal if they exist', async () => {
        expect(updatePrincipalAuth(principal_id)).to.be.instanceOf(Object).and.eventually.have.nested.property('dataset_id').that.equals(tempPrincipalId);
    });

    // delete principal
    it('should return an error if the principal does not exist', async () => {
        try {
            await deletePrincipalAuth(principal_id+868689666813144);
            throw 'principal requested does not exist';
        } catch (e) {
            expect(e.message).equals('Principal does not exist');
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
        identity = await identityRegisterAuth(tmpIdentityName, null, principal_id);
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
        await expect(identityRegisterAuth(identity.name)).to.be.rejectedWith(`Duplicate entry ${identity.name}`).and.be.instanceOf(Object).and.eventually.has.nested.property('code').that.equals(1003);
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

    // permissions tests
    // register
    it('should return an error if there is no token present in the header or a token is malformed', async () => {
        try {
            await createPermission(tmpCreatorId, tempPermissionName, 'asdasd');
            throw 'can not create permissions with malformed or no token';
        } catch (e) {
            expect(e.message).to.be.equal('Invalid JWT token');
        }
    });

    it('should return an object when the permissions is successfully created', async () => {
        let permission = await createPermissionAuth(tempPermissionName, identity.id);
        permission_id = identity.id;
        expect(permission).to.be.instanceOf(Object).and.have.property('creator_id').that.equals(identity.id);
    });

    it('should return an error when a duplicate entry occurs', async () => {
        try {
            await createPermissionAuth(tempPermissionName, identity.id);
            throw 'can not craete a duplicate permission name';
        } catch (e) {
            expect(e.message).equals(`Duplicate entry ${tempPermissionName}`);
        }
    });

    // read permissions
    it('should return an error if the permission does not exist', async () => {
        try {
            await readPermissionAuth(permission_id+'adasdaefb3y4yy');
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
            await deletePermissionAuth(principal_id+868689666813144);
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

});