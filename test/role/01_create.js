const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);
let tmpRoleName = 'role-test',
    token;
const Identity = require('../../v1/index').Identity,
    Role = require('../../v1').Roles;
describe('role creates', () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/main_ops/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/main_ops/identity_login.json');
    });
    it('fails on malformed token', async () => {
        axiosVCR.mountCassette('./test/cassettes/roles/create/role_create_fail.json', true);
        try {
            await new Role().setToken('some token').create(tmpRoleName, 2, [1, 2]);
            throw 'it will not pass because the token is invalid';
        } catch (e) {
            expect(e.message).to.exist;
        }
        axiosVCR.ejectCassette('./test/cassettes/roles/create/role_create_fail.json');
    });
    it('creates a new role', async () => {
        axiosVCR.mountCassette('./test/cassettes/roles/create/role_create.json');
        let create = await new Role().withAuth().create(tmpRoleName, 2, [1, 2]);
        expect(create).to.be.instanceOf(Object).and.has.property('id');
        axiosVCR.ejectCassette('./test/cassettes/roles/create/role_create.json');

    });
    it('fails when privileges are not an array', async () => {
        axiosVCR.mountCassette('./test/cassettes/roles/create/role_create_fail_non_array.json', true);
        try {
            await new Role().withAuth().create(tmpRoleName, 2, 1);
            throw 'should not reach this line, privileges are not an array';
        } catch (e) {
            expect(e.message).to.exist;
        }
        axiosVCR.ejectCassette('./test/cassettes/roles/create/role_create_fail_non_array.json');

    });
});