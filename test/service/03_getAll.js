const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    nock = require('../../src/helpers').nock,
    Service = require('../../v1').Service,
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);

describe('should read all services', async () => {

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
        nock('/services?query=&page=1&page_size=15&sort=id&order=asc', 'get', {}, 200, {
            response: {
                pagination: [Object],
                data: [
                    {
                        'id': 1,
                        'name': 'auth',
                        'active': true,
                        'subject_id': null,
                        'created_at': '2019-10-31T09:33:20.217Z',
                        'updated_at': '2019-10-31T09:33:20.217Z'
                    },
                    {
                        'id': 2,
                        'name': 'krakatoa',
                        'active': true,
                        'subject_id': null,
                        'created_at': '2019-10-31T09:33:20.905Z',
                        'updated_at': '2019-10-31T09:33:20.905Z'
                    }
                ]
            }
        });
        let servicesGetAll = await new Service().withAuth().getServices('', 1, 15, 'id', 'asc');
        expect(servicesGetAll.data).to.be.ascendingBy('id');
    });

    it('should read all services in descending order', async () => {
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
        nock('/services?query=&page=1&page_size=15&sort=id&order=desc', 'get', {}, 200, {
            response: {
                pagination: [Object],
                data: [
                    {
                        'id': 2,
                        'name': 'krakatoa',
                        'active': true,
                        'subject_id': null,
                        'created_at': '2019-10-31T09:33:20.905Z',
                        'updated_at': '2019-10-31T09:33:20.905Z'
                    },
                    {
                        'id': 1,
                        'name': 'auth',
                        'active': true,
                        'subject_id': null,
                        'created_at': '2019-10-31T09:33:20.217Z',
                        'updated_at': '2019-10-31T09:33:20.217Z'
                    }
                ]
            }
        });
        let servicesGetAll = await new Service().withAuth().getServices('', 1, 15, 'id', 'desc');
        expect(servicesGetAll.data).to.be.descendingBy('id');
    });
});