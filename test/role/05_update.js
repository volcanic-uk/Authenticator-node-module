const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);
let tmpRoleName = 'role-update-test',
    token,
    roleId;
const Identity = require('../../v1/index').Identity,
    Role = require('../../v1').Roles;
describe('Role update', async () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/main_ops/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/main_ops/identity_login.json');

        axiosVCR.mountCassette('./test/cassettes/main_ops/roles/create_for_update.json');
        let create = await new Role().withAuth().create(tmpRoleName, 2, [1, 2]);
        roleId = create.id;
        axiosVCR.ejectCassette('./test/cassettes/main_ops/roles/create_for_update.json');
    });
    it('updates the requested role', async () => {
        axiosVCR.mountCassette('./test/cassettes/roles/update/role_update.json');
        let update = await new Role().withAuth().update(4, `${tmpRoleName}-t`, 2, [1, 2]);
        expect(update).to.instanceOf(Object).and.has.property('id');
        axiosVCR.ejectCassette('./test/cassettes/roles/update/role_update.json');
    });

    it('fails when getting a non-existing role', async () => {
        axiosVCR.mountCassette('./test/cassettes/roles/update/role_update_fail.json', true);
        try {
            await new Role().withAuth().update(roleId + 12, tmpRoleName + 'update', 2, [1, 2]);
            throw 'should not reach this line, for the id does not exist';
        } catch (e) {
            expect(e.message).to.exist;
        }
        axiosVCR.ejectCassette('./test/cassettes/roles/update/role_update_fail.json');
    });
});