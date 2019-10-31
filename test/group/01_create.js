const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);

const Identity = require('../../v1/index').Identity,
    Group = require('../../v1').Group;

let tmpGroupName = 'group-test',
    token;

describe('Group create', () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/main_ops/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/main_ops/identity_login.json');
    });

    it('should create a new group', async () => {
        axiosVCR.mountCassette('./test/cassettes/groups/create/create_group.json');
        let create = await new Group().withAuth().create(tmpGroupName, [], 'test group for module');
        expect(create).to.be.instanceOf(Object).and.have.property('id');
        axiosVCR.ejectCassette('./test/cassettes/groups/create/create_group.json');
    });

    it('fails upon duplicate entry', async () => {
        axiosVCR.mountCassette('./test/cassettes/groups/create/create_group_fail.json', true);
        try {
            await new Group().withAuth().create(tmpGroupName, [], 'test group for module');
            throw 'should not reach this line because the group name already exists';
        } catch (e) {
            expect(e.message).equals(`Duplicate entry ${tmpGroupName}`);
        }
        axiosVCR.ejectCassette('./test/cassettes/groups/create/create_group_fail.json');
    });
});