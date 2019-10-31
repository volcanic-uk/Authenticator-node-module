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
    identityCreation,
    token;

describe('create identity', () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/main_ops/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/main_ops/identity_login.json');
    });
    describe('with auth', async () => {
        it('creating a new identity', async () => {
            axiosVCR.mountCassette('./test/cassettes/identities/create/identity_create.json');
            identityCreation = await new Identity().withAuth().create(tmpIdentityName, null, 'volcanic');
            expect(identityCreation).to.be.an('object');
            axiosVCR.ejectCassette('./test/cassettes/identities/create/identity_create.json');
        });

        it('creating a new identity with secret', async () => {
            axiosVCR.mountCassette('./test/cassettes/identities/create/identity_create_secret.json');
            let identityCreationWithSecret = await new Identity().withAuth().create(tmpIdentityNameWithSecret, tmpIdentitySecret, 'volcanic');
            expect(identityCreationWithSecret).to.be.an('object');
            axiosVCR.ejectCassette('./test/cassettes/identities/create/identity_create_secret.json');
        });

        it('should not create a duplicate identity record', async () => {
            axiosVCR.mountCassette('./test/cassettes/identities/create/identity_create_fail.json', true);
            try {
                await new Identity().withAuth().create(tmpIdentityNameWithSecret, tmpIdentitySecret, 'volcanic');
                throw Error('The code should not reach this scope as it would be a duplicate identity record');
            } catch (e) {
                expect(e.errorCode).to.equal(1003);
                expect(e).to.exist;
            }
            axiosVCR.ejectCassette('./test/cassettes/identities/create/identity_create_fail.json');
        });

        it('creating an identity record without principal_id', async () => {
            axiosVCR.mountCassette('./test/cassettes/identities/create/identity_create_fail_no_principal_id.json', true);
            try {
                await new Identity().withAuth().create(tmpIdentityNameWithSecret, tmpIdentitySecret, null);
                throw Error('The code should not reach this scope as identity cannot be created without principal id');
            } catch (e) {
                expect(e.errorCode).to.equal(10001);
                expect(e).to.exist;
            }
            axiosVCR.ejectCassette('./test/cassettes/identities/create/identity_create_fail_no_principal_id.json');
        });

        it('creating an identity record without name', async () => {
            axiosVCR.mountCassette('./test/cassettes/identities/create/identity_create_fail_no_name.json', true);
            try {
                await new Identity().withAuth().create(null, tmpIdentitySecret, null);
                throw Error('The code should not reach this scope as identity cannot be created without identity name');
            } catch (e) {
                expect(e.errorCode).to.equal(10001);
                expect(e).to.exist;
            }
            axiosVCR.ejectCassette('./test/cassettes/identities/create/identity_create_fail_no_name.json');
        });

    });


    describe('without auth and with setToken', async () => {
        it('creating a new identity', async () => {
            axiosVCR.mountCassette('./test/cassettes/identities/create/identity_create_with_auth.json');
            let identityCreation = await new Identity().setToken(token).create(tmpIdentityName + '-withtoken1', null, 'volcanic');
            expect(identityCreation).to.be.an('object');
            axiosVCR.ejectCassette('./test/cassettes/identities/create/identity_create_with_auth.json');
        });

        it('creating a new identity with secret', async () => {
            axiosVCR.mountCassette('./test/cassettes/identities/create/identity_create_with_secret_auth.json');
            let identityCreationWithSecret = await new Identity().setToken(token).create(tmpIdentityNameWithSecret + '-withtoken1', tmpIdentitySecret, 'volcanic');
            expect(identityCreationWithSecret).to.be.an('object');
            axiosVCR.ejectCassette('./test/cassettes/identities/create/identity_create_with_secret_auth.json');
        });

        it('should not create a duplicate identity record', async () => {
            axiosVCR.mountCassette('./test/cassettes/identities/create/identity_create_with_auth_fail.json', true);
            try {
                await new Identity().setToken(token).create(tmpIdentityNameWithSecret, tmpIdentitySecret, 'volcanic');
                throw Error('The code should not reach this scope as it would be a duplicate identity record');
            } catch (e) {
                expect(e.errorCode).to.equal(1003);
                expect(e).to.exist;
            }
            axiosVCR.ejectCassette('./test/cassettes/identities/create/identity_create_with_auth_fail.json');
        });

        it('creating an identity record without principal_id', async () => {
            axiosVCR.mountCassette('./test/cassettes/identities/create/identity_create_with_auth_no_secret_fail.json', true);
            try {
                await new Identity().setToken(token).create(tmpIdentityNameWithSecret, tmpIdentitySecret, null);
                throw Error('The code should not reach this scope as identity cannot be created without principal id');
            } catch (e) {
                expect(e.errorCode).to.equal(10001);
                expect(e).to.exist;
            }
            axiosVCR.ejectCassette('./test/cassettes/identities/create/identity_create_with_auth_no_secret_fail.json');
        });

        it('creating an identity record without name', async () => {
            axiosVCR.mountCassette('./test/cassettes/identities/create/identity_create_with_auth_no_name.json', true);
            try {
                await new Identity().setToken(token).create(null, tmpIdentitySecret, null);
                throw Error('The code should not reach this scope as identity cannot be created without identity name');
            } catch (e) {
                expect(e.errorCode).to.equal(10001);
                expect(e).to.exist;
            }
            axiosVCR.ejectCassette('./test/cassettes/identities/create/identity_create_with_auth_no_name.json');
        });

    });
});