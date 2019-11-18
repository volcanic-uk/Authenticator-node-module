const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin, generateToken, generateIdentityOrPrincipal } = require('../../src/helpers/test_helpers'),
    Identity = require('../../v1/index').Identity,
    timeStamp = Math.floor(Date.now() / 1000),
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('Identity deactivate', () => {

    describe('with auth', async () => {
        let identityId;
        before (async () => {
            identityId = await generateIdentityOrPrincipal('identity', 'identityUpdate1', timeStamp + 'deac_test');
        });
        it('should deactivate identity', async () => {
            nockLogin();
            nock(`/identity/${identityId}/deactivate`, 'post', {}, 200, {
                requestID: 'offline_awsRequestId_746253293370551',
                response: { message: 'Successfully deactivated identity' }
            });
            let deactivateIdentity = await new Identity().withAuth().deactivateIdentity(identityId);
            expect(deactivateIdentity.message).to.equal('Successfully deactivated identity');
        });

        it('should not deactivate already deactivated identity', async () => {
            try {
                nockLogin();
                nock(`/identity/${identityId}/deactivate`, 'post', {}, 410, {
                    requestID: 'offline_awsRequestId_9899538118338027',
                    message: 'Identity already deactivated',
                    errorCode: 1004
                });
                await new Identity().withAuth().deactivateIdentity(identityId);
                throw Error('The code should not reach this scope as identity already deactivated');
            } catch (e) {
                expect(e.errorCode).to.equal(1004);
            }
        });

    });


    describe('without auth and with setToken', async () => {
        let token,
            identityId;
        before( async () => {
            token = await generateToken();
            identityId = await generateIdentityOrPrincipal('identity', 'identityUpdate2', timeStamp + 'deac_test_auth');
        });
        it('should deactivate identity', async () => {
            nockLogin();
            nock(`/identity/${identityId}/deactivate`, 'post', '', 200, {
                requestID: 'offline_awsRequestId_746253293370551',
                response: { message: 'Successfully deactivated identity' }
            });
            let deactivateIdentity = await new Identity().setToken(token).deactivateIdentity(identityId);
            expect(deactivateIdentity.message).to.equal('Successfully deactivated identity');
        });

        it('should not deactivate already deactivated identity', async () => {
            try {
                nockLogin();
                nock(`/identity/${identityId}/deactivate`, 'post', '', 410, {
                    requestID: 'offline_awsRequestId_006449310684198073',
                    message: 'Identity already deactivated',
                    errorCode: 1004
                });
                await new Identity().setToken(token).deactivateIdentity(identityId);
                throw Error('The code should not reach this scope as identity already deactivated');
            } catch (e) {
                expect(e.errorCode).to.equal(1004);
            }
        });

    });
});