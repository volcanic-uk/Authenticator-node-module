const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);

const Identity = require('../../v1/index').Identity,
    Group = require('../../v1').Group;

let token,
    groupID,
    tmpGroupName = 'group-test';
describe('group update', () => {

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
    // group update
    it('it updates the specified group info', async () => {
        axiosVCR.mountCassette('./test/cassettes/groups/update/update_group.json');
        let update = await new Group().withAuth().update(groupID, tmpGroupName + '-updated');
        expect(update).to.be.instanceOf(Object).and.have.property('id');
        axiosVCR.ejectCassette('./test/cassettes/groups/update/update_group.json');
    });

    it('fails when passing an invalid id', async () => {
        axiosVCR.mountCassette('./test/cassettes/groups/update/update_group_fail.json', true);
        try {
            await new Group().withAuth().update(groupID + 12, tmpGroupName + 'updated');
            throw 'should not read this line, because the id is not valid';
        } catch (e) {
            expect(e.message).equals('Permission group does not exist');
        }
        axiosVCR.ejectCassette('./test/cassettes/groups/update/update_group_fail.json');
    });

});