const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);

const Identity = require('../../v1/index').Identity,
    Service = require('../../v1').Service;
let currentTimestampSecond = 111, token;
describe('get service by name', () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/main_ops/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/main_ops/identity_login.json');
    });
    it('should read a service by name', async () => {
        axiosVCR.mountCassette('./test/cassettes/services/read_name/get_service_by_name.json');
        let serviceRead = await new Service().withAuth().getByID('krakatoa');
        expect(serviceRead.id).to.exist;
        axiosVCR.ejectCassette('./test/cassettes/services/read_name/get_service_by_name.json');
    });
    it('should not read service with non existence name', async () => {
        try {
            axiosVCR.mountCassette('./test/cassettes/services/read_name/get_service_by_name_fail.json', true);
            await new Service().withAuth().getByName(`read-${currentTimestampSecond}`);
            axiosVCR.ejectCassette('./test/cassettes/services/read_name/get_service_by_name_fail.json');
        } catch (e) {
            expect(e.errorCode).to.equal(6002);
            expect(e).to.exist;
        }

    });
});