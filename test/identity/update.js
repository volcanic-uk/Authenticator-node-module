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
    tmpIdentitySecret = 'update-identity-secret',
    identityCreation,
    token;

describe('Identity update', () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/identity_create_update.json');
        await new Identity().withAuth().create(tmpIdentityName + 'update-name', tmpIdentitySecret, 1, [1]);
        axiosVCR.ejectCassette('./test/cassettes/identity_create_update.json');
        axiosVCR.mountCassette('./test/cassettes/identity_login_.json');
        token = await new Identity().login(tmpIdentityName + 'update-name', tmpIdentitySecret, ['kratakao'], 1);
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/identity_login_.json');
        axiosVCR.mountCassette('./test/cassettes/identity_create_update_2.json');
        identityCreation = await new Identity().withAuth().create(tmpIdentityName + 'for-updation', null, 1);
        axiosVCR.ejectCassette('./test/cassettes/identity_create_update_2.json');
    });
    describe('with auth', async () => {
        it('should update an identity', async () => {
            axiosVCR.mountCassette('./test/cassettes/identity_update.json');
            let updatedIdentity = await new Identity().withAuth().update(`updated-name-${currentTimestampSecond}`, identityCreation.id); //check identity creation id here
            axiosVCR.ejectCassette('./test/cassettes/identity_update.json');
            expect(updatedIdentity.name).to.equal(`updated-name-${currentTimestampSecond}`);
        });

        it('it should not update a non existent identity', async () => {
            axiosVCR.mountCassette('./test/cassettes/fail_identity_update.json', true);
            try {
                await new Identity().withAuth().update(`updated-name-${currentTimestampSecond}`, `${currentTimestampSecond}`);
            } catch (e) {
                expect(e.errorCode).to.be.equal(1004);
                expect(e).to.exist;
            }
            axiosVCR.ejectCassette('./test/cassettes/fail_identity_update.json');
        });
    });


    describe('without auth and with setToken', async () => {
        it('should update an identity', async () => {
            axiosVCR.mountCassette('./test/cassettes/identity_update_where.json');
            let updatedIdentity = await new Identity().setToken(token).update(`updated-name-${currentTimestampSecond}-token`, identityCreation.id);
            axiosVCR.ejectCassette('./test/cassettes/identity_update_where.json');
            expect(updatedIdentity.name).to.equal(`updated-name-${currentTimestampSecond}-token`);
        });

        it('it should not update a non existent identity', async () => {
            axiosVCR.mountCassette('./test/cassettes/fail_update_identity.json', true);
            try {
                await new Identity().setToken(token).update(`updated-name-${currentTimestampSecond}`, `${currentTimestampSecond}`);
            } catch (e) {
                expect(e.errorCode).to.be.equal(1004);
                expect(e).to.exist;
            }
            axiosVCR.ejectCassette('./test/cassettes/fail_update_identity.json');
        });

    });
});