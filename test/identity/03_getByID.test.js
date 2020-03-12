const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../helpers'),
    Identity = require('../../v1/index').Identity,
    expect = chai.expect;
chai.use(chaiAsPromised);


describe('get identity by id', () => {

    describe('with auth', async () => {
        it('get an identity by id', async () => {
            nockLogin();
            nock('/identity/volcanic', 'get', {}, 201, {
                response: {
                    secure_id: 'volcanic',
                    deleted_at: null,
                    id: 1,
                    principal_id: 1,
                    name: 'v******c',
                    dataset_id: '-1',
                    source: null,
                    last_active_date: null,
                    last_used_ip_address: null,
                    active: true,
                    created_at: '2019-11-01T07:43:19.674Z',
                    updated_at: '2019-11-01T07:43:19.674Z'
                }
            });
            let get = await new Identity().withAuth().getByID('volcanic');
            expect(get).to.be.instanceOf(Object).and.has.property('id');
        });

        it('should not proceed if the identity does not exist upon read request, and it will throw an error', async () => {
            try {
                nockLogin();
                nock('/identity/1', 'get', {}, 404, {
                    requestID: 'offline_awsRequestId_7528924137230482',
                    message: 'Identity does not exist',
                    errorCode: 1004

                });

                await new Identity().withAuth().getByID(1);
                throw 'can not retrieve an identity that does not exist';
            } catch (e) {
                expect(e.message).equals('Identity does not exist');
            }
        });

        it('should fail when requesting a read request when there is no token in the request header, and it will throw an error', async () => {
            try {
                nock('/identity/volcanic', 'get', {}, 404, {
                    requestID: 'offline_awsRequestId_7084939203047664',
                    message: 'Forbidden',
                    errorCode: 3001

                });
                await new Identity().getByID('volcanic');
                throw 'should not reach this line, because the read request has no token, or it is malformed';
            } catch (e) {
                expect(e.message).to.be.equals('UNAUTHORIZED');
            }
        });

    });
});
