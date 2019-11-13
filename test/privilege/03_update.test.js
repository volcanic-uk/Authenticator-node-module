const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    nock = require('../../src/helpers').nock,
    Privilege = require('../../v1').Privilege,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('Update privileges', () => {
    it('fails updating a non existing ID', async () => {
        try {
            nock('/privileges/123412', 'post', {
                permission_id: 1,
                group_id: 1,
                scope: 'vrn:{stack}:{dataset}:jobs/*'
            }, 404, {
                message: 'Privilege does not exist', errorCode: 8001
            });
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
            await new Privilege().withAuth().update(123412, 'vrn:{stack}:{dataset}:jobs/*', 1, 1);
            throw 'should not reach this line, because the id doesnt exist';
        } catch (e) {
            expect(e.message).to.equal('Privilege does not exist');
            expect(e.errorCode).to.equal(8001);
        }
    });

    it('updates the specified privilege', async () => {
        nock('/privileges/4', 'post', {
            permission_id: 1,
            group_id: 1,
            scope: 'vrn:{stack}:{dataset}:jobs/*'
        }, 200, {
            response: {
                id: 4,
                scope: 'vrn:{stack}:{dataset}:jobs/*',
                permission_id: 1,
                group_id: 1,
                allow: true,
                subject_id: null,
                created_at: '2019-10-31T09:33:20.570Z',
                updated_at: '2019-11-01T03:14:25.349Z'
            }
        });
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
        let update = await new Privilege().withAuth().update(4, 'vrn:{stack}:{dataset}:jobs/*', 1, 1);
        expect(update).to.be.an.instanceOf(Object).and.have.property('group_id');
    });
});