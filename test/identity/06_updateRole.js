const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);

const Identity = require('../../v1/index').Identity;
const Role = require('../../v1/index').Roles;
let currentTimestampSecond = '111',
    identityCreation,
    roleCreation,
    token,
    tmpRoleName = 'identity-update-roles';

describe('Identity Roles update', () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/main_ops/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/main_ops/identity_login.json');

        axiosVCR.mountCassette('./test/cassettes/identities/create/identity_create.json');
        identityCreation = await new Identity().withAuth().create('identity-111', null, 'volcanic');
        axiosVCR.ejectCassette('./test/cassettes/identities/create/identity_create.json');

        axiosVCR.mountCassette('./test/cassettes/main_ops/identity/update_identity_roles_test.json');
        roleCreation = await new Role().withAuth().create(tmpRoleName, 2, [1, 2]);
        axiosVCR.ejectCassette('./test/cassettes/main_ops/identity/update_identity_roles_test.json');
    });
    describe('with auth', async () => {
        it('should update the roles of the identity', async () => {

            axiosVCR.mountCassette('./test/cassettes/identities/roles_update/identity_update_roles.json');
            let updatedIdentityRole = await new Identity().withAuth().updateRoles(identityCreation.secure_id, [roleCreation.id]); //check identity creation id here
            expect(updatedIdentityRole).to.exist;
            axiosVCR.ejectCassette('./test/cassettes/identities/roles_update/identity_update_roles.json');


        });

        it('it should not update roles a non existent identity', async () => {
            axiosVCR.mountCassette('./test/cassettes/identities/roles_update/identity_update_roles_fail.json', true);
            try {
                await new Identity().withAuth().updateRoles(`updated-name-${currentTimestampSecond}`, [roleCreation.id]);
            } catch (e) {
                expect(e.errorCode).to.be.equal(1004);
                expect(e).to.exist;
            }
            axiosVCR.ejectCassette('./test/cassettes/identities/roles_update/identity_update_roles_fail.json');
        });
    });

});