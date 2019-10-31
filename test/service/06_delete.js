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
describe('delete a service', async () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/main_ops/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/main_ops/identity_login.json');
    });
    it('should delete a service', async () => {
        axiosVCR.mountCassette('./test/cassettes/services/delete/service_delete.json');
        let deleteService = await new Service().withAuth().delete(2);
        expect(deleteService.message).to.exist;
        axiosVCR.ejectCassette('./test/cassettes/services/delete/service_delete.json');
    });
    it('should not delete a service', async () => {
        try {
            axiosVCR.mountCassette('./test/cassettes/services/delete/service_delete_fail.json', true);
            await new Service().withAuth().delete(`${currentTimestampSecond}`);
            axiosVCR.ejectCassette('./test/cassettes/services/delete/service_delete_fail.json');
        } catch (e) {
            expect(e.errorCode).to.equal(6002);
            expect(e).to.exist;
        }
    });
});