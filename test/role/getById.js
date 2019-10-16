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
        axiosVCR.mountCassette('./test/cassettes/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], 1);
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/identity_login.json');
        axiosVCR.mountCassette('./test/cassettes/fail-role-token.json', true);
        let create = await new Role().withAuth().create(tmpRoleName, 2, [1, 2]);
        roleId = create.id;
        axiosVCR.ejectCassette('./test/cassettes/fail-role-token.json');
    });
    it('should return the right role', async () => {
        axiosVCR.mountCassette('./test/cassettes/role-get.json');
        let read = await new Role().withAuth().getById(roleId);
        axiosVCR.ejectCassette('./test/cassettes/role-get.json');
        expect(read).to.be.instanceOf(Object).and.has.property('id');
    });

    it('will fail because the requested id is not available', async () => {
        axiosVCR.mountCassette('./test/cassettes/fail-role-id.json', true);
        try {
            await new Role().withAuth().getById(roleId + 12);
            throw 'it will not pass because the name does not exist';
        } catch (e) {
            expect(e.message).to.exist;
        }
        axiosVCR.ejectCassette('./test/cassettes/fail-role-id.json');
    });
});