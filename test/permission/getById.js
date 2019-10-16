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
describe('should read created permission', async () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], 1);
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/identity_login.json');
    });
    it('should read a permission', async () => {
        axiosVCR.mountCassette('./test/cassettes/permission_read.json');
        let permissionRead = await new Permission().withAuth().getByID(1);
        axiosVCR.ejectCassette('./test/cassettes/permission_read.json');
        expect(permissionRead.id).to.exist;
    });
    it('should not read permission with wrong id', async () => {
        axiosVCR.mountCassette('./test/cassettes/fail-permission-read.json', true);
        try {
            await new Permission().withAuth().getByID(`${currentTimestampSecond}`);

        } catch (e) {
            expect(e.errorCode).to.equal(5002);
            expect(e).to.exist;
        }
        axiosVCR.ejectCassette('./test/cassettes/fail-permission-read.json');

    });
});