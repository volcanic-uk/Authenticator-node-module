const assert = require('chai').assert;
const identity = require('../index').identityLogin;
require('dotenv').config();

describe('identity', () => {
    it('identity should return a token as a string type', async () => {
        let result = await identity('testt', '123456789');
        assert.typeOf(result, 'string');
    });

    it('identity should return a string if the credentials were wrong, containing a bad request', async () => {
        try {
            await identity('testttkk', '123456789');
        } catch (e) {
            assert.typeOf(e, 'string');
        }
    });

});