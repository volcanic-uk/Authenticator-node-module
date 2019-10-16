const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);
let token;
const Identity = require('../../v1/index').Identity,
    Role = require('../../v1').Roles;
describe('Get all roles', () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], 1);
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/identity_login.json');
    });
    // get all roles
    it('gets the desired token', async () => {
        axiosVCR.mountCassette('./test/cassettes/role-get-token.json');
        let read = await new Role().withAuth().getRoles(null, 1, 15, 'id', 'asc');
        axiosVCR.ejectCassette('./test/cassettes/role-get-token.json');
        expect(read.data).to.be.an('array');
    });
});