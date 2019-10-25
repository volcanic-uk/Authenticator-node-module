const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);

const Identity = require('../../v1/index').Identity;
const Privilege = require('../../v1/index').Privilege;
let tmpIdentityName = 'update-identity',
    identityCreation,
    privilegeCreation,
    token;

describe('Identity Privileges update', () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/identity_login.json');
        axiosVCR.mountCassette('./test/cassettes/identity_create.json');
        identityCreation = await new Identity().withAuth().create(tmpIdentityName, null, 'volcanic');
        axiosVCR.ejectCassette('./test/cassettes/identity_create.json');
        axiosVCR.mountCassette('./test/cassettes/privilege_creation.json');
        privilegeCreation = await new Privilege().withAuth().create('vrn:{stack}:{dataset}:privileges/*', 1, 1, true);
        axiosVCR.ejectCassette('./test/cassettes/privilege_creation.json');
    });
    describe('with auth', async () => {
        it('should update the privileges of the identity', async () => {
            axiosVCR.mountCassette('./test/cassettes/identity_update_privileges.json');
            let updatedIdentityPrivilege = await new Identity().withAuth().updatePrivileges(identityCreation.secure_id, [privilegeCreation.id]); //check identity creation id here
            axiosVCR.ejectCassette('./test/cassettes/identity_update_privileges.json');
            expect(updatedIdentityPrivilege).to.exist;
        });

        it('it should not update privileges of a non existent identity', async () => {
            axiosVCR.mountCassette('./test/cassettes/fail_identity_update.json', true);
            try {
                await new Identity().withAuth().updatePrivileges(identityCreation.secure_id + 12, [privilegeCreation.id]);
            } catch (e) {
                expect(e.errorCode).to.be.equal(1004);
                expect(e).to.exist;
            }
            axiosVCR.ejectCassette('./test/cassettes/fail_identity_update.json');
        });
    });


    // describe('without auth and with setToken', async () => {
    //     it('should update the privileges of identity', async () => {
    //         axiosVCR.mountCassette('./test/cassettes/identity_update_roles_where.json');
    //         let updatedIdentityRole = await new Identity().setToken(token).update(`updated-name-${currentTimestampSecond}-token`, identityCreation.secure_id);
    //         axiosVCR.ejectCassette('./test/cassettes/identity_update_roles_where.json');
    //         expect(updatedIdentityRole).to.exist;
    //     });
    //
    //     it('it should not update the privileges of non existent identity', async () => {
    //         axiosVCR.mountCassette('./test/cassettes/fail_update_identity_role.json', true);
    //         try {
    //             await new Identity().setToken(token).update(`updated-name-${currentTimestampSecond}`, `${currentTimestampSecond}`);
    //         } catch (e) {
    //             expect(e.errorCode).to.be.equal(1004);
    //             expect(e).to.exist;
    //         }
    //         axiosVCR.ejectCassette('./test/cassettes/fail_update_identity_role.json');
    //     });

    // });
});