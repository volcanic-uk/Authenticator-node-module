const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin, generateToken } = require('../helpers'),
    Identity = require('../../v1/index').Identity,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('logout the identity', () => {
    describe('with auth', async () => {
        it('should logout an identity', async () => {
            nockLogin();
            nock('/identity/logout', 'post', '', 200, {
                requestID: 'offline_awsRequestId_02870438822078314',
                response: { message: 'logout successfully' }
            });
            let logout = await new Identity().withAuth().logout();
            expect(logout).to.be.an('object');
        });
    });


    describe('without auth and with setToken', async () => {
        let token;
        before( async () => {
            token = await generateToken();
        });
        it('should logout an identity', async () => {
            nockLogin();
            nock('/identity/logout', 'post', '', 200, {
                requestID: 'offline_awsRequestId_02870438822078314',
                response: { message: 'logout successfully' }
            });
            let logout = await new Identity().setToken(token).logout();
            expect(logout).to.be.an('object');
        });

        it('should not logout an already logged out identity', async () => {
            try {
                nockLogin();
                nock('/identity/logout', 'post', '', 403, {
                    requestID: 'offline_awsRequestId_8350644685649544',
                    message: 'Forbidden',
                    errorCode: 3001
                });
                await new Identity().setToken(token).logout();
                throw Error('the code should not reach this scope as identity is already logged out');

            } catch (e) {
                expect(e.errorCode).to.equal(3001);
                expect(e).to.exist;
            }
        });

    });
});