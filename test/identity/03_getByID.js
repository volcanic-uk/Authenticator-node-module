const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    nock = require('../../src/helpers').nock,
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);

const Identity = require('../../v1/index').Identity;

describe('get identity by id', () => {
    // before(async () => {
    //     axiosVCR.mountCassette('./test/cassettes/main_ops/identity_login.json');
    //     token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
    //     token = token.token;
    //     axiosVCR.ejectCassette('./test/cassettes/main_ops/identity_login.json');
    //
    //     axiosVCR.mountCassette('./test/cassettes/identities/create/identity_create.json');
    //     identityCreation = await new Identity().withAuth().create(tmpIdentityName, null, 'volcanic');
    //     axiosVCR.ejectCassette('./test/cassettes/identities/create/identity_create.json');
    // });
    describe('with auth', async () => {
        it('get an identity by id', async () => {
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
            nock('/identity/volcanic', 'get', {}, 201, {
                response: {
                    secure_id: 'volcanic',
                    deleted_at: null,
                    id: 1,
                    principal_id: 1,
                    name: 'v******c',
                    dataset_id: '-1',
                    source: null,
                    last_active_date: null,
                    last_used_ip_address: null,
                    active: true,
                    created_at: '2019-11-01T07:43:19.674Z',
                    updated_at: '2019-11-01T07:43:19.674Z'
                }
            });
            await new Identity().withAuth().getByID('volcanic');

        });

        it('should not proceed if the identity does not exist upon read request, and it will throw an error', async () => {
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
                nock('/identity/1', 'get', {}, 404, {
                    requestID: 'offline_awsRequestId_7528924137230482',
                    message: 'Identity does not exist',
                    errorCode: 1004

                });

                await new Identity().withAuth().getByID(1);
                throw 'can not retrieve an identity that does not exist';
            } catch (e) {
                expect(e.message).equals('Identity does not exist');
            }
        });

        it('should fail when requesting a read request when there is no token in the request header, and it will throw an error', async () => {
            try {
                nock('/identity/volcanic', 'get', {}, 404, {
                    requestID: 'offline_awsRequestId_7084939203047664',
                    message: 'Forbidden',
                    errorCode: 3001

                });
                await new Identity().getByID('volcanic');
                throw 'should not reach this line, because the read request has no token, or it is malformed';
            } catch (e) {
                expect(e.message).to.be.equals('Forbidden');
            }
        });

    });
});
