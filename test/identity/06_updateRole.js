const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    nock = require('../../src/helpers').nock,
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);

const Identity = require('../../v1/index').Identity;
describe('Identity Roles update', () => {
    // before(async () => {
    //     axiosVCR.mountCassette('./test/cassettes/main_ops/identity_login.json');
    //     token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
    //     token = token.token;
    //     axiosVCR.ejectCassette('./test/cassettes/main_ops/identity_login.json');
    //
    //     axiosVCR.mountCassette('./test/cassettes/identities/create/identity_create.json');
    //     identityCreation = await new Identity().withAuth().create('identity-111', null, 'volcanic');
    //     axiosVCR.ejectCassette('./test/cassettes/identities/create/identity_create.json');
    //
    //     axiosVCR.mountCassette('./test/cassettes/main_ops/identity/update_identity_roles_test.json');
    //     roleCreation = await new Role().withAuth().create(tmpRoleName, 2, [1, 2]);
    //     axiosVCR.ejectCassette('./test/cassettes/main_ops/identity/update_identity_roles_test.json');
    // });
    describe('with auth', async () => {
        it('should update the roles of the identity', async () => {
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
            nock('/identity/4683245189/roles', 'post', {
                roles: [1]
            }, 200, {
                requestID: 'offline_awsRequestId_14548681360941473',
                response: [[Object]]
            });
            let updatedIdentityRole = await new Identity().withAuth().updateRoles('4683245189', [1]); //check identity creation id here
            expect(updatedIdentityRole).to.exist;


        });

        it('it should not update roles a non existent identity', async () => {
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
                nock('/identity/468324518954545/roles', 'post', {
                    roles: [1]
                }, 404, {
                    requestID: 'offline_awsRequestId_5122381207197497',
                    message: 'Identity does not exist',
                    errorCode: 1004
                });
                await new Identity().withAuth().updateRoles('468324518954545', [1]);
            } catch (e) {
                expect(e.errorCode).to.be.equal(1004);
                expect(e).to.exist;
            }
        });
    });

});