const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);

const Identity = require('../../v1/index').Identity;
let currentTimestampSecond = 111;
describe('Identity login', () => {
    let token;
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], 1);
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/identity_login.json');
    });

    it('login identity', async () => {
        axiosVCR.mountCassette('./test/cassettes/identity_login.json');
        let identityLogin = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], 1);
        axiosVCR.ejectCassette('./test/cassettes/identity_login.json');
        expect(identityLogin).to.be.an('object');
    });

    it('login identity without principal id', async () => {
        axiosVCR.mountCassette('./test/cassettes/fail.json', true);
        try {
            await new Identity().login('volcanic', 'volcanic!123', ['kratakao']);
        } catch (e) {
            expect(e.errorCode).to.equal(10001);
            expect(e).to.be.exist;
        }
        axiosVCR.ejectCassette('./test/cassettes/fail.json');
    });

    it('login identity with invalid credentials (name)', async () => {
        axiosVCR.mountCassette('./test/cassettes/fail.json', true);
        try {
            await new Identity().login(`volcanic-invalid ${currentTimestampSecond}`, 'volcanic!123', ['kratakao'], 1);
        } catch (e) {
            expect(e.errorCode).to.equal(1001);
            expect(e).to.be.exist;
        }
        axiosVCR.ejectCassette('./test/cassettes/fail.json');
    });

    it('login identity with invalid credentials (password)', async () => {
        axiosVCR.mountCassette('./test/cassettes/fail.json', true);
        try {
            await new Identity().login('volcanic', `volcanic${currentTimestampSecond}`, ['kratakao'], 1);
        } catch (e) {
            expect(e.errorCode).to.equal(1001);
            expect(e).to.be.exist;
        }
        axiosVCR.ejectCassette('./test/cassettes/fail.json');
    });
});