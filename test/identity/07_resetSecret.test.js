const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin, generateToken, generateIdentityOrPrincipal } = require('../../src/helpers/test_helpers'),
    Identity = require('../../v1/index').Identity,
    timeStamp = Math.floor(Date.now() / 1000),
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('reset secret', () => {

    describe('reset identity secret', async () => {
        describe('with auth', async () => {
            let identityId;
            before (async () => {
                identityId = await generateIdentityOrPrincipal('identity', 'identityUpdate1', timeStamp + 'test');
            });
            it('should reset identity secret', async () => {
                nockLogin();
                nock(`/identity/secret/reset/${ identityId }`, 'post', {
                    secret: 'new-secret-for-identity'
                }, 200, {
                    requestID: 'offline_awsRequestId_3726769879468832',
                    response: { message: 'Secret regenerated successfully' }
                });
                let resetSecret = await new Identity().withAuth().resetSecret('new-secret-for-identity', identityId);
                expect(resetSecret.message).to.equal('Secret regenerated successfully');
            });

            it('should generate identity secret', async () => {
                nockLogin();
                nock(`/identity/secret/reset/${ identityId }`, 'post', { secret: null }, 200, {
                    requestID: 'offline_awsRequestId_7067434686152883',
                    response: {
                        message: 'Secret regenerated successfully',
                        secret: '3551b374d4e00d64fb821f4f560a9960bde53859'
                    }
                });
                let generateSecret = await new Identity().withAuth().resetSecret(null, identityId);
                expect(generateSecret.message).to.equal('Secret regenerated successfully');
            });

        });


        describe('without auth and with setToken', async () => {
            let token,
                identityId;
            before( async () => {
                token = await generateToken();
                identityId = await generateIdentityOrPrincipal('identity', 'identityUpdate1', timeStamp + 1);
            });
            it('should reset identity secret', async () => {
                nockLogin();
                nock(`/identity/secret/reset/${ identityId }`, 'post', {
                    secret: 'new-secret-for-identity'
                }, 200, {
                    requestID: 'offline_awsRequestId_3726769879468832',
                    response: { message: 'Secret regenerated successfully' }
                });
                let resetSecret = await new Identity().setToken(token).resetSecret('new-secret-for-identity', identityId);
                expect(resetSecret.message).to.equal('Secret regenerated successfully');
            });

            it('should generate identity secret', async () => {
                nockLogin();
                nock(`/identity/secret/reset/${ identityId }`, 'post', { secret: null }, 200, {
                    requestID: 'offline_awsRequestId_7067434686152883',
                    response: {
                        message: 'Secret regenerated successfully',
                        secret: '3551b374d4e00d64fb821f4f560a9960bde53859'
                    }
                });
                let generateSecret = await new Identity().setToken(token).resetSecret(null, identityId);
                expect(generateSecret.message).to.equal('Secret regenerated successfully');
            });

        });
    });
});