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
        axiosVCR.mountCassette('./test/cassettes/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/identity_login.json');
    });

    it('should read all services in ascending order', async () => {
        axiosVCR.mountCassette('./test/cassettes/services_read.json');
        let servicesGetAll = await new Service().withAuth().getServices('', '', '', 'id', 'asc');
        axiosVCR.ejectCassette('./test/cassettes/services_read.json');
        expect(servicesGetAll.data).to.be.ascendingBy('id');
    });

    it('should read all services in descending order', async () => {
        axiosVCR.mountCassette('./test/cassettes/services_read.json');
        let servicesGetAll = await new Service().withAuth().getServices('', '', '', 'id', 'desc');
        axiosVCR.ejectCassette('./test/cassettes/services_read.json');
        expect(servicesGetAll.data).to.be.descendingBy('id');
    });

});