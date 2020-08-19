const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin, generateToken, generateIdentityOrPrincipal } = require('../helpers'),
    Identity = require('../../v1/index').Identity,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('Identity update', () => {

    describe('with auth', async () => {
        let identityId;
        before(async () => {
            identityId = await generateIdentityOrPrincipal('identity', 'identityUpdate1');
        });
        it('should update an identity', async () => {
            nockLogin();
            nock(`/identity/${identityId}`, 'post', {
                name: 'new_identity_test_name',
                roles: [],
                privileges: []
            }, 200, {
                requestID: 'offline_awsRequestId_6826035818110325',
                response: {
                    secure_id: 'c12e86c0da',
                    deleted_at: null,
                    id: 2,
                    principal_id: 1,
                    name: 'new_identity_test_name',
                    dataset_id: '-1',
                    source: null,
                    last_active_date: null,
                    last_used_ip_address: null,
                    active: true,
                    created_at: '2019-11-01T08:13:32.240Z',
                    updated_at: '2019-11-01T08:17:38.438Z'
                }
            });

            let updatedIdentity = await new Identity().withAuth().update({
                name: 'new_identity_test_name',
                id: identityId
            }); //check identity creation id here
            expect(updatedIdentity.name).to.equal('new_identity_test_name');
        });

        it('it should not update a non existent identity', async () => {
            try {
                nockLogin();
                nock('/identity/ghjkld', 'post', {
                    name: 'updated-name',
                    roles: [],
                    privileges: []
                }, 200, {
                    requestID: 'offline_awsRequestId_6388752831170976',
                    message: 'Identity does not exist',
                    errorCode: 1004
                });
                await new Identity().withAuth().update({ name: 'updated-name', id: 'ghjkld' });
            } catch (e) {
                expect(e.errorCode).to.be.equal(1004);
                expect(e).to.exist;
            }
        });
    });


    describe('without auth and with setToken', async () => {
        let token,
            identityId;
        before(async () => {
            token = await generateToken();
            identityId = await generateIdentityOrPrincipal('identity', 'identityUpdate1');
        });
        it('should update an identity', async () => {
            nockLogin();
            nock(`/identity/${identityId}`, 'post', {
                name: 'new_identity_test_name_updated',
                roles: [],
                privileges: []
            }, 200, {
                requestID: 'offline_awsRequestId_6826035818110325',
                response: {
                    secure_id: 'c12e86c0da',
                    deleted_at: null,
                    id: 2,
                    principal_id: 1,
                    name: 'new_identity_test_name_updated',
                    dataset_id: '-1',
                    source: null,
                    last_active_date: null,
                    last_used_ip_address: null,
                    active: true,
                    created_at: '2019-11-01T08:13:32.240Z',
                    updated_at: '2019-11-01T08:17:38.438Z'
                }
            });
            let updatedIdentity = await new Identity().setToken(token).update({
                name: 'new_identity_test_name_updated',
                id: identityId
            }); //check identity creation id here
            expect(updatedIdentity.name).to.equal('new_identity_test_name_updated');

        });

        it('it should not update a non existent identity', async () => {

            try {
                nockLogin();
                nock('/identity/ghjkld', 'post', {
                    name: 'updated-name',
                    roles: [],
                    privileges: []
                }, 200, {
                    requestID: 'offline_awsRequestId_6388752831170976',
                    message: 'Identity does not exist',
                    errorCode: 1004
                });
                await new Identity().setToken(token).update({ name: 'updated-name', id: 'ghjkld' });
            } catch (e) {
                expect(e.errorCode).to.be.equal(1004);
                expect(e).to.exist;
            }

        });

    });
});