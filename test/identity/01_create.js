const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);

const Identity = require('../../v1/index').Identity,
    nock = require('../../src/helpers').nock;
let identityCreation,
    token;

describe('create identity', () => {
    // before(async () => {
    //     axiosVCR.mountCassette('./test/cassettes/main_ops/identity_login.json');
    //     token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
    //     token = token.token;
    //     axiosVCR.ejectCassette('./test/cassettes/main_ops/identity_login.json');
    // });
    describe('with auth', async () => {
        it('creating a new identity', async () => {
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
            nock('/identity', 'post', {
                name: 'identity_create_new',
                secret: null,
                principal_id: 'volcanic'
            }, 201, {
                response: {
                    requestID: 'offline_awsRequestId_8442325613994397',
                    response: {
                        name: 'identity_create_new',
                        principal_id: 1,
                        secret: '$?V8%Ng$W:M',
                        source: null,
                        secure_id: 'e514f7bf50',
                        dataset_id: '-1',
                        updated_at: '2019-11-01T02:55:19.144Z',
                        created_at: '2019-11-01T02:55:19.144Z',
                        id: 2
                    }
                },
                status: 201
            });
            identityCreation = await new Identity().withAuth().create('identity_create_new', null, 'volcanic');
            expect(identityCreation).to.be.an('object');
        });

        it('creating a new identity with secret', async () => {
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
            nock('/identity', 'post', {
                name: 'identity_with_password',
                secret: 'volcanic!123',
                principal_id: 'volcanic'
            }, 201, {
                response: {
                    requestID: 'offline_awsRequestId_8442325613994397',
                    response: {
                        name: 'i**********1',
                        principal_id: 1,
                        secret: '*****',
                        source: null,
                        secure_id: 'd53546ab54',
                        dataset_id: '-1',
                        updated_at: '2019-11-01T03:02:17.322Z',
                        created_at: '2019-11-01T03:02:17.322Z',
                        id: 2
                    }
                },
                status: 201
            });
            let identityCreationWithSecret = await new Identity().withAuth().create('identity_with_password', 'volcanic!123', 'volcanic');
            expect(identityCreationWithSecret).to.be.an('object');

        });

        it('should not create a duplicate identity record', async () => {

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
                nock('/identity', 'post', {
                    name: 'identity_with_password',
                    secret: 'volcanic!123',
                    principal_id: 'volcanic',
                }, 400, {

                    requestID: 'offline_awsRequestId_24697166768011525',
                    message: 'Duplicate entry identity-secret on dataset -1',
                    errorCode: 1003

                });
                await new Identity().withAuth().create('identity_with_password', 'volcanic!123', 'volcanic');
                throw Error('The code should not reach this scope as it would be a duplicate identity record');
            } catch (e) {
                expect(e.errorCode).to.equal(1003);
                expect(e).to.exist;
            }
        });

        it('creating an identity record without principal_id', async () => {
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
                nock('/identity', 'post', {
                    name: 'identity_with_password',
                    secret: 'volcanic!123',
                    principal_id: null
                }, 422, {
                    requestID: 'offline_awsRequestId_4570424539864406',
                    message: { principal_id: '"principal_id" must be a string' },
                    errorCode: 10001
                });
                await new Identity().withAuth().create('identity_with_password', 'volcanic!123', null);
                throw Error('The code should not reach this scope as identity cannot be created without principal id');
            } catch (e) {
                expect(e.errorCode).to.equal(10001);
                expect(e).to.exist;
            }
        });

        it('creating an identity record without name', async () => {
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
            nock('/identity', 'post', {
                name: null,
                secret: 'volcanic!123',
                principal_id: 'volcanic',
            }, 400, {
                requestID: 'offline_awsRequestId_5997535176835269',
                message: { name: '"*********************g' },
                errorCode: 10001
            });
            try {
                await new Identity().withAuth().create(null, 'volcanic!123', 'volcanic');
                throw Error('The code should not reach this scope as identity cannot be created without identity name');
            } catch (e) {
                expect(e.errorCode).to.equal(10001);
                expect(e).to.exist;
            }
        });

    });


    describe('without auth and with setToken', async () => {
        it('creating a new identity', async () => {
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
            nock('/identity', 'post', {
                name: 'identity_create_new',
                secret: null,
                principal_id: 'volcanic'
            }, 201, {
                response: {
                    requestID: 'offline_awsRequestId_8442325613994397',
                    response: {
                        name: 'i*****************w',
                        principal_id: 1,
                        secret: '*****',
                        source: null,
                        secure_id: '6b94331448',
                        dataset_id: '-1',
                        updated_at: '2019-11-01T06:27:01.642Z',
                        created_at: '2019-11-01T06:27:01.642Z',
                        id: 2
                    }
                }
            });
            let token = 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6ImE1ZjUzZmEyNWYyZjgyYTM4NDNjNGFmMTFiZDgwMWExIn0.eyJleHAiOjE1NzI1OTM3NzUsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xL3ZvbGNhbmljL3ZvbGNhbmljIiwibmJmIjoxNTcyNTkwMTc1LCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzI1OTAxNzUsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AbrOkeHJLv4xIWu409MLMOZknAna14WJtsTTbgtmQlRZ8j4dQH6yS5cMqppkUvXRh0n222LcXZAGMEzEyPuHQoa7AEQQyoNNMateg-SiEnXfsdtn8INloscHyfRYOrexcDoOF4U7K0zrJsBlzteNI-bvFZUYhgrdPztjE0fIUp1nYbCc';
            let identityCreation = await new Identity().setToken(token).create('identity_create_new', null, 'volcanic');
            expect(identityCreation).to.be.an('object');
        });

        it('creating a new identity with secret', async () => {
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
            nock('/identity', 'post', {
                name: 'identity_with_password',
                secret: 'volcanic!123',
                principal_id: 'volcanic'
            }, 201, {
                response: {
                    requestID: 'offline_awsRequestId_8442325613994397',
                    response: {
                        name: 'i********************d',
                        principal_id: 1,
                        source: null,
                        secure_id: '760c46cadb',
                        dataset_id: '-1',
                        updated_at: '2019-11-01T06:57:10.346Z',
                        created_at: '2019-11-01T06:57:10.346Z',
                        id: 2
                    }
                }
            });
            let token = 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6ImE1ZjUzZmEyNWYyZjgyYTM4NDNjNGFmMTFiZDgwMWExIn0.eyJleHAiOjE1NzI1OTUwMDEsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xL3ZvbGNhbmljL3ZvbGNhbmljIiwibmJmIjoxNTcyNTkxNDAxLCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzI1OTE0MDEsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.ATBVB0fzNWVKZ3ND7GB429K4lPsQaPEJfjxPjyMPqkm7aFVo9QFV4ytrKO5oy85LEW8l8AuSepBuND46MjxPG-j2AWoANJJaXHh1GAyp-JOgbFGPiHyA8xatGBqTCLrCaiWtPfRVmytb6mggIKiUksDj5xcJZwkIYQPk55gTzIXdGytz';
            let identityCreationWithSecret = await new Identity().setToken(token).create('identity_with_password', 'volcanic!123', 'volcanic');
            expect(identityCreationWithSecret).to.be.an('object');

        });

        it('should not create a duplicate identity record', async () => {

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
                nock('/identity', 'post', {
                    name: 'identity_with_password',
                    secret: 'volcanic!123',
                    principal_id: 'volcanic',
                }, 400, {

                    requestID: 'offline_awsRequestId_24697166768011525',
                    message: 'Duplicate entry identity-secret on dataset -1',
                    errorCode: 1003

                });
                await new Identity().setToken(token).create('identity_with_password', 'volcanic!123', 'volcanic');
                throw Error('The code should not reach this scope as it would be a duplicate identity record');
            } catch (e) {
                expect(e.errorCode).to.equal(1003);
                expect(e).to.exist;
            }

        });

        it('creating an identity record without principal_id', async () => {
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
                nock('/identity', 'post', {
                    name: 'identity_with_password',
                    secret: 'volcanic!123',
                    principal_id: null
                }, 422, {
                    requestID: 'offline_awsRequestId_4570424539864406',
                    message: { principal_id: '"principal_id" must be a string' },
                    errorCode: 10001
                });
                await new Identity().setToken(token).create('identity_with_password', 'volcanic!123', null);
                throw Error('The code should not reach this scope as identity cannot be created without principal id');
            } catch (e) {
                expect(e.errorCode).to.equal(10001);
                expect(e).to.exist;
            }
        });

        it('creating an identity record without name', async () => {
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
                nock('/identity', 'post', {
                    name: null,
                    secret: 'volcanic!123',
                    principal_id: 'volcanic',
                }, 400, {
                    requestID: 'offline_awsRequestId_5997535176835269',
                    message: { name: '"*********************g' },
                    errorCode: 10001
                });
                let token = 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6ImE1ZjUzZmEyNWYyZjgyYTM4NDNjNGFmMTFiZDgwMWExIn0.eyJleHAiOjE1NzI1OTU3MDAsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xL3ZvbGNhbmljL3ZvbGNhbmljIiwibmJmIjoxNTcyNTkyMTAwLCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzI1OTIxMDAsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.ATZbRHRJEKKgy4_UkTg8K3CD92swQa6BcO6HxqrSbjT3Cvceb2YwNH35HemBFBbFQGx9B4WoZqkWtvM0tS5J5W-kAa1ZEsZOUG0Hoqlz3Nua3e8qmQDkXyXhChiuNNHAyHwM2U2MNCQTgW5qyubaxRMajHMepcapl4YKCFYkfw6e4HRM';
                await new Identity().setToken(token).create(null, 'volcanic!123', 'volcanic');
                throw Error('The code should not reach this scope as identity cannot be created without identity name');
            } catch (e) {
                expect(e.errorCode).to.equal(10001);
                expect(e).to.exist;
            }

        });

    });
});