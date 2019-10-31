const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);

const Identity = require('../../v1/index').Identity;
let newIdentity, tmpIdentityName = 'identity-delete-test', newIdentityWithToken, token;
describe('Identity delete', () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/main_ops/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakoa'], '-1');
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/main_ops/identity_login.json');

        axiosVCR.mountCassette('./test/cassettes/main_ops/identity/identity_delete_test.json');
        newIdentity = await new Identity().withAuth().create(tmpIdentityName, null, 'volcanic');
        newIdentityWithToken = await new Identity().withAuth().create(`${tmpIdentityName}-ewewff`, null, 'volcanic');
        axiosVCR.ejectCassette('./test/cassettes/main_ops/identity/identity_delete_test.json');
    });
    describe('with auth', async () => {

        it('should delete identity', async () => {
            axiosVCR.mountCassette('./test/cassettes/identities/delete/identity_delete.json');
            let deactivateIdentity = await new Identity().withAuth().delete(newIdentity.secure_id);
            expect(deactivateIdentity.message).to.equal('Successfully deleted identity');
            axiosVCR.ejectCassette('./test/cassettes/identities/delete/identity_delete.json');
        });

        it('should not delete already deleted identity', async () => {
            axiosVCR.mountCassette('./test/cassettes/identities/delete/identity_delete_fail.json', true);
            try {
                await new Identity().withAuth().delete(newIdentity.id);
                throw Error('The code should not reach this scope as identity already deactivated');
            } catch (e) {
                expect(e.errorCode).to.equal(1004);
            }
            axiosVCR.ejectCassette('./test/cassettes/identities/delete/identity_delete_fail.json');
        });

    });


    describe('without auth and with setToken', async () => {
        it('should deactivate identity', async () => {
            axiosVCR.mountCassette('./test/cassettes/identities/delete/identity_delete_auth.json');
            let deactivateIdentity = await new Identity().setToken(token).delete(newIdentityWithToken.secure_id);
            expect(deactivateIdentity.message).to.equal('Successfully deleted identity');
            axiosVCR.ejectCassette('./test/cassettes/identities/delete/identity_delete_auth.json');
        });

        it('should not deactivate already deleted identity', async () => {
            axiosVCR.mountCassette('./test/cassettes/identities/delete/identity_delete_auth_fail.json', true);
            try {
                await new Identity().setToken(token).delete(newIdentityWithToken.id);
                throw Error('The code should not reach this scope as identity already deactivated');
            } catch (e) {
                expect(e.errorCode).to.equal(1004);
            }
            axiosVCR.ejectCassette('./test/cassettes/identities/delete/identity_delete_auth_fail.json');
        });

    });
});