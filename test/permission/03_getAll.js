const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    nock = require('../../src/helpers').nock,
    Permission = require('../../v1').Permission,
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);

describe('should read all permissions', async () => {
    it('should read all permissions in ascending order', async () => {
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
        nock('/permissions?query=&page=&page_size=&sort=id&order=asc', 'get', {}, 200, {
            response: {
                pagination: [Object], data: [
                    {
                        'id': 1,
                        'name': 'identity:create',
                        'description': null,
                        'subject_id': null,
                        'service_id': 1,
                        'active': true,
                        'created_at': '2019-10-31T09:33:20.270Z',
                        'updated_at': '2019-10-31T09:33:20.270Z'
                    },
                    {
                        'id': 2,
                        'name': 'identity:update',
                        'description': null,
                        'subject_id': null,
                        'service_id': 1,
                        'active': true,
                        'created_at': '2019-10-31T09:33:20.282Z',
                        'updated_at': '2019-10-31T09:33:20.282Z'
                    }
                ]
            }
        });
        let permissionsGetAll = await new Permission().withAuth().getPermissions('', '', '', 'id', 'asc');
        expect(permissionsGetAll.data).to.be.ascendingBy('id');
    });
    it('should read all permissions in descending order', async () => {
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
        nock('/permissions?query=&page=&page_size=&sort=id&order=desc', 'get', {}, 200, {
            response: {
                pagination: [Object], data: [
                    {
                        'id': 2,
                        'name': 'identity:update',
                        'description': null,
                        'subject_id': null,
                        'service_id': 1,
                        'active': true,
                        'created_at': '2019-10-31T09:33:20.282Z',
                        'updated_at': '2019-10-31T09:33:20.282Z'
                    },
                    {
                        'id': 1,
                        'name': 'identity:create',
                        'description': null,
                        'subject_id': null,
                        'service_id': 1,
                        'active': true,
                        'created_at': '2019-10-31T09:33:20.270Z',
                        'updated_at': '2019-10-31T09:33:20.270Z'
                    }
                ]
            }
        });
        let permissionsGetAll = await new Permission().withAuth().getPermissions('', '', '', 'id', 'desc');
        expect(permissionsGetAll.data).to.be.descendingBy('id');
    });
});