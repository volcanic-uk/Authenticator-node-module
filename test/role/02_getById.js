const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);
let token,
    tmpRoleName = 'group-test',
    roleId;
const Identity = require('../../v1/index').Identity,
    Role = require('../../v1').Roles;
describe('get the roles by id', () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/main_ops/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/main_ops/identity_login.json');

        axiosVCR.mountCassette('./test/cassettes/main_ops/roles/create_role_for_read.json', true);
        let create = await new Role().withAuth().create(tmpRoleName, 2, [1, 2]);
        roleId = create.id;
        axiosVCR.ejectCassette('./test/cassettes/main_ops/roles/create_role_for_read.json');
    });
    it('should return the right role', async () => {
        axiosVCR.mountCassette('./test/cassettes/roles/read_id/role_get_by_id.json');
        let read = await new Role().withAuth().getById(roleId);
        expect(read).to.be.instanceOf(Object).and.has.property('id');
        axiosVCR.ejectCassette('./test/cassettes/roles/read_id/role_get_by_id.json');
    });

    it('will fail because the requested id is not available', async () => {
        axiosVCR.mountCassette('./test/cassettes/roles/read_id/role_get_by_id_fail.json', true);
        try {
            await new Role().withAuth().getById(roleId + 12);
            throw 'it will not pass because the name does not exist';
        } catch (e) {
            expect(e.message).to.exist;
        }
        axiosVCR.ejectCassette('./test/cassettes/roles/read_id/role_get_by_id_fail.json');
    });
});