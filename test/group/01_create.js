const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    nock = require('../../src/helpers').nock,
    Group = require('../../v1').Group,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('Group create', () => {

    it('should create a new group', async () => {
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
        nock('/groups', 'post', {
            name: 'group_test',
            permissions: [],
            description: 'test group for module'
        }, 201, {
            response: {
                requestID: 'offline_awsRequestId_8442325613994397',
                response: {
                    name: 'g********t',
                    description: 'test group for module',
                    updated_at: '2019-10-31T07:27:15.142Z',
                    created_at: '2019-10-31T07:27:15.142Z',
                    id: 15
                }
            },
            status: 201
        });
        let create = await new Group().withAuth().create('group_testing', [], 'test group for module');
        expect(create).to.be.instanceOf(Object).and.have.property('id');

    });

    it('fails upon duplicate entry', async () => {
        try {
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
            nock('/groups', 'post', {
                name: 'group_test',
                permissions: [],
                description: 'test group for module'
            }, 400, {
                requestID: 'offline_awsRequestId_2116179236304796',
                message: 'Duplicate entry group_test',
                errorCode: 4002
            });
            await new Group().withAuth().create('group_test', [], 'test group for module');
            throw 'should not reach this line because the group name already exists';
        } catch (e) {
            expect(e.message).equals('Duplicate entry group_test');
        }
    });
});