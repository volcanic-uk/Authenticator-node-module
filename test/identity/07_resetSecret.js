const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    nock = require('../../src/helpers').nock,
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);

const Identity = require('../../v1/index').Identity;

let token;

describe('reset secret', () => {
    // before(async () => {
    //     axiosVCR.mountCassette('./test/cassettes/main_ops/identity/identity_reset_secret_test.json');
    //     await new Identity().withAuth().create(tmpIdentityName + 'create-name', tmpIdentitySecret, 'volcanic', [1]);
    //     axiosVCR.ejectCassette('./test/cassettes/main_ops/identity/identity_reset_secret_test.json');
    //
    //     axiosVCR.mountCassette('./test/cassettes/main_ops/identity_login.json');
    //     token = await new Identity().login(tmpIdentityName + 'create-name', tmpIdentitySecret, ['kratakao'], '-1');
    //     token = token.token;
    //     axiosVCR.ejectCassette('./test/cassettes/main_ops/identity_login.json');
    //
    //     axiosVCR.mountCassette('./test/cassettes/main_ops/identity/identity_reset_with_token.json');
    //     identityCreation = await new Identity().withAuth().create(tmpIdentityName + '-with-token', null, 'volcanic');
    //     axiosVCR.ejectCassette('./test/cassettes/main_ops/identity/identity_reset_with_token.json');
    // });
    describe('reset identity secret', async () => {
        describe('with auth', async () => {
            it('should reset identity secret', async () => {
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
                nock('/identity/secret/reset/4683245189', 'post', {
                    secret: 'new-secret-for-identity'
                }, 200, {
                    requestID: 'offline_awsRequestId_3726769879468832',
                    response: { message: 'Secret regenerated successfully' }
                });
                let resetSecret = await new Identity().withAuth().resetSecret('new-secret-for-identity', '4683245189');
                expect(resetSecret.message).to.equal('Secret regenerated successfully');
            });

            it('should generate identity secret', async () => {
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
                nock('/identity/secret/reset/4683245189', 'post', { secret: null }, 200, {
                    requestID: 'offline_awsRequestId_7067434686152883',
                    response: {
                        message: 'Secret regenerated successfully',
                        secret: '3551b374d4e00d64fb821f4f560a9960bde53859'
                    }
                });
                let generateSecret = await new Identity().withAuth().resetSecret(null, '4683245189');
                expect(generateSecret.message).to.equal('Secret regenerated successfully');
            });

        });


        describe('without auth and with setToken', async () => {
            it('should reset identity secret', async () => {
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
                nock('/identity/secret/reset/4683245189', 'post', {
                    secret: 'new-secret-for-identity'
                }, 200, {
                    requestID: 'offline_awsRequestId_3726769879468832',
                    response: { message: 'Secret regenerated successfully' }
                });
                let resetSecret = await new Identity().setToken(token).resetSecret('new-secret-for-identity', '4683245189');
                expect(resetSecret.message).to.equal('Secret regenerated successfully');
            });

            it('should generate identity secret', async () => {
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
                nock('/identity/secret/reset/4683245189', 'post', { secret: null }, 200, {
                    requestID: 'offline_awsRequestId_7067434686152883',
                    response: {
                        message: 'Secret regenerated successfully',
                        secret: '3551b374d4e00d64fb821f4f560a9960bde53859'
                    }
                });
                let generateSecret = await new Identity().setToken(token).resetSecret(null, '4683245189');
                expect(generateSecret.message).to.equal('Secret regenerated successfully');
            });

        });
    });
});