const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);

const Identity = require('../../v1/index').Identity,
    Service = require('../../v1').Service;

let currentTimestampSecond = 111,
    token;
describe('update a service', async () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/identity_login.json');
    });
    it('should update a service', async () => {
        axiosVCR.mountCassette('./test/cassettes/service_update.json');
        let updateService = await new Service().withAuth().update(2, `service-name-update-${currentTimestampSecond}`);
        axiosVCR.ejectCassette('./test/cassettes/service_update.json');
        expect(updateService.name).to.equal(`service-name-update-${currentTimestampSecond}`);
    });
    it('should not update a non-exist service', async () => {
        try {
            axiosVCR.mountCassette('./test/cassettes/fail.json', true);
            await new Service().withAuth().update(`${currentTimestampSecond}`, `service-name-update-${currentTimestampSecond}`);
            axiosVCR.ejectCassette('./test/cassettes/fail.json');
        } catch (e) {
            expect(e.errorCode).to.equal(6002);
            expect(e).to.exist;
        }
    });
});