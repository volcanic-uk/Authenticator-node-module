const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);
let token;
const Identity = require('../../v1/index').Identity,
    Service = require('../../v1').Service;
describe('should read all services', async () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/main_ops/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/main_ops/identity_login.json');
    });

    it('should read all services in ascending order', async () => {
        axiosVCR.mountCassette('./test/cassettes/services/read_all/get_all_services.json');
        let servicesGetAll = await new Service().withAuth().getServices('', '', '', 'id', 'asc');
        expect(servicesGetAll.data).to.be.ascendingBy('id');
        axiosVCR.ejectCassette('./test/cassettes/services/read_all/get_all_services.json');
    });

    it('should read all services in descending order', async () => {
        axiosVCR.mountCassette('./test/cassettes/services/read_all/get_all_services_fail.json');
        let servicesGetAll = await new Service().withAuth().getServices('', '', '', 'id', 'desc');
        expect(servicesGetAll.data).to.be.descendingBy('id');
        axiosVCR.ejectCassette('./test/cassettes/services/read_all/get_all_services_fail.json');
    });

});