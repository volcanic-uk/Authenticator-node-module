const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);

const Identity = require('../../v1/index').Identity;
let newIdentity, tmpIdentityName = 'newIdentity', newIdentityWithToken, token;
describe('Identity deactivate', () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/identity_login.json');
        axiosVCR.mountCassette('./test/cassettes/identity_create_duplicate.json');
        newIdentity = await new Identity().withAuth().create(tmpIdentityName + 'dsdfdff', null, 'volcanic');
        newIdentityWithToken = await new Identity().withAuth().create(`${tmpIdentityName}-ewewff`, null, 'volcanic');
        axiosVCR.ejectCassette('./test/cassettes/identity_create_duplicate.json');
    });
    describe('with auth', async () => {

        it('should deactivate identity', async () => {
            axiosVCR.mountCassette('./test/cassettes/identity_deacitvation.json');
            let deactivateIdentity = await new Identity().withAuth().deactivateIdentity(newIdentity.secure_id);
            axiosVCR.ejectCassette('./test/cassettes/identity_deacitvation.json');
            expect(deactivateIdentity.message).to.equal('Successfully deactivated identity');
        });

        it('should not deactivate already deactivated identity', async () => {
            axiosVCR.mountCassette('./test/cassettes/fail_identity_deactivate.json', true);
            try {
                await new Identity().withAuth().deactivateIdentity(newIdentity.id);
                throw Error('The code should not reach this scope as identity already deactivated');
            } catch (e) {
                expect(e.errorCode).to.equal(1004);
            }
            axiosVCR.ejectCassette('./test/cassettes/fail_identity_deactivate.json');
        });

    });


    describe('without auth and with setToken', async () => {
        it('should deactivate identity', async () => {
            axiosVCR.mountCassette('./test/cassettes/identity_deactivate.json');
            let deactivateIdentity = await new Identity().setToken(token).deactivateIdentity(newIdentityWithToken.secure_id);
            axiosVCR.ejectCassette('./test/cassettes/identity_deactivate.json');
            expect(deactivateIdentity.message).to.equal('Successfully deactivated identity');
        });

        it('should not deactivate already deactivated identity', async () => {
            axiosVCR.mountCassette('./test/cassettes/identity_deactivate_now.json', true);
            try {
                await new Identity().setToken(token).deactivateIdentity(newIdentityWithToken.id);
                throw Error('The code should not reach this scope as identity already deactivated');
            } catch (e) {
                expect(e.errorCode).to.equal(1004);
            }
            axiosVCR.ejectCassette('./test/cassettes/identity_deactivate_now.json');
        });

    });
});