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

describe('get group by name', () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/main_ops/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/main_ops/identity_login.json');
    });
    // read a group by name
    it('gets a group by its name', async () => {
        axiosVCR.mountCassette('./test/cassettes/groups/get_name/get_group_by_name.json');
        let read = await new Group().withAuth().getByName('identities_all');
        expect(read).to.be.instanceOf(Object).and.have.property('id');
        axiosVCR.ejectCassette('./test/cassettes/groups/get_name/get_group_by_name.json');
    });

    it('fails when the name doesnt exist', async () => {
        axiosVCR.mountCassette('./test/cassettes/groups/get_name/get_group_by_name_fail.json', true);
        try {
            await new Group().withAuth().getByName('group_name_that_doesnt_exist');
            throw 'should not read this line because the id is not valid';
        } catch (e) {
            expect(e.message).equals('Group does not exist');
        }
        axiosVCR.ejectCassette('./test/cassettes/groups/get_name/get_group_by_name_fail.json');
    });
});