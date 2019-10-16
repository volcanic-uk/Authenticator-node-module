const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);
let tmpGroupName = 'group-test-deletion',
    groupID, token;
const Identity = require('../../v1/index').Identity,
    Group = require('../../v1').Group;
describe('group delete', () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], 1);
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/identity_login.json');
        axiosVCR.mountCassette('./test/cassettes/group-create-func.json');
        let create = await new Group().withAuth().create(tmpGroupName, [], 'test group for module');
        groupID = create.id;
        axiosVCR.ejectCassette('./test/cassettes/group-create-func.json');
    });
    it('deletes the specified id', async () => {
        axiosVCR.mountCassette('./test/cassettes/group-delete.json');
        let deleted = await new Group().withAuth().delete(groupID);
        axiosVCR.ejectCassette('./test/cassettes/group-delete.json');
        expect(deleted).to.be.instanceOf(Object).and.have.property('message').that.equals('Successfully deleted');
    });

    it('fails when the id is already deleted', async () => {
        axiosVCR.mountCassette('./test/cassettes/fail-group-delete.json', true);
        try {
            await new Group().withAuth().delete(groupID);
            throw 'should not read this line because the group is deleted already';
        } catch (e) {
            expect(e.message).to.exist;
        }
        axiosVCR.ejectCassette('./test/cassettes/fail-group-delete.json');
    });

    it('fails when the id does not exist', async () => {
        axiosVCR.mountCassette('./test/cassettes/fail-group-delete-5.json', true);
        try {
            await new Group().withAuth().delete(4342434);
            throw 'should not read this line because the group does not exist';
        } catch (e) {
            expect(e.message).equals('Group does not exist');
        }
        axiosVCR.ejectCassette('./test/cassettes/fail-group-delete-5.json');
    });
});