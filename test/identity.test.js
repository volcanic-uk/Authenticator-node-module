const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const expect = chai.expect;
chai.use(chaiAsPromised);
const { identityLogin, identityRegisterAuth, identityValidation, identityLogout } = require('../v1/index').identity;
const { createPrincipalAuth, readPrincipalAuth, updatePrincipalAuth, deletePrincipalAuth } = require('../v1/index').principalWithAuth;
const { createNewPrincipal, deletePrincipal, readPrincipal, updatePrincipal } = require('../v1').principal;

require('dotenv').config();

describe('identity', () => {

    let tmpIdentityName = 'Volcanic' + Math.floor(Math.random() * 10000);
    let tmpIdentityPassword = 'Password' + Math.floor(Math.random() * 10000);
    let tempPrincipalName = 'Volcanic' + Math.floor(Math.random() * 10000);
    let tempPrincipalId = Math.floor(Math.random() * 10000);
    let tempIssuer = 'node-module';
    let identity = null;
    let token = null;
    let id = null;

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
        id = principal.id;
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
            await readPrincipal(id, 'asddas');
            throw 'can not read principal with malformed or no token';
        } catch (e) {
            expect(e.message).to.be.equals('Invalid JWT token');
        }
    });

    it('should return an object if the principal is found', async () => {
        expect(readPrincipalAuth(id)).to.be.instanceOf(Object).and.eventually.have.nested.property('dataset_id').that.equals(tempPrincipalId);
    });

    //update principal
    it('should return an error if the header has no auhtorization token or a malformed one', async () => {
        try {
            await updatePrincipal(1, id, 'asdasd');
            throw 'can not read principal with malformed or no token';
        } catch (e) {
            expect(e.message).equals('Invalid JWT token');
        }
    });

    it('should return an error if the principal does not exist', async () => {
        try {
            await updatePrincipalAuth(1, id+8686896668);
            throw 'principal does not exist';
        } catch (e) {
            expect(e.message).equals('Principal does not exist');
        }
    });

    it('should return an object having the new upfated status of the principal if they exist', async () => {
        expect(updatePrincipalAuth(id)).to.be.instanceOf(Object).and.eventually.have.nested.property('dataset_id').that.equals(tempPrincipalId);
    });

    // delete principal
    it('should return an error if the principal does not exist', async () => {
        try {
            await deletePrincipalAuth(id+868689666813144);
            throw 'principal requested does not exist';
        } catch (e) {
            expect(e.message).equals('Principal does not exist');
        }
    });

    it('should return an error if the request header has no token or it is malformed', async () => {
        try {
            await deletePrincipal(id, 'asdasdasdasdsa');
            throw 'principal requested does not exist';
        } catch (e) {
            expect(e.message).equals('Invalid JWT token');
        }
    });

    it('should return a message type of string sayng that the princiap is gone if they exist', async () => {
        expect(deletePrincipalAuth(id)).to.be.instanceOf(Object).and.eventually.have.property('message', 'Successfully deleted');
    });

    // register
    it('should return a result ok and identity params as an object containing: secret, name, and an id OR a string when it is rejected', async () => {
        identity = await identityRegisterAuth(tmpIdentityName, null, id);
        expect(identity).to.be.an('object');
    });

    it('should be rejected if it is a duplicate entry', async () => {
        await expect(identityRegisterAuth(identity.name, null, id)).to.be.rejectedWith(`Duplicate entry ${identity.name}`).and.be.instanceOf(Object).and.eventually.has.nested.property('code').that.equals(1003);
    });

    // register with given password
    it('should return a result ok and identity params as an object containing: password provided by the user, name, and an id', async () => {
        identity = await identityRegisterAuth(tmpIdentityName + 1, tmpIdentityPassword, id);
        expect(identity).to.be.an('object');
    });

    it('should return a string if the name added already exists', async () => {
        await expect(identityRegisterAuth(identity.name)).to.be.rejectedWith(`Duplicate entry ${identity.name}`).and.be.instanceOf(Object).and.eventually.has.nested.property('code').that.equals(1003);
    });

    // login
    it('should return a token as an object type when login', async () => {
        let result = await identityLogin(identity.name, identity.secret, tempIssuer);
        token = result.token;
        expect(result).to.be.an('object');
    });

    it('should on login return a string if the credentials were wrong, containing a bad request', async () => {
        await expect(identityLogin(identity.name, identity.secret + 'testing purposes *&^%$', tempIssuer)).to.be.rejectedWith('invalid identity name or secret').and.be.instanceOf(Object).and.eventually.has.nested.property('code').that.equals(1001);
    });

    // validation
    it('should return an object when the token is valid with the info related to it', async () => {
        let result = await identityValidation(token);
        expect(result).to.be.a('boolean').that.equals(true);
    });

    it('should return a string as an error when the token is not valid', async () => {
        let reject = await identityValidation(token + 'testing purposes *&^%$');
        await expect(reject).to.be.a('boolean').that.equals(false);
    });

    // logout
    it('should return a string saying the token has been blacklisted on logout', async () => {
        let logout = await identityLogout(token);
        expect(logout).to.be.a('string');
    });

    it('should return a string when the token is not valid or already been blacklisted', async () => {
        await expect(identityLogout(token + 'testing purposes *&^%$')).to.be.rejectedWith('Invalid JWT token').and.be.instanceOf(Object).and.eventually.has.nested.property('message').that.equals('Invalid JWT token');
        await expect(identityLogout(token)).to.be.rejectedWith('Token marked as blacklist and can not be used anymore').and.be.instanceOf(Object).and.eventually.has.nested.property('message').that.equals('Token marked as blacklist and can not be used anymore');
    });

});