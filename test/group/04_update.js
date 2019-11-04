const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    nock = require('nock'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);

const Group = require('../../v1').Group;

let groupID,
    tmpGroupName = 'group-test';
describe('group update', () => {

    // before(async () => {
    //     axiosVCR.mountCassette('./test/cassettes/main_ops/identity_login.json');
    //     token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
    //     token = token.token;
    //     axiosVCR.ejectCassette('./test/cassettes/main_ops/identity_login.json');
    //     axiosVCR.mountCassette('./test/cassettes/groups/get_name/get_group_by_name.json');
    //     let read = await new Group().withAuth().getByName(tmpGroupName);
    //     groupID = read.id;
    //     axiosVCR.ejectCassette('./test/cassettes/groups/get_name/get_group_by_name.json');
    // });
    // group update
    it('it updates the specified group info', async () => {
        nock('/identity/login', 'post', {
            name: 'volcanic',
            secret: 'volcanic!123',
            dataset_id: '-1',
            audience: '["volcanic"]'
        }, 200, {
            response: {
                response: {
                    token: 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjljYjg1YTc3YTllNWU0MTU3ODMyYTFlYTgzOTI3MDZhIn0.eyJleHAiOjE1NzI0OTYzNDIsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xLzEvMS8yIiwibmJmIjoxNTcyNDkyNzQyLCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzI0OTI3NDIsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AIIsVxwqsYWg3DqusQhC8qeBbIX22Rk6fZHwY2iNgnU-ghOJDmK9QNMZbqJDul5hqTXfFyB7HVw0SBXjivPtFunDAOytU-JupKTl7qgveRiU0oVMdtrtEI7iSNXS30p2ulEu0bumUjibTEW4oig0K4LJYoNxht_rPosOx_NPqCxp1ljB'
                }
            },
            status: 200
        });
        nock('/groups/16', 'post', {
            name: 'g********t', description: 'test group for module'
        }, 200, {
            id: '16',
            name: 'g********t',
            description: 'test group for module',
            subject_id: null,
            active: true,
            created_at: '2019-11-04T05:51:57.822Z',
            updated_at: '2019-11-04T05:55:41.495Z'

        });

        let update = await new Group().withAuth().update(16, 'group-test', 'test group for module');
        expect(update).to.be.instanceOf(Object).and.have.property('id');
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