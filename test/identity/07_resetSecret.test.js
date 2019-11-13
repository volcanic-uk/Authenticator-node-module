const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    nock = require('../../src/helpers').nock,
    Identity = require('../../v1/index').Identity,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('reset secret', () => {

    describe('reset identity secret', async () => {
        describe('with auth', async () => {
            it('should reset identity secret', async () => {
                nock('/identity/login', 'post', {
                    name: 'volcanic',
                    secret: 'volcanic!123',
                    dataset_id: '-1',
                    audience: '["volcanic"]'
                }, 200, {
                    response: {
                        response: {
                            token: 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjljYjg1YTc3YTllNWU0MTU3ODMyYTFlYTgzOTI3MDZhIn0.eyJleHAiOjE1NzM0NDUwNjYsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xL3ZvbGNhbmljL3ZvbGNhbmljIiwibmJmIjoxNTczNDQxNDY2LCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzM0NDE0NjYsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AGMYvpoactwL7wW8FBfvm7mEhtUIiwqdiaO0XpXKZFhm6N8bDmCkg7QMuTJDYarp-AfdO0z4jWxRun4TWSD5h3l_AK-HrdssT6JgtJLY9y8uBSzHzIOvHtBwE9jfxO-T2ZT8qlu91PS1NqzJhD_Dm5th4OlSkNpp06qp4KXghUJdBM0Z'
                        }
                    },
                    status: 200
                });
                nock('/identity/secret/reset/c12e86c0da', 'post', {
                    secret: 'new-secret-for-identity'
                }, 200, {
                    requestID: 'offline_awsRequestId_3726769879468832',
                    response: { message: 'Secret regenerated successfully' }
                });
                let resetSecret = await new Identity().withAuth().resetSecret('new-secret-for-identity', 'c12e86c0da');
                expect(resetSecret.message).to.equal('Secret regenerated successfully');
            });

            it('should generate identity secret', async () => {
                nock('/identity/login', 'post', {
                    name: 'volcanic',
                    secret: 'volcanic!123',
                    dataset_id: '-1',
                    audience: '["volcanic"]'
                }, 200, {
                    response: {
                        response: {
                            token: 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjljYjg1YTc3YTllNWU0MTU3ODMyYTFlYTgzOTI3MDZhIn0.eyJleHAiOjE1NzM0NDUwNjYsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xL3ZvbGNhbmljL3ZvbGNhbmljIiwibmJmIjoxNTczNDQxNDY2LCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzM0NDE0NjYsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AGMYvpoactwL7wW8FBfvm7mEhtUIiwqdiaO0XpXKZFhm6N8bDmCkg7QMuTJDYarp-AfdO0z4jWxRun4TWSD5h3l_AK-HrdssT6JgtJLY9y8uBSzHzIOvHtBwE9jfxO-T2ZT8qlu91PS1NqzJhD_Dm5th4OlSkNpp06qp4KXghUJdBM0Z'
                        }
                    },
                    status: 200
                });
                nock('/identity/secret/reset/c12e86c0da', 'post', { secret: null }, 200, {
                    requestID: 'offline_awsRequestId_7067434686152883',
                    response: {
                        message: 'Secret regenerated successfully',
                        secret: '3551b374d4e00d64fb821f4f560a9960bde53859'
                    }
                });
                let generateSecret = await new Identity().withAuth().resetSecret(null, 'c12e86c0da');
                expect(generateSecret.message).to.equal('Secret regenerated successfully');
            });

        });


        describe('without auth and with setToken', async () => {
            it('should reset identity secret', async () => {
                nock('/identity/login', 'post', {
                    name: 'volcanic',
                    secret: 'volcanic!123',
                    dataset_id: '-1',
                    audience: '["volcanic"]'
                }, 200, {
                    response: {
                        response: {
                            token: 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjljYjg1YTc3YTllNWU0MTU3ODMyYTFlYTgzOTI3MDZhIn0.eyJleHAiOjE1NzM0NDUwNjYsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xL3ZvbGNhbmljL3ZvbGNhbmljIiwibmJmIjoxNTczNDQxNDY2LCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzM0NDE0NjYsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AGMYvpoactwL7wW8FBfvm7mEhtUIiwqdiaO0XpXKZFhm6N8bDmCkg7QMuTJDYarp-AfdO0z4jWxRun4TWSD5h3l_AK-HrdssT6JgtJLY9y8uBSzHzIOvHtBwE9jfxO-T2ZT8qlu91PS1NqzJhD_Dm5th4OlSkNpp06qp4KXghUJdBM0Z'
                        }
                    },
                    status: 200
                });
                nock('/identity/secret/reset/c12e86c0da', 'post', {
                    secret: 'new-secret-for-identity'
                }, 200, {
                    requestID: 'offline_awsRequestId_3726769879468832',
                    response: { message: 'Secret regenerated successfully' }
                });
                let token = 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjljYjg1YTc3YTllNWU0MTU3ODMyYTFlYTgzOTI3MDZhIn0.eyJleHAiOjE1NzM0NDUwNjYsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xL3ZvbGNhbmljL3ZvbGNhbmljIiwibmJmIjoxNTczNDQxNDY2LCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzM0NDE0NjYsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AGMYvpoactwL7wW8FBfvm7mEhtUIiwqdiaO0XpXKZFhm6N8bDmCkg7QMuTJDYarp-AfdO0z4jWxRun4TWSD5h3l_AK-HrdssT6JgtJLY9y8uBSzHzIOvHtBwE9jfxO-T2ZT8qlu91PS1NqzJhD_Dm5th4OlSkNpp06qp4KXghUJdBM0Z';
                let resetSecret = await new Identity().setToken(token).resetSecret('new-secret-for-identity', 'c12e86c0da');
                expect(resetSecret.message).to.equal('Secret regenerated successfully');
            });

            it('should generate identity secret', async () => {
                nock('/identity/login', 'post', {
                    name: 'volcanic',
                    secret: 'volcanic!123',
                    dataset_id: '-1',
                    audience: '["volcanic"]'
                }, 200, {
                    response: {
                        response: {
                            token: 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjljYjg1YTc3YTllNWU0MTU3ODMyYTFlYTgzOTI3MDZhIn0.eyJleHAiOjE1NzM0NDUwNjYsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xL3ZvbGNhbmljL3ZvbGNhbmljIiwibmJmIjoxNTczNDQxNDY2LCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzM0NDE0NjYsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AGMYvpoactwL7wW8FBfvm7mEhtUIiwqdiaO0XpXKZFhm6N8bDmCkg7QMuTJDYarp-AfdO0z4jWxRun4TWSD5h3l_AK-HrdssT6JgtJLY9y8uBSzHzIOvHtBwE9jfxO-T2ZT8qlu91PS1NqzJhD_Dm5th4OlSkNpp06qp4KXghUJdBM0Z'
                        }
                    },
                    status: 200
                });
                nock('/identity/secret/reset/c12e86c0da', 'post', { secret: null }, 200, {
                    requestID: 'offline_awsRequestId_7067434686152883',
                    response: {
                        message: 'Secret regenerated successfully',
                        secret: '3551b374d4e00d64fb821f4f560a9960bde53859'
                    }
                });
                let token = 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjljYjg1YTc3YTllNWU0MTU3ODMyYTFlYTgzOTI3MDZhIn0.eyJleHAiOjE1NzM0NDUwNjYsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xL3ZvbGNhbmljL3ZvbGNhbmljIiwibmJmIjoxNTczNDQxNDY2LCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzM0NDE0NjYsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AGMYvpoactwL7wW8FBfvm7mEhtUIiwqdiaO0XpXKZFhm6N8bDmCkg7QMuTJDYarp-AfdO0z4jWxRun4TWSD5h3l_AK-HrdssT6JgtJLY9y8uBSzHzIOvHtBwE9jfxO-T2ZT8qlu91PS1NqzJhD_Dm5th4OlSkNpp06qp4KXghUJdBM0Z';
                let generateSecret = await new Identity().setToken(token).resetSecret(null, 'c12e86c0da');
                expect(generateSecret.message).to.equal('Secret regenerated successfully');
            });

        });
    });
});