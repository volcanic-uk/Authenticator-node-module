const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
chai.use(chaiAsPromised);
const Identity = require('../v1/index').Identity;
let currentTimestampSecond = Math.floor(Date.now() / 1000);
let tmpIdentityName = `identity-${currentTimestampSecond}`;
let tmpIdentityNameWithSecret = `identity-secret-${currentTimestampSecond}`;
let tmpIdentitySecret = `identity-password-${currentTimestampSecond}`;
let tmpPrincipalID = 1;
require('dotenv').config();
describe('identity tests', () => {
    //register with auth
    it('creating a new identity', async () => {
        let identityRegistration = await new Identity().withAuth().register(tmpIdentityName, null, tmpPrincipalID);
        expect(identityRegistration).to.be.an('object');
    });
    it('creating a new identity with secret', async () => {
        let identityRegistration = await new Identity().withAuth().register(tmpIdentityNameWithSecret, tmpIdentitySecret, tmpPrincipalID);
        expect(identityRegistration).to.be.an('object');
    });
    it('should not create a duplicate identity record', async () => {
        try {
            await new Identity().withAuth().register(tmpIdentityNameWithSecret, tmpIdentitySecret, tmpPrincipalID);
            throw Error('The code should not reach this scope as it would be a duplicate identity record');
        } catch (e) {
            expect(e).to.exist;
        }
    });
    it('creating an identity record without principal_id', async () => {
        try {
            await new Identity().withAuth().register(tmpIdentityNameWithSecret, tmpIdentitySecret, null);
            throw Error('The code should not reach this scope as identity cannot be created without principal id');
        } catch (e) {
            expect(e).to.exist;
        }
    });
    it('creating an identity record without name', async () => {
        try {
            await new Identity().withAuth().register(null, tmpIdentitySecret, null);
            throw Error('The code should not reach this scope as identity cannot be created without identity name');
        } catch (e) {
            expect(e).to.exist;
        }
    });
    // it('should remote validate a token', async () => {
    //     let token = await new Identity().withAuth().remoteValidation();
    //     expect(token).to.equal(true);
    // });
    it('should logout an identity', async () => {
        let logout = await new Identity().withAuth().logout();
        expect(logout).to.equal('logout successfully');
    });
    it('should not logout an already logged out identity', async () => {
        try {
            await new Identity().withAuth().logout();
            throw Error('the code should not reach this scope as identity is already logged out');

        } catch (e) {
            expect(e).to.exist;
        }

    });
});