const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    nock = require('nock'),
    expect = chai.expect;

chai.use(chaiAsPromised);
chai.use(sorted);
const Group = require('../../v1').Group;

describe('get group by name', () => {
    // before(async () => {
    //     axiosVCR.mountCassette('./test/cassettes/main_ops/identity_login.json');
    //     token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
    //     token = token.token;
    //     axiosVCR.ejectCassette('./test/cassettes/main_ops/identity_login.json');
    // });
    // read a group by name
    it('gets a group by its name', async () => {
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
        nock('/groups/identities_all', 'get', '', 200, {
            response: {
                name: 'identities_all',
                id: 1,
                description: null,
                subject_id: null,
                active: true,
                created_at: '2019-10-31T08:01:30.102Z',
                updated_at: '2019-10-31T08:01:30.102Z'
            }
        });

        let read = await new Group().withAuth().getByName('identities_all');
        expect(read).to.be.instanceOf(Object).and.have.property('id');

    });

    it('fails when the name doesnt exist', async () => {
        try {
            nock('/groups/1testing', 'get', {}, 404, {
                requestID: 'offline_awsRequestId_4213248638586029',
                message: 'Group does not exist',
                errorCode: 4001
            });
            await new Group().withAuth().getByName('1testing');
            throw 'should not read this line because the id is not valid';
        } catch (e) {
            expect(e.message).equals('Group does not exist');
        }
    });
});