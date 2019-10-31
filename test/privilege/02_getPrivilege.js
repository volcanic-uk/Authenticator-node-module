const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);

const Identity = require('../../v1/index').Identity,
    Privilege = require('../../v1').Privilege;

let token;
describe('get privileges', () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/main_ops/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/main_ops/identity_login.json');
    });
    it('gets the new privilege', async () => {
        axiosVCR.mountCassette('./test/cassettes/privileges/read/privilege_read.json');
        let read = await new Privilege().withAuth().getById(2);
        expect(read).to.be.an.instanceOf(Object).and.have.property('group_id');
        axiosVCR.ejectCassette('./test/cassettes/privileges/read/privilege_read.json');

    });

    it('fails with non existing id', async () => {
        axiosVCR.mountCassette('./test/cassettes/privileges/read/privilege_read_fail.json', true);
        try {
            await new Privilege().withAuth().getById(213423);
            throw 'should not reach this line because privilege does not exist';
        } catch (e) {
            expect(e.message).to.equal('privilege does not exist');
        }
        axiosVCR.ejectCassette('./test/cassettes/privileges/read/privilege_read_fail.json');
    });

});