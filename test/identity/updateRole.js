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
    tmpIdentityName = 'update-identity-name-here',
    identityCreation,
    roleCreation,
    token;

describe('Identity Roles update', () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/identity_login.json');
        axiosVCR.mountCassette('./test/cassettes/identity_create.json');
        identityCreation = await new Identity().withAuth().create(tmpIdentityName, null, 'volcanic');
        axiosVCR.ejectCassette('./test/cassettes/identity_create.json');
        axiosVCR.mountCassette('./test/cassettes/role_creation.json');
        roleCreation = await new Role().withAuth().create('role-name', 1, []);
        axiosVCR.ejectCassette('./test/cassettes/role_creation.json');
    });
    describe('with auth', async () => {
        it('should update the roles of the identity', async () => {

            axiosVCR.mountCassette('./test/cassettes/identity_update_roles.json');
            let updatedIdentityRole = await new Identity().withAuth().updateRoles(identityCreation.secure_id, [roleCreation.id]); //check identity creation id here
            axiosVCR.ejectCassette('./test/cassettes/identity_update_roles.json');
            expect(updatedIdentityRole).to.exist;


        });

        it('it should not update roles a non existent identity', async () => {
            axiosVCR.mountCassette('./test/cassettes/fail_identity_update.json', true);
            try {
                await new Identity().withAuth().updateRoles(`updated-name-${currentTimestampSecond}`, [roleCreation.id]);
            } catch (e) {
                expect(e.errorCode).to.be.equal(1004);
                expect(e).to.exist;
            }
            axiosVCR.ejectCassette('./test/cassettes/fail_identity_update.json');
        });
    });

});