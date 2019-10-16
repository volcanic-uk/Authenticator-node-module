const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);
let tmpRoleName = 'group-test',
    roleId,
    token;
const Identity = require('../../v1/index').Identity,
    Role = require('../../v1').Roles;
describe('role delete', () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], 1);
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/identity_login.json');
        axiosVCR.mountCassette('./test/cassettes/role-create.json');
        let create = await new Role().withAuth().create(tmpRoleName, 2, [1, 2]);
        roleId = create.id;
        axiosVCR.ejectCassette('./test/cassettes/role-create.json');
    });
    it('deletes the required role', async () => {
        axiosVCR.mountCassette('./test/cassettes/role-delete.json');
        let deleteIt = await new Role().withAuth().delete(roleId);
        axiosVCR.ejectCassette('./test/cassettes/role-delete.json');
        expect(deleteIt.message).to.exist;
    });

    it('fails deleting an already deleted role', async () => {
        axiosVCR.mountCassette('./test/cassettes/fail-role-id-delete.json', true);
        try {
            await new Role().withAuth().delete(roleId);
            throw 'should not reach this line because the id is gone';
        } catch (e) {
            expect(e.message).to.exist;
        }
        axiosVCR.ejectCassette('./test/cassettes/fail-role-id-delete.json');
    });

    it('fails deleting a non existing role', async () => {
        axiosVCR.mountCassette('./test/cassettes/fail-role-id-delete.json', true);
        try {
            await new Role().withAuth().delete(roleId + 123132);
            throw 'should not reach this line because the id is not valid';
        } catch (e) {
            expect(e.message).to.exist;
        }
        axiosVCR.ejectCassette('./test/cassettes/fail-role-id-delete.json');
    });
});