const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);

const Identity = require('../../v1/index').Identity;
const Privilege = require('../../v1/index').Privilege;
let tmpIdentityName = 'update-identity-test',
    identityCreation,
    privilegeCreation,
    token;

describe('Identity Privileges update', () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/main_ops/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/main_ops/identity_login.json');

        axiosVCR.mountCassette('./test/cassettes/identities/main_ops/identity/identity_update_test.json');
        identityCreation = await new Identity().withAuth().create(tmpIdentityName, null, 'volcanic');
        axiosVCR.ejectCassette('./test/cassettes/identities/main_ops/identity/identity_update_test.json');

        axiosVCR.mountCassette('./test/cassettes/main_ops/identity/identity_privilege_update.json');
        privilegeCreation = await new Privilege().withAuth().create('vrn:{stack}:{dataset}:jobs/*', 1, 1, true);
        axiosVCR.ejectCassette('./test/cassettes/main_ops/identity/identity_privilege_update.json');
    });
    describe('with auth', async () => {
        it('should update the privileges of the identity', async () => {
            axiosVCR.mountCassette('./test/cassettes/identities/update_privileges/identity_update_privilege.json');
            let updatedIdentityPrivilege = await new Identity().withAuth().updatePrivileges(identityCreation.secure_id, [privilegeCreation.id]); //check identity creation id here
            axiosVCR.ejectCassette('./test/cassettes/identities/update_privileges/identity_update_privilege.json');
            expect(updatedIdentityPrivilege).to.exist;
        });

        it('it should not update privileges of a non existent identity', async () => {
            axiosVCR.mountCassette('./test/cassettes/identities/update_privileges/identity_update_privilege_fail.json', true);
            try {
                await new Identity().withAuth().updatePrivileges(identityCreation.secure_id + 12, [privilegeCreation.id]);
            } catch (e) {
                expect(e.errorCode).to.be.equal(1004);
                expect(e).to.exist;
            }
            axiosVCR.ejectCassette('./test/cassettes/identities/update_privileges/identity_update_privilege_fail.json');
        });
    });

});