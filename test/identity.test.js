const assert = require('chai').assert;
const { identityLogin, identityRegisterAuth, identityValidation, identityLogout } = require('../v1/index');

require('dotenv').config();

describe('identity', () => {

    let tmpIdentityName = 'Volcanic' + Math.floor(Math.random() * 10000);
    let identity = null;
    let token = null;

    // register
    it('should return a result ok and identity params as an object containing: secret, name, and an id OR a string when it is rejected', async () => {
        identity = await identityRegisterAuth(tmpIdentityName);
        assert.typeOf(identity, 'object');
    });

    it('should return a string if the name added already exists', async () => {
        try {
            await identityRegisterAuth(identity.name);
        } catch (error) {
            assert.typeOf(error, 'string');
        }
    });

    // login
    it('should return a token as an object type when login', async () => {
        let result = await identityLogin(identity.name, identity.secret);
        token = result.token;
        assert.typeOf(result, 'object');
    });

    it('should on login return a string if the credentials were wrong, containing a bad request', async () => {
        try {
            await identityLogin(identity.name, identity.secret + 'testing purposes *&^%$');
        } catch (error) {
            assert.typeOf(error, 'string');
        }
    });


    // validation
    it('should return an object when the token is valid with the info related to it', async () => {
        let result = await identityValidation(token);
        assert.typeOf(result, 'object');
    });

    it('should return a string as an error when the token is not valid', async () => {
        try {
            await identityValidation(token + 'testing purposes *&^%$');
        } catch (error) {
            assert.typeOf(error, 'string');
        }
    });

    // logout
    it('should return a string saying the token has been blacklisted on logout', async () => {
        let logout = await identityLogout(token);
        assert.typeOf(logout, 'string');
    });

    it('should return a string when the token is not valid or already been blacklisted', async () => {
        try {
            await identityLogout(token + 'testing purposes *&^%$');
        } catch (error) {
            assert.typeOf(error, 'string');
        }
    });

});