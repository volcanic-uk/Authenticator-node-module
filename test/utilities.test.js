const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
chai.use(chaiAsPromised);

const { getFromCache, putToCache } = require('../src/authenticator/v1/cache');
const { decode, customFetch } = require('../src/helpers/index');
const { identity } = require('../src/authenticator/v1/config/index');

const tmpCachekey = 'Key' + Math.floor(Math.random() * 10000);
const tmpCacheValue = 'Volcanic' + Math.floor(Math.random() * 10000);
let token = null;

describe('caching tests', () => {
    it('should pass the test and return the required value when passing valid key and value ', async () => {
        let result = await putToCache(tmpCachekey, tmpCacheValue, 30);
        expect(result).to.equal(tmpCacheValue);
    });

    it('should pass the test and return the value associated with the key', async () => {
        let result = await getFromCache(tmpCachekey);
        expect(result).to.equal(tmpCacheValue);
    });

    it('should pass the test and return the value associated with the key', async () => {
        let result = await getFromCache(tmpCachekey + 1123123);
        expect(result).to.equal(null);
    });

});

describe('custom fetch test', () => {
    it('should return the response if all data provided are valid', async () => {
        let result = await customFetch(identity.login.method, identity.login.path, null, {
            name: 'volcanic',
            secret: 'volcanic!123'
        });
        token = result.response.token;
        expect(result.response.token).to.exist;
    });

    it('shoudl not pass the test, and throw an error when the params are wrong', async () => {
        try {
            await customFetch(identity.login.method, identity.login.path, null, null);
            throw 'should not reach this line because the params provided are wrong';
        } catch (e) {
            expect(e.response).to.exist;
        }
    });
});

describe('decoding test', () => {
    it('should pass and return an object containing token payload info if the token is valid', async () => {
        let decoded = await decode(token);
        expect(decoded.stack).to.exist;
    });

    it('should not pass the test and throw an error if the token is invalid', async () => {
        try {
            await decode('token');
            throw 'should not reach this line as the token is not valid';
        } catch (e) {
            expect(e).to.exist;
        }
    });
});