const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    nock = require('../../src/helpers').nock,
    Identity = require('../../v1/index').Identity,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('create identity', () => {

    describe('with auth', async () => {
        it('creating a new identity', async () => {
            nock('/identity/login', 'post', {
                name: 'volcanic',
                secret: 'volcanic!123',
                dataset_id: '-1',
                audience: '["volcanic"]'
            }, 200, {
                response: {
                    response: {
                        token: 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjljYjg1YTc3YTllNWU0MTU3ODMyYTFlYTgzOTI3MDZhIn0.eyJleHAiOjE1NzM0NDQ2NzgsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xL3ZvbGNhbmljL3ZvbGNhbmljIiwibmJmIjoxNTczNDQxMDc4LCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzM0NDEwNzgsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AP_9eTIPGj04ETHzaOvo4HtgscKk6HmY1RJg1AlhLUsLYZia9tfrXz-z_ukoqWow3N4a_ymfbnvBMrSxUv29nioQAMkQVGBp3BRhEzeKhsShiM5duPV4XIOpgwbwEr6rB5gAD0NYVd6aNG4N1a7fsJAUqoEVkkVDonesqIQhAX1CJskg'
                    }
                },
                status: 200
            });
            nock('/identity', 'post', {
                name: 'identity_create_new',
                secret: null,
                principal_id: 'volcanic'
            }, 201, {
                response: {
                    requestID: 'offline_awsRequestId_8442325613994397',
                    response: {
                        name: 'identity_create_new',
                        principal_id: 1,
                        secret: '$?V8%Ng$W:M',
                        source: null,
                        secure_id: 'e514f7bf50',
                        dataset_id: '-1',
                        updated_at: '2019-11-01T02:55:19.144Z',
                        created_at: '2019-11-01T02:55:19.144Z',
                        id: 2
                    }
                },
                status: 201
            });
            let identityCreation = await new Identity().withAuth().create('identity_create_new', null, 'volcanic');
            expect(identityCreation).to.be.an('object');
        });

        it('creating a new identity with secret', async () => {
            nock('/identity/login', 'post', {
                name: 'volcanic',
                secret: 'volcanic!123',
                dataset_id: '-1',
                audience: '["volcanic"]'
            }, 200, {
                response: {
                    response: {
                        token: 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjljYjg1YTc3YTllNWU0MTU3ODMyYTFlYTgzOTI3MDZhIn0.eyJleHAiOjE1NzM0NDQ2NzgsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xL3ZvbGNhbmljL3ZvbGNhbmljIiwibmJmIjoxNTczNDQxMDc4LCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzM0NDEwNzgsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AP_9eTIPGj04ETHzaOvo4HtgscKk6HmY1RJg1AlhLUsLYZia9tfrXz-z_ukoqWow3N4a_ymfbnvBMrSxUv29nioQAMkQVGBp3BRhEzeKhsShiM5duPV4XIOpgwbwEr6rB5gAD0NYVd6aNG4N1a7fsJAUqoEVkkVDonesqIQhAX1CJskg'
                    }
                },
                status: 200
            });
            nock('/identity', 'post', {
                name: 'identity_with_password',
                secret: 'volcanic!123',
                principal_id: 'volcanic'
            }, 201, {
                response: {
                    requestID: 'offline_awsRequestId_8442325613994397',
                    response: {
                        name: 'i**********1',
                        principal_id: 1,
                        secret: '*****',
                        source: null,
                        secure_id: 'd53546ab54',
                        dataset_id: '-1',
                        updated_at: '2019-11-01T03:02:17.322Z',
                        created_at: '2019-11-01T03:02:17.322Z',
                        id: 2
                    }
                },
                status: 201
            });
            let identityCreationWithSecret = await new Identity().withAuth().create('identity_with_password', 'volcanic!123', 'volcanic');
            expect(identityCreationWithSecret).to.be.an('object');

        });

        it('should not create a duplicate identity record', async () => {

            try {
                nock('/identity/login', 'post', {
                    name: 'volcanic',
                    secret: 'volcanic!123',
                    dataset_id: '-1',
                    audience: '["volcanic"]'
                }, 200, {
                    response: {
                        response: {
                            token: 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjljYjg1YTc3YTllNWU0MTU3ODMyYTFlYTgzOTI3MDZhIn0.eyJleHAiOjE1NzM0NDQ2NzgsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xL3ZvbGNhbmljL3ZvbGNhbmljIiwibmJmIjoxNTczNDQxMDc4LCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzM0NDEwNzgsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AP_9eTIPGj04ETHzaOvo4HtgscKk6HmY1RJg1AlhLUsLYZia9tfrXz-z_ukoqWow3N4a_ymfbnvBMrSxUv29nioQAMkQVGBp3BRhEzeKhsShiM5duPV4XIOpgwbwEr6rB5gAD0NYVd6aNG4N1a7fsJAUqoEVkkVDonesqIQhAX1CJskg'
                        }
                    },
                    status: 200
                });
                nock('/identity', 'post', {
                    name: 'identity_with_password',
                    secret: 'volcanic!123',
                    principal_id: 'volcanic',
                }, 400, {

                    requestID: 'offline_awsRequestId_24697166768011525',
                    message: 'Duplicate entry identity-secret on dataset -1',
                    errorCode: 1003

                });
                await new Identity().withAuth().create('identity_with_password', 'volcanic!123', 'volcanic');
                throw Error('The code should not reach this scope as it would be a duplicate identity record');
            } catch (e) {
                expect(e.errorCode).to.equal(1003);
                expect(e).to.exist;
            }
        });

        it('creating an identity record without principal_id', async () => {
            try {
                nock('/identity/login', 'post', {
                    name: 'volcanic',
                    secret: 'volcanic!123',
                    dataset_id: '-1',
                    audience: '["volcanic"]'
                }, 200, {
                    response: {
                        response: {
                            token: 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjljYjg1YTc3YTllNWU0MTU3ODMyYTFlYTgzOTI3MDZhIn0.eyJleHAiOjE1NzM0NDQ2NzgsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xL3ZvbGNhbmljL3ZvbGNhbmljIiwibmJmIjoxNTczNDQxMDc4LCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzM0NDEwNzgsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AP_9eTIPGj04ETHzaOvo4HtgscKk6HmY1RJg1AlhLUsLYZia9tfrXz-z_ukoqWow3N4a_ymfbnvBMrSxUv29nioQAMkQVGBp3BRhEzeKhsShiM5duPV4XIOpgwbwEr6rB5gAD0NYVd6aNG4N1a7fsJAUqoEVkkVDonesqIQhAX1CJskg'
                        }
                    },
                    status: 200
                });
                nock('/identity', 'post', {
                    name: 'identity_with_password',
                    secret: 'volcanic!123',
                    principal_id: null
                }, 422, {
                    requestID: 'offline_awsRequestId_4570424539864406',
                    message: { principal_id: '"principal_id" must be a string' },
                    errorCode: 10001
                });
                await new Identity().withAuth().create('identity_with_password', 'volcanic!123', null);
                throw Error('The code should not reach this scope as identity cannot be created without principal id');
            } catch (e) {
                expect(e.errorCode).to.equal(10001);
                expect(e).to.exist;
            }
        });

        it('creating an identity record without name', async () => {
            nock('/identity/login', 'post', {
                name: 'volcanic',
                secret: 'volcanic!123',
                dataset_id: '-1',
                audience: '["volcanic"]'
            }, 200, {
                response: {
                    response: {
                        token: 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjljYjg1YTc3YTllNWU0MTU3ODMyYTFlYTgzOTI3MDZhIn0.eyJleHAiOjE1NzM0NDQ2NzgsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xL3ZvbGNhbmljL3ZvbGNhbmljIiwibmJmIjoxNTczNDQxMDc4LCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzM0NDEwNzgsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AP_9eTIPGj04ETHzaOvo4HtgscKk6HmY1RJg1AlhLUsLYZia9tfrXz-z_ukoqWow3N4a_ymfbnvBMrSxUv29nioQAMkQVGBp3BRhEzeKhsShiM5duPV4XIOpgwbwEr6rB5gAD0NYVd6aNG4N1a7fsJAUqoEVkkVDonesqIQhAX1CJskg'
                    }
                },
                status: 200
            });
            nock('/identity', 'post', {
                name: null,
                secret: 'volcanic!123',
                principal_id: 'volcanic',
            }, 400, {
                requestID: 'offline_awsRequestId_5997535176835269',
                message: { name: '"*********************g' },
                errorCode: 10001
            });
            try {
                await new Identity().withAuth().create(null, 'volcanic!123', 'volcanic');
                throw Error('The code should not reach this scope as identity cannot be created without identity name');
            } catch (e) {
                expect(e.errorCode).to.equal(10001);
                expect(e).to.exist;
            }
        });

    });


    describe('without auth and with setToken', async () => {
        it('creating a new identity', async () => {
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
            nock('/identity', 'post', {
                name: 'identity_create_new_auth',
                secret: null,
                principal_id: 'volcanic'
            }, 201, {
                response: {
                    requestID: 'offline_awsRequestId_8442325613994397',
                    response: {
                        name: 'i*****************w',
                        principal_id: 1,
                        secret: '*****',
                        source: null,
                        secure_id: '6b94331448',
                        dataset_id: '-1',
                        updated_at: '2019-11-01T06:27:01.642Z',
                        created_at: '2019-11-01T06:27:01.642Z',
                        id: 2
                    }
                }
            });
            let token = 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjljYjg1YTc3YTllNWU0MTU3ODMyYTFlYTgzOTI3MDZhIn0.eyJleHAiOjE1NzM0NDUwNjYsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xL3ZvbGNhbmljL3ZvbGNhbmljIiwibmJmIjoxNTczNDQxNDY2LCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzM0NDE0NjYsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AGMYvpoactwL7wW8FBfvm7mEhtUIiwqdiaO0XpXKZFhm6N8bDmCkg7QMuTJDYarp-AfdO0z4jWxRun4TWSD5h3l_AK-HrdssT6JgtJLY9y8uBSzHzIOvHtBwE9jfxO-T2ZT8qlu91PS1NqzJhD_Dm5th4OlSkNpp06qp4KXghUJdBM0Z';
            let identityCreation = await new Identity().setToken(token).create('identity_create_new_auth', null, 'volcanic');
            expect(identityCreation).to.be.an('object');
        });

        it('creating a new identity with secret', async () => {
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
            nock('/identity', 'post', {
                name: 'identity_with_password_auth',
                secret: 'volcanic!123',
                principal_id: 'volcanic'
            }, 201, {
                response: {
                    requestID: 'offline_awsRequestId_8442325613994397',
                    response: {
                        name: 'i********************d',
                        principal_id: 1,
                        source: null,
                        secure_id: '760c46cadb',
                        dataset_id: '-1',
                        updated_at: '2019-11-01T06:57:10.346Z',
                        created_at: '2019-11-01T06:57:10.346Z',
                        id: 2
                    }
                }
            });
            let token = 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjljYjg1YTc3YTllNWU0MTU3ODMyYTFlYTgzOTI3MDZhIn0.eyJleHAiOjE1NzM0NDUwNjYsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xL3ZvbGNhbmljL3ZvbGNhbmljIiwibmJmIjoxNTczNDQxNDY2LCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzM0NDE0NjYsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AGMYvpoactwL7wW8FBfvm7mEhtUIiwqdiaO0XpXKZFhm6N8bDmCkg7QMuTJDYarp-AfdO0z4jWxRun4TWSD5h3l_AK-HrdssT6JgtJLY9y8uBSzHzIOvHtBwE9jfxO-T2ZT8qlu91PS1NqzJhD_Dm5th4OlSkNpp06qp4KXghUJdBM0Z';
            let identityCreationWithSecret = await new Identity().setToken(token).create('identity_with_password_auth', 'volcanic!123', 'volcanic');
            expect(identityCreationWithSecret).to.be.an('object');

        });

        it('should not create a duplicate identity record', async () => {

            try {
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
                nock('/identity', 'post', {
                    name: 'identity_with_password',
                    secret: 'volcanic!123',
                    principal_id: 'volcanic',
                }, 400, {

                    requestID: 'offline_awsRequestId_24697166768011525',
                    message: 'Duplicate entry identity-secret on dataset -1',
                    errorCode: 1003

                });
                let token = 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjljYjg1YTc3YTllNWU0MTU3ODMyYTFlYTgzOTI3MDZhIn0.eyJleHAiOjE1NzM0NDUwNjYsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xL3ZvbGNhbmljL3ZvbGNhbmljIiwibmJmIjoxNTczNDQxNDY2LCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzM0NDE0NjYsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AGMYvpoactwL7wW8FBfvm7mEhtUIiwqdiaO0XpXKZFhm6N8bDmCkg7QMuTJDYarp-AfdO0z4jWxRun4TWSD5h3l_AK-HrdssT6JgtJLY9y8uBSzHzIOvHtBwE9jfxO-T2ZT8qlu91PS1NqzJhD_Dm5th4OlSkNpp06qp4KXghUJdBM0Z';
                await new Identity().setToken(token).create('identity_with_password', 'volcanic!123', 'volcanic');
                throw Error('The code should not reach this scope as it would be a duplicate identity record');
            } catch (e) {
                expect(e.errorCode).to.equal(1003);
                expect(e).to.exist;
            }

        });

        it('creating an identity record without principal_id', async () => {
            try {
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
                nock('/identity', 'post', {
                    name: 'identity_with_password',
                    secret: 'volcanic!123',
                    principal_id: null
                }, 422, {
                    requestID: 'offline_awsRequestId_4570424539864406',
                    message: { principal_id: '"principal_id" must be a string' },
                    errorCode: 10001
                });
                let token = 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjljYjg1YTc3YTllNWU0MTU3ODMyYTFlYTgzOTI3MDZhIn0.eyJleHAiOjE1NzM0NDUwNjYsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xL3ZvbGNhbmljL3ZvbGNhbmljIiwibmJmIjoxNTczNDQxNDY2LCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzM0NDE0NjYsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AGMYvpoactwL7wW8FBfvm7mEhtUIiwqdiaO0XpXKZFhm6N8bDmCkg7QMuTJDYarp-AfdO0z4jWxRun4TWSD5h3l_AK-HrdssT6JgtJLY9y8uBSzHzIOvHtBwE9jfxO-T2ZT8qlu91PS1NqzJhD_Dm5th4OlSkNpp06qp4KXghUJdBM0Z';
                await new Identity().setToken(token).create('identity_with_password', 'volcanic!123', null);
                throw Error('The code should not reach this scope as identity cannot be created without principal id');
            } catch (e) {
                expect(e.errorCode).to.equal(10001);
                expect(e).to.exist;
            }
        });

        it('creating an identity record without name', async () => {
            try {
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
                nock('/identity', 'post', {
                    name: null,
                    secret: 'volcanic!123',
                    principal_id: 'volcanic',
                }, 400, {
                    requestID: 'offline_awsRequestId_5997535176835269',
                    message: { name: '"*********************g' },
                    errorCode: 10001
                });
                let token = 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjljYjg1YTc3YTllNWU0MTU3ODMyYTFlYTgzOTI3MDZhIn0.eyJleHAiOjE1NzM0NDUwNjYsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xL3ZvbGNhbmljL3ZvbGNhbmljIiwibmJmIjoxNTczNDQxNDY2LCJhdWRpZW5jZSI6WyJrcmFrYXRvYWV1IiwiLSJdLCJpYXQiOjE1NzM0NDE0NjYsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AGMYvpoactwL7wW8FBfvm7mEhtUIiwqdiaO0XpXKZFhm6N8bDmCkg7QMuTJDYarp-AfdO0z4jWxRun4TWSD5h3l_AK-HrdssT6JgtJLY9y8uBSzHzIOvHtBwE9jfxO-T2ZT8qlu91PS1NqzJhD_Dm5th4OlSkNpp06qp4KXghUJdBM0Z';
                await new Identity().setToken(token).create(null, 'volcanic!123', 'volcanic');
                throw Error('The code should not reach this scope as identity cannot be created without identity name');
            } catch (e) {
                expect(e.errorCode).to.equal(10001);
                expect(e).to.exist;
            }

        });

    });
});