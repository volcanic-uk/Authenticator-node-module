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

describe('create permission', async () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], 1);
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/identity_login.json');
    });
    it('should create a permission', async () => {
        axiosVCR.mountCassette('./test/cassettes/permission_create.json');
        await new Permission().withAuth().create(`new-permission-${currentTimestampSecond}`, 'this is new permission', 2);
        axiosVCR.ejectCassette('./test/cassettes/permission_create.json');
    });
    it('should not create duplicated permission', async () => {
        axiosVCR.mountCassette('./test/cassettes/fail-permission-create.json', true);
        try {
            await new Permission().withAuth().create(`new-permission-${currentTimestampSecond}`, 'description', 2);
        } catch (e) {
            expect(e.errorCode).to.equal(5003);
            expect(e).to.exist;
        }
        axiosVCR.ejectCassette('./test/cassettes/fail-permission-create.json');
    });
    it('should not create permission without name', async () => {
        axiosVCR.mountCassette('./test/cassettes/fail-permission-create-without-name.json', true);
        try {
            await new Permission().withAuth().create(null);
        } catch (e) {
            expect(e.errorCode).to.equal(10001);
            expect(e).to.exist;
        }
        axiosVCR.ejectCassette('./test/cassettes/fail-permission-create-without-name.json');
    });
});