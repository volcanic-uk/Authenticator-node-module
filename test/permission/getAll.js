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
        axiosVCR.mountCassette('./test/cassettes/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/identity_login.json');
    });
    it('should read all permissions in ascending order', async () => {
        axiosVCR.mountCassette('./test/cassettes/permissions_read.json');
        let permissionsGetAll = await new Permission().withAuth().getPermissions('', '', '', 'id', 'asc');
        axiosVCR.ejectCassette('./test/cassettes/permissions_read.json');
        expect(permissionsGetAll.data).to.be.ascendingBy('id');
    });
    it('should read all permissions in descending order', async () => {
        axiosVCR.mountCassette('./test/cassettes/permissions_read.json');
        let permissionsGetAll = await new Permission().withAuth().getPermissions('', '', '', 'id', 'desc');
        axiosVCR.ejectCassette('./test/cassettes/permissions_read.json');
        expect(permissionsGetAll.data).to.be.descendingBy('id');
    });
});