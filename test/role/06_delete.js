const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);
let tmpRoleName = 'delete-role-test',
    roleId,
    token;
const Identity = require('../../v1/index').Identity,
    Role = require('../../v1').Roles;
describe('role delete', () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/main_ops/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/main_ops/identity_login.json');

        axiosVCR.mountCassette('./test/cassettes/main_ops/roles/create_for_delete.json');
        let create = await new Role().withAuth().create(tmpRoleName, 2, [1, 2]);
        roleId = create.id;
        axiosVCR.ejectCassette('./test/cassettes/main_ops/roles/create_for_delete.json');
    });

    it('deletes the required role', async () => {
        axiosVCR.mountCassette('./test/cassettes/roles/delete/role_delete.json');
        let deleteIt = await new Role().withAuth().delete(roleId);
        expect(deleteIt.message).to.exist;
        axiosVCR.ejectCassette('./test/cassettes/roles/delete/role_delete.json');
    });

    it('fails deleting an already deleted role', async () => {
        axiosVCR.mountCassette('./test/cassettes/roles/delete/role_delete_fail.json', true);
        try {
            await new Role().withAuth().delete(roleId);
            throw 'should not reach this line because the id is gone';
        } catch (e) {
            expect(e.message).to.exist;
        }
        axiosVCR.ejectCassette('./test/cassettes/roles/delete/role_delete_fail.json');
    });

    it('fails deleting a non existing role', async () => {
        axiosVCR.mountCassette('./test/cassettes/roles/delete/role_delete_fail_invalid.json', true);
        try {
            await new Role().withAuth().delete(roleId + 123132);
            throw 'should not reach this line because the id is not valid';
        } catch (e) {
            expect(e.message).to.exist;
        }
        axiosVCR.ejectCassette('./test/cassettes/roles/delete/role_delete_fail_invalid.json');
    });
});