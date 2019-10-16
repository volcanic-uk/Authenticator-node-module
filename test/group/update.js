const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);

const Identity = require('../../v1/index').Identity,
    Group = require('../../v1').Group;

let tmpGroupName = 'group-test-update',
    token,
    groupID;
describe('group update', () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], 1);
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/identity_login.json');
        axiosVCR.mountCassette('./test/cassettes/group-create.json');
        let create = await new Group().withAuth().create(tmpGroupName, [], 'test group for module');
        groupID = create.id;
        axiosVCR.ejectCassette('./test/cassettes/group-create.json');
    });
    // group update
    it('it updates the specified group info', async () => {
        axiosVCR.mountCassette('./test/cassettes/group-update.json');
        let update = await new Group().withAuth().update(groupID, tmpGroupName + 'updated');
        axiosVCR.ejectCassette('./test/cassettes/group-update.json');
        expect(update).to.be.instanceOf(Object).and.have.property('id');
    });

    it('fails when passing an invalid id', async () => {
        axiosVCR.mountCassette('./test/cassettes/fail-group-read.json', true);
        try {
            await new Group().withAuth().update(groupID + 12, tmpGroupName + 'updated');
            throw 'should not read this line, because the id is not valid';
        } catch (e) {
            expect(e.message).equals('Permission group does not exist');
        }
        axiosVCR.ejectCassette('./test/cassettes/fail-group-read.json');
    });

});