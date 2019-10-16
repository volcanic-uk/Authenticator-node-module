const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);

const Identity = require('../../v1/index').Identity;

let currentTimestampSecond = 111,
    tmpIdentityName = `identity-${currentTimestampSecond}`,
    tmpIdentityNameWithSecret = 'identity-secret',
    tmpIdentitySecret = 'identity-password',
    identityCreation;
describe('create identity', () => {
    let token;
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], 1);
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/identity_login.json');
    });
    describe('with auth', async () => {
        it('creating a new identity', async () => {
            axiosVCR.mountCassette('./test/cassettes/identity_create.json');
            identityCreation = await new Identity().withAuth().create(tmpIdentityName, null, 1);
            axiosVCR.ejectCassette('./test/cassettes/identity_create.json');
            expect(identityCreation).to.be.an('object');
        });

        it('creating a new identity with secret', async () => {
            axiosVCR.mountCassette('./test/cassettes/identity_create_secret.json');
            let identityCreationWithSecret = await new Identity().withAuth().create(tmpIdentityNameWithSecret, tmpIdentitySecret, 1);
            axiosVCR.ejectCassette('./test/cassettes/identity_create_secret.json');
            expect(identityCreationWithSecret).to.be.an('object');
        });

        it('should not create a duplicate identity record', async () => {
            axiosVCR.mountCassette('./test/cassettes/fail_duplicate_identity.json', true);
            try {
                await new Identity().withAuth().create(tmpIdentityNameWithSecret, tmpIdentitySecret, 1);
                throw Error('The code should not reach this scope as it would be a duplicate identity record');
            } catch (e) {
                expect(e.errorCode).to.equal(1003);
                expect(e).to.exist;
            }
            axiosVCR.ejectCassette('./test/cassettes/fail_duplicate_identity.json');
        });

        it('creating an identity record without principal_id', async () => {
            axiosVCR.mountCassette('./test/cassettes/fail_without_principal_id.json', true);
            try {
                await new Identity().withAuth().create(tmpIdentityNameWithSecret, tmpIdentitySecret, null);
                throw Error('The code should not reach this scope as identity cannot be created without principal id');
            } catch (e) {
                expect(e.errorCode).to.equal(10001);
                expect(e).to.exist;
            }
            axiosVCR.ejectCassette('./test/cassettes/fail_without_principal_id.json');
        });

        it('creating an identity record without name', async () => {
            axiosVCR.mountCassette('./test/cassettes/fail_without_name_identity.json', true);
            try {
                await new Identity().withAuth().create(null, tmpIdentitySecret, null);
                throw Error('The code should not reach this scope as identity cannot be created without identity name');
            } catch (e) {
                expect(e.errorCode).to.equal(10001);
                expect(e).to.exist;
            }
            axiosVCR.ejectCassette('./test/cassettes/fail_without_name_identity.json');
        });

        // it('should remote validate a token', async () => {
        //     let token = await new Identity().withAuth().remoteValidation();
        //     expect(token).to.equal(true);
        // });
    });


    describe('without auth and with setToken', async () => {
        it('creating a new identity', async () => {
            axiosVCR.mountCassette('./test/cassettes/identity_create_without_auth.json');
            let identityCreation = await new Identity().setToken(token).create(tmpIdentityName + '-withtoken1', null, 1);
            axiosVCR.ejectCassette('./test/cassettes/identity_create_without_auth.json');
            expect(identityCreation).to.be.an('object');
        });

        it('creating a new identity with secret', async () => {
            axiosVCR.mountCassette('./test/cassettes/identity_create_secret_without_auth.json');
            let identityCreationWithSecret = await new Identity().setToken(token).create(tmpIdentityNameWithSecret + '-withtoken1', tmpIdentitySecret, 1);
            axiosVCR.ejectCassette('./test/cassettes/identity_create_secret_without_auth.json');
            expect(identityCreationWithSecret).to.be.an('object');
        });

        it('should not create a duplicate identity record', async () => {
            axiosVCR.mountCassette('./test/cassettes/fail_identity_duplicate_.json', true);
            try {
                await new Identity().setToken(token).create(tmpIdentityNameWithSecret, tmpIdentitySecret, 1);
                throw Error('The code should not reach this scope as it would be a duplicate identity record');
            } catch (e) {
                expect(e.errorCode).to.equal(1003);
                expect(e).to.exist;
            }
            axiosVCR.ejectCassette('./test/cassettes/fail_identity_duplicate_.json');
        });

        it('creating an identity record without principal_id', async () => {
            axiosVCR.mountCassette('./test/cassettes/fail_without_principal_no_auth.json', true);
            try {
                await new Identity().setToken(token).create(tmpIdentityNameWithSecret, tmpIdentitySecret, null);
                throw Error('The code should not reach this scope as identity cannot be created without principal id');
            } catch (e) {
                expect(e.errorCode).to.equal(10001);
                expect(e).to.exist;
            }
            axiosVCR.ejectCassette('./test/cassettes/fail_without_principal_no_auth.json');
        });

        it('creating an identity record without name', async () => {
            axiosVCR.mountCassette('./test/cassettes/fail_identity_record_without_name.json', true);
            try {
                await new Identity().setToken(token).create(null, tmpIdentitySecret, null);
                throw Error('The code should not reach this scope as identity cannot be created without identity name');
            } catch (e) {
                expect(e.errorCode).to.equal(10001);
                expect(e).to.exist;
            }
            axiosVCR.ejectCassette('./test/cassettes/fail_identity_record_without_name.json');
        });

    });
});