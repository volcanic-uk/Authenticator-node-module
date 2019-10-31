const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);

const Identity = require('../../v1/index').Identity;
let newIdentity, tmpIdentityName = 'identity-deactivate-test', newIdentityWithToken, token;
describe('Identity deactivate', () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/main_ops/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/main_ops/identity_login.json');

        axiosVCR.mountCassette('./test/cassettes/main_ops/identity/identity_deactivate_test.json');
        newIdentity = await new Identity().withAuth().create(tmpIdentityName, null, 'volcanic');
        newIdentityWithToken = await new Identity().withAuth().create(`${tmpIdentityName}-duplicate`, null, 'volcanic');
        axiosVCR.ejectCassette('./test/cassettes/main_ops/identity/identity_deactivate_test.json');
    });
    describe('with auth', async () => {

        it('should deactivate identity', async () => {
            axiosVCR.mountCassette('./test/cassettes/identities/deactivate/identity_deactivate.json');
            let deactivateIdentity = await new Identity().withAuth().deactivateIdentity(newIdentity.secure_id);
            expect(deactivateIdentity.message).to.equal('Successfully deactivated identity');
            axiosVCR.ejectCassette('./test/cassettes/identities/deactivate/identity_deactivate.json');
        });

        it('should not deactivate already deactivated identity', async () => {
            axiosVCR.mountCassette('./test/cassettes/identities/deactivate/identity_deactivate_fail.json', true);
            try {
                await new Identity().withAuth().deactivateIdentity(newIdentity.id);
                throw Error('The code should not reach this scope as identity already deactivated');
            } catch (e) {
                expect(e.errorCode).to.equal(1004);
            }
            axiosVCR.ejectCassette('./test/cassettes/identities/deactivate/identity_deactivate_fail.json');
        });

    });


    describe('without auth and with setToken', async () => {
        it('should deactivate identity', async () => {
            axiosVCR.mountCassette('./test/cassettes/identities/deactivate/identity_deactivate_auth.json');
            let deactivateIdentity = await new Identity().setToken(token).deactivateIdentity(newIdentityWithToken.secure_id);
            expect(deactivateIdentity.message).to.equal('Successfully deactivated identity');
            axiosVCR.ejectCassette('./test/cassettes/identities/deactivate/identity_deactivate_auth.json');
        });

        it('should not deactivate already deactivated identity', async () => {
            axiosVCR.mountCassette('./test/cassettes/identities/deactivate/identity_deactivate_auth_fail.json', true);
            try {
                await new Identity().setToken(token).deactivateIdentity(newIdentityWithToken.id);
                throw Error('The code should not reach this scope as identity already deactivated');
            } catch (e) {
                expect(e.errorCode).to.equal(1004);
            }
            axiosVCR.ejectCassette('./test/cassettes/identities/deactivate/identity_deactivate_auth_fail.json');
        });

    });
});