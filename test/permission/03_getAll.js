const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);
let token;
const Identity = require('../../v1/index').Identity,
    Permission = require('../../v1').Permission;
describe('should read all permissions', async () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/main_ops/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/main_ops/identity_login.json');
    });
    it('should read all permissions in ascending order', async () => {
        axiosVCR.mountCassette('./test/cassettes/permissions/read_all/permission_read_all.json');
        let permissionsGetAll = await new Permission().withAuth().getPermissions('', '', '', 'id', 'asc');
        expect(permissionsGetAll.data).to.be.ascendingBy('id');
        axiosVCR.ejectCassette('./test/cassettes/permissions/read_all/permission_read_all.json');
    });
    it('should read all permissions in descending order', async () => {
        axiosVCR.mountCassette('./test/cassettes/permissions/read_all/permission_read_all_fail.json');
        let permissionsGetAll = await new Permission().withAuth().getPermissions('', '', '', 'id', 'desc');
        expect(permissionsGetAll.data).to.be.descendingBy('id');
        axiosVCR.ejectCassette('./test/cassettes/permissions/read_all/permission_read_all_fail.json');
    });
});