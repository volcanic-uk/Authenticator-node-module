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
let loginToken;
before(async () => {
    loginToken = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], 1);
    loginToken = loginToken.token;

});
describe('identity login tests', () => {
    it('login identity', async () => {
        let identityLogin = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], 1);
        expect(identityLogin).to.be.an('object');
    });
    it('login identity without principal id', async () => {
        try {
            await new Identity().login('volcanic', 'volcanic!123', ['kratakao']);
        } catch (e) {
            expect(e.errorCode).to.equal(10001);
            expect(e).to.be.exist;
        }
    });
    it('login identity with invalid credentials (name)', async () => {
        try {
            await new Identity().login(`volcanic-invalid ${currentTimestampSecond}`, 'volcanic!123', ['kratakao'], 1);
        } catch (e) {
            expect(e.errorCode).to.equal(1001);
            expect(e).to.be.exist;
        }
    });
    it('login identity with invalid credentials (password)', async () => {
        try {
            await new Identity().login('volcanic', `volcanic${currentTimestampSecond}`, ['kratakao'], 1);
        } catch (e) {
            expect(e.errorCode).to.equal(1001);
            expect(e).to.be.exist;
        }
    });
});
describe('identity create tests', () => {
    describe('with auth', async () => {
        it('creating a new identity', async () => {
            let identityCreation = await new Identity().withAuth().create(tmpIdentityName, null, tmpPrincipalID);
            expect(identityCreation).to.be.an('object');
        });
        it('creating a new identity with secret', async () => {
            let identityCreationWithSecret = await new Identity().withAuth().create(tmpIdentityNameWithSecret, tmpIdentitySecret, tmpPrincipalID);
            expect(identityCreationWithSecret).to.be.an('object');
        });
        it('should not create a duplicate identity record', async () => {
            try {
                await new Identity().withAuth().create(tmpIdentityNameWithSecret, tmpIdentitySecret, tmpPrincipalID);
                throw Error('The code should not reach this scope as it would be a duplicate identity record');
            } catch (e) {
                expect(e.errorCode).to.equal(1003);
                expect(e).to.exist;
            }
        });
        it('creating an identity record without principal_id', async () => {
            try {
                await new Identity().withAuth().create(tmpIdentityNameWithSecret, tmpIdentitySecret, null);
                throw Error('The code should not reach this scope as identity cannot be created without principal id');
            } catch (e) {
                expect(e.errorCode).to.equal(10001);
                expect(e).to.exist;
            }
        });
        it('creating an identity record without name', async () => {
            try {
                await new Identity().withAuth().create(null, tmpIdentitySecret, null);
                throw Error('The code should not reach this scope as identity cannot be created without identity name');
            } catch (e) {
                expect(e.errorCode).to.equal(10001);
                expect(e).to.exist;
            }
        });
        // it('should remote validate a token', async () => {
        //     let token = await new Identity().withAuth().remoteValidation();
        //     expect(token).to.equal(true);
        // });
    });
    describe('without auth and with setToken', async () => {
        it('creating a new identity', async () => {
            let identityCreation = await new Identity().setToken(loginToken).create(tmpIdentityName + '-withtoken', null, 1);
            expect(identityCreation).to.be.an('object');
        });
        it('creating a new identity with secret', async () => {
            let identityCreationWithSecret = await new Identity().setToken(loginToken).create(tmpIdentityNameWithSecret + '-withtoken', tmpIdentitySecret, tmpPrincipalID);
            expect(identityCreationWithSecret).to.be.an('object');
        });
        it('should not create a duplicate identity record', async () => {
            try {
                await new Identity().setToken(loginToken).create(tmpIdentityNameWithSecret, tmpIdentitySecret, tmpPrincipalID);
                throw Error('The code should not reach this scope as it would be a duplicate identity record');
            } catch (e) {
                expect(e.errorCode).to.equal(1003);
                expect(e).to.exist;
            }
        });
        it('creating an identity record without principal_id', async () => {
            try {
                await new Identity().setToken(loginToken).create(tmpIdentityNameWithSecret, tmpIdentitySecret, null);
                throw Error('The code should not reach this scope as identity cannot be created without principal id');
            } catch (e) {
                expect(e.errorCode).to.equal(10001);
                expect(e).to.exist;
            }
        });
        it('creating an identity record without name', async () => {
            try {
                await new Identity().setToken(loginToken).create(null, tmpIdentitySecret, null);
                throw Error('The code should not reach this scope as identity cannot be created without identity name');
            } catch (e) {
                expect(e.errorCode).to.equal(10001);
                expect(e).to.exist;
            }
        });
    });
    //register with auth

});
describe('identity logout tests', async () => {
    describe('with auth', async () => {
        it('should logout an identity', async () => {
            let logout = await new Identity().withAuth().logout();
            expect(logout).to.be.an('object');
        });
        it('should not logout an already logged out identity', async () => {
            try {
                await new Identity().withAuth().logout();
                throw Error('the code should not reach this scope as identity is already logged out');

            } catch (e) {
                expect(e.errorCode).to.equal(3001);
                expect(e).to.exist;
            }

        });
    });
    describe('without auth and with setToken', async () => {
        it('should logout an identity', async () => {
            let logout = await new Identity().setToken(loginToken).logout();
            expect(logout).to.be.an('object');
        });
        it('should not logout an already logged out identity', async () => {
            try {
                await new Identity().setToken(loginToken).logout();
                throw Error('the code should not reach this scope as identity is already logged out');

            } catch (e) {
                expect(e.errorCode).to.equal(3001);
                expect(e).to.exist;
            }

        });
    });
});