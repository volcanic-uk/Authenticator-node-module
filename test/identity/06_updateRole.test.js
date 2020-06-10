const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin, generateIdentityOrPrincipal } = require('../helpers'),
    Identity = require('../../v1/index').Identity,
    timeStamp = Math.floor(Date.now() / 1000),
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('Identity Roles update', () => {

    describe('with auth', async () => {
        let identityId;
        before(async () => {
            identityId = await generateIdentityOrPrincipal('identity', 'identityUpdate1', timeStamp);
        });
        it('should update the roles of the identity', async () => {
            nockLogin();
            nock(`/identity/${identityId}/roles`, 'post', {
                roles: [1]
            }, 200, {
                requestID: 'offline_awsRequestId_14548681360941473',
                response: [[Object]]
            });
            let updatedIdentityRole = await new Identity().withAuth().updateRoles({ id: identityId, roles: [1] }); //check identity creation id here
            expect(updatedIdentityRole).to.exist;
        });

        it('it should not update roles a non existent identity', async () => {
            try {
                nockLogin();
                nock('/identity/9i9i9i/roles', 'post', {
                    roles: [1]
                }, 404, {
                    requestID: 'offline_awsRequestId_5122381207197497',
                    message: 'Identity does not exist',
                    errorCode: 1004
                });
                await new Identity().withAuth().updateRoles({ id: '9i9i9i', roles: [1] });
            } catch (e) {
                expect(e.errorCode).to.be.equal(1004);
                expect(e).to.exist;
            }
        });
    });

});