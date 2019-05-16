const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const expect = chai.expect;
chai.use(chaiAsPromised);
const { identityLogin, identityRegisterAuth, identityValidation, identityLogout } = require('../v1/index');

require('dotenv').config();

describe('identity', () => {

    let tmpIdentityName = 'Volcanic' + Math.floor(Math.random() * 10000);
    let tmpIdentityPassword = 'Password' + Math.floor(Math.random() * 10000);
    let identity = null;
    let token = null;

    // register
    it('should return a result ok and identity params as an object containing: secret, name, and an id OR a string when it is rejected', async () => {
        identity = await identityRegisterAuth(tmpIdentityName);
        expect(identity).to.be.an('object');
    });

    it('should be rejected if it is a duplicate entry', async () => {
        await expect(identityRegisterAuth(identity.name)).to.be.rejectedWith(`Duplicate entry ${identity.name}`).and.be.instanceOf(Object).and.eventually.has.nested.property('code').that.equals(1003);
    });

    // register with given password
    it('should return a result ok and identity params as an object containing: password provided by the user, name, and an id', async () => {
        identity = await identityRegisterAuth(tmpIdentityName + 1, tmpIdentityPassword);
        expect(identity).to.be.an('object');
    });

    it('should return a string if the name added already exists', async () => {
        await expect(identityRegisterAuth(identity.name)).to.be.rejectedWith(`Duplicate entry ${identity.name}`).and.be.instanceOf(Object).and.eventually.has.nested.property('code').that.equals(1003);
    });

    // login
    it('should return a token as an object type when login', async () => {
        let result = await identityLogin(identity.name, identity.secret);
        token = result.token;
        expect(result).to.be.an('object');
    });

    it('should on login return a string if the credentials were wrong, containing a bad request', async () => {
        await expect(identityLogin(identity.name, identity.secret + 'testing purposes *&^%$')).to.be.rejectedWith('invalid identity name or secret').and.be.instanceOf(Object).and.eventually.has.nested.property('code').that.equals(1001);
    });

    // validation
    it('should return an object when the token is valid with the info related to it', async () => {
        let result = await identityValidation(token);
        expect(result).to.be.an('object');
    });

    it('should return a string as an error when the token is not valid', async () => {
        await expect(identityValidation(token + 'testing purposes *&^%$')).to.be.rejectedWith('invalid token').and.be.instanceOf(Object).and.eventually.has.nested.property('message').that.equals('invalid token');
    });

    // logout
    it('should return a string saying the token has been blacklisted on logout', async () => {
        let logout = await identityLogout(token);
        expect(logout).to.be.a('string');
    });

    it('should return a string when the token is not valid or already been blacklisted', async () => {
        await expect(identityLogout(token + 'testing purposes *&^%$')).to.be.rejectedWith('invalid token').and.be.instanceOf(Object).and.eventually.has.nested.property('message').that.equals('invalid token');
        await expect(identityLogout(token)).to.be.rejectedWith('Token marked as blacklist and can not be used anymore').and.be.instanceOf(Object).and.eventually.has.nested.property('message').that.equals('Token marked as blacklist and can not be used anymore');
    });

});