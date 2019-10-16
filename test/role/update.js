const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);
let tmpRoleName = 'group-test',
    token,
    roleId;
const Identity = require('../../v1/index').Identity,
    Role = require('../../v1').Roles;
describe('Role update', async () => {
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
    it('updates the requested role', async () => {
        axiosVCR.mountCassette('./test/cassettes/role-update.json');
        let update = await new Role().withAuth().update(4, `${tmpRoleName}-t`, 2, [1, 2]);
        axiosVCR.ejectCassette('./test/cassettes/role-update.json');
        expect(update).to.instanceOf(Object).and.has.property('id');
    });

    it('fails when getting a non-existing role', async () => {
        axiosVCR.mountCassette('./test/cassettes/fail-role-id-update.json', true);
        try {
            await new Role().withAuth().update(roleId + 12, tmpRoleName + 'update', 2, [1, 2]);
            throw 'should not reach this line, for the id does not exist';
        } catch (e) {
            expect(e.message).to.exist;
        }
        axiosVCR.ejectCassette('./test/cassettes/fail-role-id-update.json');
    });
});