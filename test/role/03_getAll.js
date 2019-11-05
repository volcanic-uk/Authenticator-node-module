const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    nock = require('../../src/helpers').nock,
    Role = require('../../v1').Roles,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('Get all roles', () => {
    // get all roles
    it('should return the right role', async () => {
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
        nock('/roles?query=null&page=1&page_size=15&sort=id&order=asc', 'get', {}, 200, {
            response: {
                pagination: [Object],
                data: [
                    {
                        'id': 7,
                        'name': 'role-test',
                        'subject_id': 2,
                        'service_id': 2,
                        'created_at': '2019-11-01T03:53:46.332Z',
                        'updated_at': '2019-11-01T03:53:46.332Z'
                    },
                    {
                        'id': 8,
                        'name': 'Role-157258149',
                        'subject_id': 2,
                        'service_id': 7,
                        'created_at': '2019-11-01T04:11:34.898Z',
                        'updated_at': '2019-11-01T04:11:34.898Z'
                    }
                ]
            }
        });
        let read = await new Role().withAuth().getRoles(null, 1, 15, 'id', 'asc');
        expect(read.data).to.be.ascendingBy('id');
    });
});