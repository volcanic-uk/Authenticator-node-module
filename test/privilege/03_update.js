const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);
let token;
const Identity = require('../../v1/index').Identity,
    Privilege = require('../../v1').Privilege;

describe('Update privileges', () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/main_ops/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/main_ops/identity_login.json');
    });
    it('fails updating a non existing ID', async () => {
        axiosVCR.mountCassette('./test/cassettes/privileges/update/privilege_update_fail.json', true);
        try {
            await new Privilege().withAuth().update(342343, 'vrn:{stack}:{dataset}:jobs/*', 1, 1);
            throw 'should not reach this line, because the id doesnt exist';
        } catch (e) {
            expect(e.message).to.exist;
        }
        axiosVCR.ejectCassette('./test/cassettes/privileges/update/privilege_update_fail.json');
    });

    it('updates the specified privilege', async () => {
        axiosVCR.mountCassette('./test/cassettes/privileges/update/privilege_update.json');
        let update = await new Privilege().withAuth().update(4, 'vrn:{stack}:{dataset}:jobs/*', 1, 1);
        expect(update).to.be.an.instanceOf(Object).and.have.property('group_id');
        axiosVCR.ejectCassette('./test/cassettes/privileges/update/privilege_update.json');
    });
});