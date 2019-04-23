const assert = require('chai').assert;
const identityLogin = require('../v1/index').identityLogin;
const identityRegister = require('../v1/index').identityRegister;

require('dotenv').config();

describe('identity', () => {

    let tmpIdentityName = 'Volcanic' + Math.floor(Math.random() * 10000);
    let identity = null;
    it('should return a result ok and identity params as an object containing: secret, name, and an id OR a string when it is rejected', async () => {
        identity = await identityRegister(tmpIdentityName, 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTY4NTI2NTYsImlhdCI6MTU1NTk4ODY1NiwiaXNzIjoiVm9sY2FuaWMgYmV0dGVyIHBlb3BsZSB0ZWNobm9sb2d5IiwianRpIjoiN2FiNjczYTAtNjU3NC0xMWU5LWE2OWUtMmQ5NzQ2ODA3OTEzIn0.AACbWLKGWQYTDbqEHrvJCGww6kXh6Tt0nUbhcJybytgOrYrz_qZzWlVsp0Yz9UQr33m9opDpHbawRw-Ef8YLwon7AMNYDTv0wysJWyEiGBXAK_2i-YnAU-eKVXlptsHATCdGX_7uYp0MwYVNW_u0QkozgRcWAVk0s1nFReZXDB8_u2a7');
        assert.typeOf(identity, 'object');
    });

    it('should return a string if the name added already exists', async () => {
        try {
            await identityRegister(identity.name, 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTY4NTI2NTYsImlhdCI6MTU1NTk4ODY1NiwiaXNzIjoiVm9sY2FuaWMgYmV0dGVyIHBlb3BsZSB0ZWNobm9sb2d5IiwianRpIjoiN2FiNjczYTAtNjU3NC0xMWU5LWE2OWUtMmQ5NzQ2ODA3OTEzIn0.AACbWLKGWQYTDbqEHrvJCGww6kXh6Tt0nUbhcJybytgOrYrz_qZzWlVsp0Yz9UQr33m9opDpHbawRw-Ef8YLwon7AMNYDTv0wysJWyEiGBXAK_2i-YnAU-eKVXlptsHATCdGX_7uYp0MwYVNW_u0QkozgRcWAVk0s1nFReZXDB8_u2a7');
        } catch (error) {
            assert.typeOf(error, 'string');
        }
    });

    it('should return a token as a string type', async () => {
        let result = await identityLogin(identity.name, identity.secret);
        assert.typeOf(result, 'string');
    });

    it('should return a string if the credentials were wrong, containing a bad request', async () => {
        try {
            await identityLogin(identity.name, identity.secret + 'testing purposes *&^%$');
        } catch (error) {
            assert.typeOf(error, 'string');
        }
    });

});