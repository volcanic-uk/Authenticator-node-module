const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../../src/helpers'),
    Identity = require('../../v1/index').Identity,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('Identity update', () => {

    describe('with auth', async () => {
        it('should update an identity', async () => {
            nockLogin();
            nock('/identity/c12e86c0da', 'post', {
                name: 'identity-updated-postman-test'
            }, 200, {
                requestID: 'offline_awsRequestId_6826035818110325',
                response: {
                    secure_id: 'c12e86c0da',
                    deleted_at: null,
                    id: 2,
                    principal_id: 1,
                    name: 'identity-updated-postman-test',
                    dataset_id: '-1',
                    source: null,
                    last_active_date: null,
                    last_used_ip_address: null,
                    active: true,
                    created_at: '2019-11-01T08:13:32.240Z',
                    updated_at: '2019-11-01T08:17:38.438Z'
                }
            });

            let updatedIdentity = await new Identity().withAuth().update('identity-updated-postman-test', 'c12e86c0da'); //check identity creation id here
            expect(updatedIdentity.name).to.equal('identity-updated-postman-test');
        });

        it('it should not update a non existent identity', async () => {
            try {
                nockLogin();
                nock('/identity/ghjkld', 'post', {
                    name: 'updated-name'
                }, 200, {
                    requestID: 'offline_awsRequestId_6388752831170976',
                    message: 'Identity does not exist',
                    errorCode: 1004
                });
                await new Identity().withAuth().update('updated-name', 'ghjkld');
            } catch (e) {
                expect(e.errorCode).to.be.equal(1004);
                expect(e).to.exist;
            }
        });
    });


    describe('without auth and with setToken', async () => {
        it('should update an identity', async () => {
            nockLogin();
            nock('/identity/c12e86c0da', 'post', {
                name: 'identity-updated-postman-test'
            }, 200, {
                requestID: 'offline_awsRequestId_6826035818110325',
                response: {
                    secure_id: 'c12e86c0da',
                    deleted_at: null,
                    id: 2,
                    principal_id: 1,
                    name: 'identity-updated-postman-test',
                    dataset_id: '-1',
                    source: null,
                    last_active_date: null,
                    last_used_ip_address: null,
                    active: true,
                    created_at: '2019-11-01T08:13:32.240Z',
                    updated_at: '2019-11-01T08:17:38.438Z'
                }
            });
            let token = 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjljYjg1YTc3YTllNWU0MTU3ODMyYTFlYTgzOTI3MDZhIn0.eyJleHAiOjE1NzM0NDUwNjYsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xL3ZvbGNhbmljL3ZvbGNhbmljIiwibmJmIjoxNTczNDQxNDY2LCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzM0NDE0NjYsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AGMYvpoactwL7wW8FBfvm7mEhtUIiwqdiaO0XpXKZFhm6N8bDmCkg7QMuTJDYarp-AfdO0z4jWxRun4TWSD5h3l_AK-HrdssT6JgtJLY9y8uBSzHzIOvHtBwE9jfxO-T2ZT8qlu91PS1NqzJhD_Dm5th4OlSkNpp06qp4KXghUJdBM0Z';
            let updatedIdentity = await new Identity().setToken(token).update('identity-updated-postman-test', 'c12e86c0da'); //check identity creation id here
            expect(updatedIdentity.name).to.equal('identity-updated-postman-test');

        });

        it('it should not update a non existent identity', async () => {

            try {
                nockLogin();
                nock('/identity/ghjkld', 'post', {
                    name: 'updated-name'
                }, 200, {
                    requestID: 'offline_awsRequestId_6388752831170976',
                    message: 'Identity does not exist',
                    errorCode: 1004
                });
                let token = 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjljYjg1YTc3YTllNWU0MTU3ODMyYTFlYTgzOTI3MDZhIn0.eyJleHAiOjE1NzM0NDUwNjYsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xL3ZvbGNhbmljL3ZvbGNhbmljIiwibmJmIjoxNTczNDQxNDY2LCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzM0NDE0NjYsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AGMYvpoactwL7wW8FBfvm7mEhtUIiwqdiaO0XpXKZFhm6N8bDmCkg7QMuTJDYarp-AfdO0z4jWxRun4TWSD5h3l_AK-HrdssT6JgtJLY9y8uBSzHzIOvHtBwE9jfxO-T2ZT8qlu91PS1NqzJhD_Dm5th4OlSkNpp06qp4KXghUJdBM0Z';
                await new Identity().setToken(token).update('updated-name', 'ghjkld');
            } catch (e) {
                expect(e.errorCode).to.be.equal(1004);
                expect(e).to.exist;
            }

        });

    });
});