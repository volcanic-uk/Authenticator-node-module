const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);

const Identity = require('../../v1/index').Identity;

let currentTimestampSecond = 111,
    tmpIdentityName = 'update-identity',
    identityCreation,
    token;

describe('Identity update', () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/identities/create/identity_create.json');
        identityCreation = await new Identity().withAuth().create(tmpIdentityName, null, 'volcanic');
        axiosVCR.ejectCassette('./test/cassettes/identities/create/identity_create.json');

        axiosVCR.mountCassette('./test/cassettes/main_ops/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/main_ops/identity_login.json');

        axiosVCR.mountCassette('./test/cassettes/identities/create/identity_create_2.json');
        identityCreation = await new Identity().withAuth().create(tmpIdentityName + 'for-updating', null, 'volcanic');
        axiosVCR.ejectCassette('./test/cassettes/identities/create/identity_create_2.json');
    });
    describe('with auth', async () => {
        it('should update an identity', async () => {
            axiosVCR.mountCassette('./test/cassettes/identities/update/identity_update.json');
            let updatedIdentity = await new Identity().withAuth().update(`updated-name-${currentTimestampSecond}`, identityCreation.secure_id); //check identity creation id here
            axiosVCR.ejectCassette('./test/cassettes/identities/update/identity_update.json');
            expect(updatedIdentity.name).to.equal(`updated-name-${currentTimestampSecond}`);
        });

        it('it should not update a non existent identity', async () => {
            axiosVCR.mountCassette('./test/cassettes/identities/update/identity_update_fail.json', true);
            try {
                await new Identity().withAuth().update(`updated-name-${currentTimestampSecond}`, `${currentTimestampSecond}`);
            } catch (e) {
                expect(e.errorCode).to.be.equal(1004);
                expect(e).to.exist;
            }
            axiosVCR.ejectCassette('./test/cassettes/identities/update/identity_update_fail.json');
        });
    });


    describe('without auth and with setToken', async () => {
        it('should update an identity', async () => {
            axiosVCR.mountCassette('./test/cassettes/identities/update/identity_update_auth.json');
            let updatedIdentity = await new Identity().setToken(token).update(`updated-name-${currentTimestampSecond}-token`, identityCreation.secure_id);
            expect(updatedIdentity.name).to.equal(`updated-name-${currentTimestampSecond}-token`);
            axiosVCR.ejectCassette('./test/cassettes/identities/update/identity_update_auth.json');
        });

        it('it should not update a non existent identity', async () => {
            axiosVCR.mountCassette('./test/cassettes/identities/update/identity_update_auth_fail.json', true);
            try {
                await new Identity().setToken(token).update(`updated-name-${currentTimestampSecond}`, `${currentTimestampSecond}`);
            } catch (e) {
                expect(e.errorCode).to.be.equal(1004);
                expect(e).to.exist;
            }
            axiosVCR.ejectCassette('./test/cassettes/identities/update/identity_update_auth_fail.json');
        });

    });
});