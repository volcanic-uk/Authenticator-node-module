const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin, generateIdentityOrPrincipal } = require('../helpers'),
    Identity = require('../../v1/index').Identity,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('Identity Privileges update', () => {

    describe('with auth', async () => {
        let identityId;
        before (async () => {
            identityId = await generateIdentityOrPrincipal('identity', 'identityUpdate1');
        });
        it('should update the privileges of the identity', async () => {
            nockLogin();
            nock(`/identity/${identityId}/privileges`, 'post', {
                privileges: [12]
            }, 200, {
                requestID: 'offline_awsRequestId_09282307247301747',
                response: [[Object]]
            });
            let updatedIdentityPrivilege = await new Identity().withAuth().updatePrivileges(identityId, [12]); //check identity creation id here
            expect(updatedIdentityPrivilege).to.exist;
        });

        it('it should not update privileges of a non existing identity', async () => {
            try {
                nockLogin();
                nock('/identity/1u8u8u8u8u/privileges', 'post', {
                    privileges: [12]
                }, 200, {
                    requestID: 'offline_awsRequestId_25830663956307864',
                    message: 'Identity does not exist',
                    errorCode: 1004
                });
                await new Identity().withAuth().updatePrivileges('1u8u8u8u8u', [12]);
            } catch (e) {
                expect(e.errorCode).to.be.equal(1004);
                expect(e).to.exist;
            }

        });
    });

});