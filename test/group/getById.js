const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);
let token;
const Identity = require('../../v1/index').Identity,
    Group = require('../../v1').Group;
describe('Group get by id', () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], 1);
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/identity_login.json');
    });
    // read a group by id
    it('should ge the specified group', async () => {
        axiosVCR.mountCassette('./test/cassettes/group-read.json');
        let read = await new Group().withAuth().getById(1);
        axiosVCR.ejectCassette('./test/cassettes/group-read.json');
        expect(read).to.be.instanceOf(Object).and.have.property('id');
    });

    it('fails upon fetching a non existing id', async () => {
        axiosVCR.mountCassette('./test/cassettes/fail-group-read.json', true);
        try {
            await new Group().withAuth().getById(343423);
            throw 'should not read this line because the id is not valid';
        } catch (e) {
            expect(e.message).equals('Group does not exist');
        }
        axiosVCR.ejectCassette('./test/cassettes/fail-group-read.json');
    });

});