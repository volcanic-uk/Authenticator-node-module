const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);
let tmpRoleName = 'group-test',
    token;
const Identity = require('../../v1/index').Identity,
    Role = require('../../v1').Roles;
describe('role creates', () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/identity_login.json');
    });
    it('fails on malformed token', async () => {
        axiosVCR.mountCassette('./test/cassettes/fail-role-token.json', true);
        try {
            await new Role().setToken('some token').create(tmpRoleName, 2, [1, 2]);
            throw 'it will not pass because the token is invalid';
        } catch (e) {
            expect(e.message).to.exist;
        }
        axiosVCR.ejectCassette('./test/cassettes/fail-role-token.json');
    });
    it('creates a new role', async () => {
        axiosVCR.mountCassette('./test/cassettes/role-create.json');
        let create = await new Role().withAuth().create(tmpRoleName, 2, [1, 2]);
        axiosVCR.ejectCassette('./test/cassettes/role-create.json');
        expect(create).to.be.instanceOf(Object).and.has.property('id');

    });
    it('fails when privileges are not an array', async () => {
        axiosVCR.mountCassette('./test/cassettes/fail-privilege-array.json', true);
        try {
            await new Role().withAuth().create(tmpRoleName, 2, 1);
            throw 'should not reach this line, privileges are not an array';
        } catch (e) {
            expect(e.message).to.exist;
        }
        axiosVCR.ejectCassette('./test/cassettes/fail-privilege-array.json');

    });
});