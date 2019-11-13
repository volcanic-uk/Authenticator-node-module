const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../../src/helpers'),
    Identity = require('../../v1/index').Identity,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('Identity deactivate', () => {

    describe('with auth', async () => {

        it('should deactivate identity', async () => {
            nockLogin();
            nock('/identity/c12e86c0da/deactivate', 'post', {}, 200, {
                requestID: 'offline_awsRequestId_746253293370551',
                response: { message: 'Successfully deactivated identity' }
            });
            let deactivateIdentity = await new Identity().withAuth().deactivateIdentity('c12e86c0da');
            expect(deactivateIdentity.message).to.equal('Successfully deactivated identity');
        });

        it('should not deactivate already deactivated identity', async () => {
            try {
                nockLogin();
                nock('/identity/c12e86c0da/deactivate', 'post', {}, 410, {
                    requestID: 'offline_awsRequestId_9899538118338027',
                    message: 'Identity already deactivated',
                    errorCode: 1004
                });
                await new Identity().withAuth().deactivateIdentity('c12e86c0da');
                throw Error('The code should not reach this scope as identity already deactivated');
            } catch (e) {
                expect(e.errorCode).to.equal(1004);
            }
        });

    });


    describe('without auth and with setToken', async () => {
        it('should deactivate identity', async () => {
            nockLogin();
            nock('/identity/a0c487ae3c/deactivate', 'post', '', 200, {
                requestID: 'offline_awsRequestId_746253293370551',
                response: { message: 'Successfully deactivated identity' }
            });
            let token = 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjljYjg1YTc3YTllNWU0MTU3ODMyYTFlYTgzOTI3MDZhIn0.eyJleHAiOjE1NzM0NDUwNjYsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xL3ZvbGNhbmljL3ZvbGNhbmljIiwibmJmIjoxNTczNDQxNDY2LCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzM0NDE0NjYsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AGMYvpoactwL7wW8FBfvm7mEhtUIiwqdiaO0XpXKZFhm6N8bDmCkg7QMuTJDYarp-AfdO0z4jWxRun4TWSD5h3l_AK-HrdssT6JgtJLY9y8uBSzHzIOvHtBwE9jfxO-T2ZT8qlu91PS1NqzJhD_Dm5th4OlSkNpp06qp4KXghUJdBM0Z';
            let deactivateIdentity = await new Identity().setToken(token).deactivateIdentity('a0c487ae3c');
            expect(deactivateIdentity.message).to.equal('Successfully deactivated identity');
        });

        it('should not deactivate already deactivated identity', async () => {
            try {
                nockLogin();
                nock('/identity/c12e86c0da/deactivate', 'post', '', 410, {
                    requestID: 'offline_awsRequestId_006449310684198073',
                    message: 'Identity already deactivated',
                    errorCode: 1004
                });
                let token = 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjljYjg1YTc3YTllNWU0MTU3ODMyYTFlYTgzOTI3MDZhIn0.eyJleHAiOjE1NzM0NDUwNjYsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xL3ZvbGNhbmljL3ZvbGNhbmljIiwibmJmIjoxNTczNDQxNDY2LCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzM0NDE0NjYsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AGMYvpoactwL7wW8FBfvm7mEhtUIiwqdiaO0XpXKZFhm6N8bDmCkg7QMuTJDYarp-AfdO0z4jWxRun4TWSD5h3l_AK-HrdssT6JgtJLY9y8uBSzHzIOvHtBwE9jfxO-T2ZT8qlu91PS1NqzJhD_Dm5th4OlSkNpp06qp4KXghUJdBM0Z';
                await new Identity().setToken(token).deactivateIdentity('c12e86c0da');
                throw Error('The code should not reach this scope as identity already deactivated');
            } catch (e) {
                expect(e.errorCode).to.equal(1004);
            }
        });

    });
});