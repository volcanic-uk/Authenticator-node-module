const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin, generateIdentityOrPrincipal } = require('../helpers'),
    Identity = require('../../v1/index').Identity,
    timeStamp = Math.floor(Date.now() / 1000),
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('Identity delete', () => {
    describe('with auth', async () => {
        let identityId;
        before (async () => {
            identityId = await generateIdentityOrPrincipal('identity', 'identityUpdate1', timeStamp + 'test_delete');
        });
        it('should delete identity', async () => {
            nockLogin();
            nock(`/identity/${identityId}`, 'delete', '', 200, {
                requestID: 'offline_awsRequestId_9275859723252489',
                response: { message: 'Identity deleted successfully' }
            });
            let deactivateIdentity = await new Identity().withAuth().delete(identityId);
            expect(deactivateIdentity.message).to.equal('Identity deleted successfully');
        });

        it('should not delete already deleted identity', async () => {
            try {
                nockLogin();
                nock(`/identity/${identityId}`, 'delete', '', 404, {
                    requestID: 'offline_awsRequestId_3501575564179309',
                    message: 'Identity does not exist',
                    errorCode: 1004
                });
                await new Identity().withAuth().delete(identityId);
                throw Error('The code should not reach this scope as identity already deactivated');
            } catch (e) {
                expect(e.errorCode).to.equal(1004);
            }

        });

    });
});