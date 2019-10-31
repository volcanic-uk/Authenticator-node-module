const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    sorted = require('chai-sorted'),
    axiosVCR = require('axios-vcr'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);

const Identity = require('../../v1/index').Identity;

let currentTimestampSecond = 111,
    tmpIdentityName = 'reset-identity-secret',
    tmpIdentitySecret = 'reset-secret',
    identityCreation,
    token;

describe('reset secret', () => {
    before(async () => {
        axiosVCR.mountCassette('./test/cassettes/main_ops/identity/identity_reset_secret_test.json');
        await new Identity().withAuth().create(tmpIdentityName + 'create-name', tmpIdentitySecret, 'volcanic', [1]);
        axiosVCR.ejectCassette('./test/cassettes/main_ops/identity/identity_reset_secret_test.json');

        axiosVCR.mountCassette('./test/cassettes/main_ops/identity_login.json');
        token = await new Identity().login(tmpIdentityName + 'create-name', tmpIdentitySecret, ['kratakao'], '-1');
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/main_ops/identity_login.json');

        axiosVCR.mountCassette('./test/cassettes/main_ops/identity/identity_reset_with_token.json');
        identityCreation = await new Identity().withAuth().create(tmpIdentityName + '-with-token', null, 'volcanic');
        axiosVCR.ejectCassette('./test/cassettes/main_ops/identity/identity_reset_with_token.json');
    });
    describe('reset identity secret', async () => {
        describe('with auth', async () => {
            it('should reset identity secret', async () => {
                axiosVCR.mountCassette('./test/cassettes/identities/reset/identity_reset_secret.json');
                let resetSecret = await new Identity().withAuth().resetSecret(`new-secret-${currentTimestampSecond}`, identityCreation.secure_id);
                expect(resetSecret.message).to.equal('Secret regenerated successfully');
                axiosVCR.ejectCassette('./test/cassettes/identities/reset/identity_reset_secret.json');
            });

            it('should generate identity secret', async () => {
                axiosVCR.mountCassette('./test/cassettes/identities/reset/identity_generate_secret.json');
                let generateSecret = await new Identity().withAuth().resetSecret(null, identityCreation.secure_id);
                expect(generateSecret.message).to.equal('Secret regenerated successfully');
                axiosVCR.ejectCassette('./test/cassettes/identities/reset/identity_generate_secret.json');
            });

        });


        describe('without auth and with setToken', async () => {
            it('should reset identity secret', async () => {
                axiosVCR.mountCassette('./test/cassettes/identities/reset/identity_reset_secret_auth.json');
                let resetSecret = await new Identity().setToken(token).resetSecret(`new-secret-${currentTimestampSecond}`, identityCreation.secure_id);
                expect(resetSecret.message).to.equal('Secret regenerated successfully');
                axiosVCR.ejectCassette('./test/cassettes/identities/reset/identity_reset_secret_auth.json');

            });

            it('should generate identity secret', async () => {
                axiosVCR.mountCassette('./test/cassettes/identities/reset/identity_secret_generate_auth.json');
                let generateSecret = await new Identity().setToken(token).resetSecret(null, identityCreation.secure_id);
                expect(generateSecret.message).to.equal('Secret regenerated successfully');
                axiosVCR.ejectCassette('./test/cassettes/identities/reset/identity_secret_generate_auth.json');
            });

        });
    });
});