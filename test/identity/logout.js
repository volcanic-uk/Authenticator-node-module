const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);
let token;
const Identity = require('../../v1/index').Identity;
before(async () => {
    axiosVCR.mountCassette('./test/cassettes/identity_login.json');
    token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
    token = token.token;
    axiosVCR.ejectCassette('./test/cassettes/identity_login.json');
});
describe('logout the identity', () => {
    describe('with auth', async () => {
        it('should logout an identity', async () => {
            axiosVCR.mountCassette('./test/cassettes/identity_logout.json');
            let logout = await new Identity().withAuth().logout();
            axiosVCR.ejectCassette('./test/cassettes/identity_logout.json');
            expect(logout).to.be.an('object');
        });
    });


    describe('without auth and with setToken', async () => {
        before(async () => {
            axiosVCR.mountCassette('./test/cassettes/identity_login.json');
            token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
            token = token.token;
            axiosVCR.ejectCassette('./test/cassettes/identity_login.json');
        });
        it('should logout an identity', async () => {
            axiosVCR.mountCassette('./test/cassettes/identity_logout.json');
            let logout = await new Identity().setToken(token).logout();
            axiosVCR.ejectCassette('./test/cassettes/identity_logout.json');
            expect(logout).to.be.an('object');
        });

        it('should not logout an already logged out identity', async () => {
            axiosVCR.mountCassette('./test/cassettes/fail_here_logout.json', true);
            try {
                await new Identity().setToken(token).logout();
                throw Error('the code should not reach this scope as identity is already logged out');

            } catch (e) {
                expect(e.errorCode).to.equal(3001);
                expect(e).to.exist;
            }
            axiosVCR.ejectCassette('./test/cassettes/fail_here_logout.json');
        });

    });
});