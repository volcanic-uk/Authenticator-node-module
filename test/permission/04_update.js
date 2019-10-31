const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);
let currentTimestampSecond = 111,
    token;
const Identity = require('../../v1/index').Identity,
    Permission = require('../../v1').Permission;
describe('update a permission', async () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/main_ops/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/main_ops/identity_login.json');
    });
    it('should update a permission', async () => {
        axiosVCR.mountCassette('./test/cassettes/permissions/update/update_permission.json');
        let updatepermission = await new Permission().withAuth().update(2, `permission-name-update-without-auth${currentTimestampSecond}`);
        expect(updatepermission.name).to.equal(`permission-name-update-without-auth${currentTimestampSecond}`);
        axiosVCR.ejectCassette('./test/cassettes/permissions/update/update_permission.json');
    });
    it('should not update a non-exist permission', async () => {
        axiosVCR.mountCassette('./test/cassettes/permissions/update/update_permission_fail.json', true);
        try {
            await new Permission().withAuth().update(`${currentTimestampSecond}`, `permission-name-update-without-auth${currentTimestampSecond}`);
        } catch (e) {
            expect(e.errorCode).to.equal(5002);
            expect(e).to.exist;
        }
        axiosVCR.ejectCassette('./test/cassettes/permissions/update/update_permission_fail.json');
    });
});