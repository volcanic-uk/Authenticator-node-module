const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin, generateToken } = require('../helpers'),
    Identity = require('../../v1/index').Identity,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('create identity', () => {

    describe('with auth', async () => {
        it('creating a new identity', async () => {
            nockLogin();
            nock('/identity', 'post', {
                name: 'identity_create_new',
                secret: null,
                principal_id: 'volcanic',
                roles: [],
                privileges: [],
                secretless: false,
                source: 'password',
                skip_secret_encryption: false
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
            let identityCreation = await new Identity().withAuth().create({
                name: 'identity_create_new',
                secret: null,
                principal_id: 'volcanic',
                roles: [],
                privileges: [],
                secretless: false,
                source: 'password',
                skip_secret_encryption: false
            });
            expect(identityCreation).to.be.an('object');
        });

        it('creating a new identity with secret', async () => {
            nockLogin();
            nock('/identity', 'post', {
                name: 'identity_with_password',
                secret: 'volcanic!123',
                principal_id: 'volcanic',
                roles: [],
                privileges: [],
                secretless: false,
                source: 'password',
                skip_secret_encryption: false
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
            let identityCreationWithSecret = await new Identity().withAuth().create({
                name: 'identity_with_password',
                secret: 'volcanic!123',
                principal_id: 'volcanic',
                roles: [],
                privileges: [],
                secretless: false,
                source: 'password',
                skip_secret_encryption: false
            });
            expect(identityCreationWithSecret).to.be.an('object');

        });

        it('should not create a duplicate identity record', async () => {

            try {
                nockLogin();
                nock('/identity', 'post', {
                    name: 'identity_with_password',
                    secret: 'volcanic!123',
                    principal_id: 'volcanic',
                    roles: [],
                    privileges: [],
                    secretless: false,
                    source: 'password',
                    skip_secret_encryption: false
                }, 400, {

                    requestID: 'offline_awsRequestId_24697166768011525',
                    message: 'Duplicate entry identity-secret on dataset -1',
                    errorCode: 1003

                });
                await new Identity().withAuth().create({
                    name: 'identity_with_password',
                    secret: 'volcanic!123',
                    principal_id: 'volcanic'
                });
                throw Error('The code should not reach this scope as it would be a duplicate identity record');
            } catch (e) {
                expect(e.errorCode).to.equal(1003);
                expect(e).to.exist;
            }
        });

        it('creating an identity record without principal_id', async () => {
            try {
                nockLogin();
                nock('/identity', 'post', {
                    name: 'identity_with_password',
                    secret: 'volcanic!123',
                    principal_id: null,
                    roles: [],
                    privileges: [],
                    secretless: false,
                    source: 'password',
                    skip_secret_encryption: false
                }, 422, {
                    requestID: 'offline_awsRequestId_4570424539864406',
                    message: { principal_id: '"principal_id" must be a string' },
                    errorCode: 10001
                });
                await new Identity().withAuth().create({
                    name: 'identity_with_password',
                    secret: 'volcanic!123',
                    principal_id: null
                });
                throw Error('The code should not reach this scope as identity cannot be created without principal id');
            } catch (e) {
                expect(e.errorCode).to.equal(10001);
                expect(e).to.exist;
            }
        });

        it('creating an identity record without name', async () => {
            nockLogin();
            nock('/identity', 'post', {
                name: null,
                secret: 'volcanic!123',
                principal_id: 'volcanic',
                roles: [],
                privileges: [],
                secretless: false,
                source: 'password',
                skip_secret_encryption: false
            }, 400, {
                requestID: 'offline_awsRequestId_5997535176835269',
                message: { name: '"*********************g' },
                errorCode: 10001
            });
            try {
                await new Identity().withAuth().create({
                    name: null,
                    secret: 'volcanic!123',
                    principal_id: 'volcanic'
                });
                throw Error('The code should not reach this scope as identity cannot be created without identity name');
            } catch (e) {
                expect(e.errorCode).to.equal(10001);
                expect(e).to.exist;
            }
        });

    });


    describe('without auth and with setToken', async () => {
        let token = null;
        before(async () => {
            token = await generateToken();
        });
        it('creating a new identity', async () => {
            nockLogin();
            nock('/identity', 'post', {
                name: 'identity_create_new_auth',
                secret: null,
                principal_id: 'volcanic',
                roles: [],
                privileges: [],
                secretless: false,
                source: 'password',
                skip_secret_encryption: false
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
            let identityCreation = await new Identity().setToken(token).create({
                name: 'identity_create_new_auth',
                secret: null,
                principal_id: 'volcanic'
            });
            expect(identityCreation).to.be.an('object');
        });

        it('creating a new identity with secret', async () => {
            nockLogin();
            nock('/identity', 'post', {
                name: 'identity_with_password_auth',
                secret: 'volcanic!123',
                principal_id: 'volcanic',
                roles: [],
                privileges: [],
                secretless: false,
                source: 'password',
                skip_secret_encryption: false
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
            let identityCreationWithSecret = await new Identity().setToken(token).create({
                name: 'identity_with_password_auth',
                secret: 'volcanic!123',
                principal_id: 'volcanic'
            });
            expect(identityCreationWithSecret).to.be.an('object');

        });

        it('should not create a duplicate identity record', async () => {

            try {
                nockLogin();
                nock('/identity', 'post', {
                    name: 'identity_with_password',
                    secret: 'volcanic!123',
                    principal_id: 'volcanic',
                    roles: [],
                    privileges: [],
                    secretless: false,
                    source: 'password',
                    skip_secret_encryption: false
                }, 400, {

                    requestID: 'offline_awsRequestId_24697166768011525',
                    message: 'Duplicate entry identity-secret on dataset -1',
                    errorCode: 1003

                });
                await new Identity().setToken(token).create({
                    name: 'identity_with_password',
                    secret: 'volcanic!123',
                    principal_id: 'volcanic'
                });
                throw Error('The code should not reach this scope as it would be a duplicate identity record');
            } catch (e) {
                expect(e.errorCode).to.equal(1003);
                expect(e).to.exist;
            }

        });

        it('creating an identity record without principal_id', async () => {
            try {
                nockLogin();
                nock('/identity', 'post', {
                    name: 'identity_with_password',
                    secret: 'volcanic!123',
                    principal_id: null,
                    roles: [],
                    privileges: [],
                    secretless: false,
                    source: 'password',
                    skip_secret_encryption: false
                }, 422, {
                    requestID: 'offline_awsRequestId_4570424539864406',
                    message: { principal_id: '"principal_id" must be a string' },
                    errorCode: 10001
                });
                await new Identity().setToken(token).create({
                    name: 'identity_with_password',
                    secret: 'volcanic!123',
                    principal_id: null
                });
                throw Error('The code should not reach this scope as identity cannot be created without principal id');
            } catch (e) {
                expect(e.errorCode).to.equal(10001);
                expect(e).to.exist;
            }
        });

        it('creating an identity record without name', async () => {
            try {
                nockLogin();
                nock('/identity', 'post', {
                    name: null,
                    secret: 'volcanic!123',
                    principal_id: 'volcanic',
                    roles: [],
                    privileges: [],
                    secretless: false,
                    source: 'password',
                    skip_secret_encryption: false
                }, 400, {
                    requestID: 'offline_awsRequestId_5997535176835269',
                    message: { name: '"*********************g' },
                    errorCode: 10001
                });
                await new Identity().setToken(token).create({
                    name: null,
                    secret: 'volcanic!123',
                    principal_id: 'volcanic'
                });
                throw Error('The code should not reach this scope as identity cannot be created without identity name');
            } catch (e) {
                expect(e.errorCode).to.equal(10001);
                expect(e).to.exist;
            }

        });

    });
});