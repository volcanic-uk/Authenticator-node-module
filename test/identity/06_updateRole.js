const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../../src/helpers'),
    Identity = require('../../v1/index').Identity,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('Identity Roles update', () => {

    describe('with auth', async () => {
        it('should update the roles of the identity', async () => {
            nockLogin();
            nock('/identity/c12e86c0da/roles', 'post', {
                roles: [1]
            }, 200, {
                requestID: 'offline_awsRequestId_14548681360941473',
                response: [[Object]]
            });
            let updatedIdentityRole = await new Identity().withAuth().updateRoles('c12e86c0da', [1]); //check identity creation id here
            expect(updatedIdentityRole).to.exist;


        });

        it('it should not update roles a non existent identity', async () => {
            try {
                nockLogin();
                nock('/identity/c12e86c0da/roles', 'post', {
                    roles: [1]
                }, 404, {
                    requestID: 'offline_awsRequestId_5122381207197497',
                    message: 'Identity does not exist',
                    errorCode: 1004
                });
                await new Identity().withAuth().updateRoles('c12e86c0da', [1]);
            } catch (e) {
                expect(e.errorCode).to.be.equal(1004);
                expect(e).to.exist;
            }
        });
    });

});