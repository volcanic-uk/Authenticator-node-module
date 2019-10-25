const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);
let currentTimestampSecond = '111',
    token;
const Identity = require('../../v1/index').Identity,
    Permission = require('../../v1').Permission;
describe('delete a permission', async () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/identity_login.json');
    });
    it('should delete a permission', async () => {
        axiosVCR.mountCassette('./test/cassettes/permissions_delete.json');
        let deletepermission = await new Permission().withAuth().delete(2);
        axiosVCR.ejectCassette('./test/cassettes/permissions_delete.json');
        expect(deletepermission.message).to.exist;
    });
    it('should not delete a permission', async () => {
        axiosVCR.mountCassette('./test/cassettes/fail-permission-delete.json', true);
        try {
            await new Permission().withAuth().delete(`${currentTimestampSecond}`);
        } catch (e) {
            expect(e.errorCode).to.equal(5002);
            expect(e).to.exist;
        }
        axiosVCR.ejectCassette('./test/cassettes/fail-permission-delete.json');
    });
});