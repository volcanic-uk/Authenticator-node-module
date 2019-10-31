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

describe('create service', () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/main_ops/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/main_ops/identity_login.json');
    });
    describe('create service', async () => {
        it('should create a service', async () => {
            axiosVCR.mountCassette('./test/cassettes/services/create/service_create.json');
            await new Service().withAuth().create(`new-service-${currentTimestampSecond}`);
            axiosVCR.ejectCassette('./test/cassettes/services/create/service_create.json');
        });
        it('should not create duplicated service', async () => {
            try {
                axiosVCR.mountCassette('./test/cassettes/services/create/service_create_fail.json', true);
                await new Service().withAuth().create(`new-service-${currentTimestampSecond}`);
                axiosVCR.ejectCassette('./test/cassettes/services/create/service_create_fail.json');
            } catch (e) {
                expect(e.errorCode).to.equal(6001);
                expect(e).to.exist;
            }
        });
        it('should not create service without name', async () => {
            try {
                axiosVCR.mountCassette('./test/cassettes/services/create/service_create_fail_no_name.json', true);
                await new Service().withAuth().create(null);
                axiosVCR.ejectCassette('./test/cassettes/services/create/service_create_fail_no_name.json');
            } catch (e) {
                expect(e.errorCode).to.equal(10001);
                expect(e).to.exist;
            }
        });
    });
});