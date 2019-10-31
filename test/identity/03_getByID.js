const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);

const Identity = require('../../v1/index').Identity;

let currentTimestampSecond = '111',
    tmpIdentityName = `identity-${currentTimestampSecond}`,
    identityCreation;
describe('get identity by id', () => {
    let token;
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/main_ops/identity_login.json');
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/main_ops/identity_login.json');

        axiosVCR.mountCassette('./test/cassettes/identities/create/identity_create.json');
        identityCreation = await new Identity().withAuth().create(tmpIdentityName, null, 'volcanic');
        axiosVCR.ejectCassette('./test/cassettes/identities/create/identity_create.json');
    });
    describe('with auth', async () => {
        it('get an identity by id', async () => {
            axiosVCR.mountCassette('./test/cassettes/identities/get_id/identity_get_by_id.json');
            await new Identity().withAuth().getByID(identityCreation.secure_id);
            expect(identityCreation).to.be.an('object');
            axiosVCR.ejectCassette('./test/cassettes/identities/get_id/identity_get_by_id.json');
        });

        it('should not proceed if the identity does not exist upon read request, and it will throw an error', async () => {
            axiosVCR.mountCassette('./test/cassettes/identities/get_id/identity_get_by_id_fail.json', true);
            try {
                await new Identity().withAuth().getByID(identityCreation.secure_id+ 12);
                throw 'can not retrieve an identity that does not exist';
            } catch (e) {
                expect(e.message).equals('Identity does not exist');
            }
            axiosVCR.ejectCassette('./test/cassettes/identities/get_id/identity_get_by_id_fail.json');
        });

        it('should fail when requesting a read request when there is no token in the request header, and it will throw an error', async () => {
            axiosVCR.mountCassette('./test/cassettes/identities/get_id/identity_get_by_id_fail_auth.json', true);
            try {
                await new Identity().getByID(identityCreation.secure_id);
                throw 'should not reach this line, because the read request has no token, or it is malformed';
            } catch (e) {
                expect(e.message).to.be.equals('Forbidden');
            }
            axiosVCR.ejectCassette('./test/cassettes/identities/get_id/identity_get_by_id_fail_auth.json');
        });

    });
});
