const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../../src/helpers'),
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
        it('should logout an identity', async () => {
            nockLogin();
            nock('/identity/logout', 'post', '', 200, {
                requestID: 'offline_awsRequestId_02870438822078314',
                response: { message: 'logout successfully' }
            });
            let token = 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjljYjg1YTc3YTllNWU0MTU3ODMyYTFlYTgzOTI3MDZhIn0.eyJleHAiOjE1NzM0NDUwNjYsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xL3ZvbGNhbmljL3ZvbGNhbmljIiwibmJmIjoxNTczNDQxNDY2LCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzM0NDE0NjYsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AGMYvpoactwL7wW8FBfvm7mEhtUIiwqdiaO0XpXKZFhm6N8bDmCkg7QMuTJDYarp-AfdO0z4jWxRun4TWSD5h3l_AK-HrdssT6JgtJLY9y8uBSzHzIOvHtBwE9jfxO-T2ZT8qlu91PS1NqzJhD_Dm5th4OlSkNpp06qp4KXghUJdBM0Z';
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
                let token = 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjljYjg1YTc3YTllNWU0MTU3ODMyYTFlYTgzOTI3MDZhIn0.eyJleHAiOjE1NzM0NDUwNjYsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xL3ZvbGNhbmljL3ZvbGNhbmljIiwibmJmIjoxNTczNDQxNDY2LCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzM0NDE0NjYsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AGMYvpoactwL7wW8FBfvm7mEhtUIiwqdiaO0XpXKZFhm6N8bDmCkg7QMuTJDYarp-AfdO0z4jWxRun4TWSD5h3l_AK-HrdssT6JgtJLY9y8uBSzHzIOvHtBwE9jfxO-T2ZT8qlu91PS1NqzJhD_Dm5th4OlSkNpp06qp4KXghUJdBM0Z';
                await new Identity().setToken(token).logout();
                throw Error('the code should not reach this scope as identity is already logged out');

            } catch (e) {
                expect(e.errorCode).to.equal(3001);
                expect(e).to.exist;
            }
        });

    });
});