const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);
let token,
    tmpRoleName = 'group-test';
const Identity = require('../../v1/index').Identity,
    Role = require('../../v1').Roles;
describe('role get by name', () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/main_ops/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/main_ops/identity_login.json');
    });
    it('gets the right role by its name', async () => {
        axiosVCR.mountCassette('./test/cassettes/roles/read_name/get_role_by_name.json');
        let read = await new Role().withAuth().getByName(tmpRoleName);
        expect(read).to.be.instanceOf(Object).and.has.property('id');
        axiosVCR.ejectCassette('./test/cassettes/roles/read_name/get_role_by_name.json');
    });
    it('returns error if name doesnt exist', async () => {
        axiosVCR.mountCassette('./test/cassettes/roles/read_name/get_role_by_name_fail.json', true);
        try {
            await new Role().withAuth().getByName('no-proper-name');
            throw 'should not return a role as name doesnt exist';
        } catch (e) {
            expect(e.message).to.exist;
        }
        axiosVCR.ejectCassette('./test/cassettes/roles/read_name/get_role_by_name_fail.json');
    });
});