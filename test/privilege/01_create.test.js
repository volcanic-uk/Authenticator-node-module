const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    expect = chai.expect,
    Privilege = require('../../v1/index').Privilege,
    nock = require('../../src/helpers').nock;
chai.use(chaiAsPromised);

// create privileges
describe('creates privilege', () => {
    it('fails when the token is invalid', async () => {
        try {
            nock('/privileges', 'post', {
                scope: 'vrn:{stack}:{dataset}:jobs/*',
                permission_id: 1,
                group_id: 1,
                allow: true
            }, 403, {
                message: 'Forbidden', errorCode: 3001
            });
            await new Privilege().setToken('sometoken').create('vrn:{stack}:{dataset}:jobs/*', 1, 1, true);
            throw 'must not reach this line because the token is invalid';
        } catch (e) {
            expect(e.message).to.equal('Forbidden');
            expect(e.errorCode).to.equal(3001);
        }
    });
    it('creates a new privilege', async () => {
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
        nock('/privileges', 'post', {
            scope: 'vrn:{stack}:{dataset}:jobs/*',
            permission_id: 1,
            group_id: 1,
            allow: true
        }, 201, {
            response: {
                scope: 'vrn:{stack}:{dataset}:jobs/*',
                permission_id: 1,
                group_id: 1,
                subject_id: '2',
                allow: true,
                updated_at: '2019-11-01T01:56:12.001Z',
                created_at: '2019-11-01T01:56:12.001Z',
                id: 15
            }
        });
        let create = await new Privilege().withAuth().create('vrn:{stack}:{dataset}:jobs/*', 1, 1, true);
        expect(create).to.be.an.instanceOf(Object).and.have.property('group_id');
    });
});


