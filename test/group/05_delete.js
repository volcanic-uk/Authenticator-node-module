const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;

chai.use(chaiAsPromised);
chai.use(sorted);

let tmpGroupName = 'group-test',
    groupID, token;

const Identity = require('../../v1/index').Identity,
    Group = require('../../v1').Group;

describe('group delete', () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/main_ops/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/main_ops/identity_login.json');
        axiosVCR.mountCassette('./test/cassettes/groups/get_name/get_group_by_name.json');
        let read = await new Group().withAuth().getByName(tmpGroupName);
        groupID = read.id;
        axiosVCR.ejectCassette('./test/cassettes/groups/get_name/get_group_by_name.json');
    });

    it('deletes the specified id', async () => {
        axiosVCR.mountCassette('./test/cassettes/groups/delete/delete_group.json');
        let deleted = await new Group().withAuth().delete(groupID);
        expect(deleted).to.be.instanceOf(Object).and.have.property('message').that.equals('Successfully deleted');
        axiosVCR.ejectCassette('./test/cassettes/groups/delete/delete_group.json');
    });

    it('fails when the id is already deleted', async () => {
        axiosVCR.mountCassette('./test/cassettes/groups/delete/delete_group_fail.json', true);
        try {
            await new Group().withAuth().delete(groupID);
            throw 'should not read this line because the group is deleted already';
        } catch (e) {
            expect(e.message).to.exist;
        }
        axiosVCR.ejectCassette('./test/cassettes/groups/delete/delete_group_fail.json');
    });

    it('fails when the id does not exist', async () => {
        axiosVCR.mountCassette('./test/cassettes/groups/delete/delete_group_fail_id.json', true);
        try {
            await new Group().withAuth().delete(4342434);
            throw 'should not read this line because the group does not exist';
        } catch (e) {
            expect(e.message).equals('Group does not exist');
        }
        axiosVCR.ejectCassette('./test/cassettes/groups/delete/delete_group_fail_id.json');
    });
});