const expect = require('chai').expect;
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

    it('should return a string if the name added already exists', async () => {
        try {
            await identityRegisterAuth(identity.name);
        } catch (error) {
            expect(error).to.be.an('object');
        }
    });

    // register with given password
    it('should return a result ok and identity params as an object containing: password provided by the user, name, and an id', async () => {
        identity = await identityRegisterAuth(tmpIdentityName+1, tmpIdentityPassword);
        expect(identity).to.be.an('object');
    });

    it('should return a string if the name added already exists', async () => {
        try {
            await identityRegisterAuth(identity.name, identity.password);
        } catch (error) {
            expect(error).to.be.an('object');
        }
    });

    // login
    it('should return a token as an object type when login', async () => {
        let result = await identityLogin(identity.name, identity.secret);
        token = result.token;
        expect(result).to.be.an('object');
    });

    it('should on login return a string if the credentials were wrong, containing a bad request', async () => {
        try {
            await identityLogin(identity.name, identity.secret + 'testing purposes *&^%$');
        } catch (error) {
            expect(error).to.be.an('object');
        }
    });


    // validation
    it('should return an object when the token is valid with the info related to it', async () => {
        let result = await identityValidation(token);
        expect(result).to.be.an('object');
    });

    it('should return a string as an error when the token is not valid', async () => {
        try {
            await identityValidation(token + 'testing purposes *&^%$');
        } catch (error) {
            expect(error).to.be.an('object');
        }
    });

    // logout
    it('should return a string saying the token has been blacklisted on logout', async () => {
        let logout = await identityLogout(token);
        expect(logout).to.be.a('string');
    });

    it('should return a string when the token is not valid or already been blacklisted', async () => {
        try {
            await identityLogout(token + 'testing purposes *&^%$');
        } catch (error) {
            expect(error).to.be.a('string');
        }
    });

});