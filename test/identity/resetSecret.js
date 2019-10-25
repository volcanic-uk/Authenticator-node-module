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
        axiosVCR.mountCassette('./test/cassettes/identity_create_reset.json');
        await new Identity().withAuth().create(tmpIdentityName + 'create-name', tmpIdentitySecret, 'volcanic', [1]);
        axiosVCR.ejectCassette('./test/cassettes/identity_create_reset.json');
        axiosVCR.mountCassette('./test/cassettes/identity_login.json');
        token = await new Identity().login(tmpIdentityName + 'create-name', tmpIdentitySecret, ['kratakao'], '-1');
        token = token.token;
        axiosVCR.ejectCassette('./test/cassettes/identity_login.json');
        axiosVCR.mountCassette('./test/cassettes/identity_create_reset_secret.json');
        identityCreation = await new Identity().withAuth().create(tmpIdentityName + '-withtoken1', null, 'volcanic');
        axiosVCR.ejectCassette('./test/cassettes/identity_create_reset_secret.json');
    });
    describe('reset identity secret', async () => {
        describe('with auth', async () => {
            it('should reset identity secret', async () => {
                axiosVCR.mountCassette('./test/cassettes/identity_reset.json');
                let resetSecret = await new Identity().withAuth().resetSecret(`new-secret-${currentTimestampSecond}`, identityCreation.secure_id);
                axiosVCR.ejectCassette('./test/cassettes/identity_reset.json');
                expect(resetSecret.message).to.equal('Secret regenerated successfully');
            });

            it('should generate identity secret', async () => {
                axiosVCR.mountCassette('./test/cassettes/identity_reset.json');
                let generateSecret = await new Identity().withAuth().resetSecret(null, identityCreation.secure_id);
                axiosVCR.ejectCassette('./test/cassettes/identity_reset.json');
                expect(generateSecret.message).to.equal('Secret regenerated successfully');
            });

        });


        describe('without auth and with setToken', async () => {
            it('should reset identity secret', async () => {
                axiosVCR.mountCassette('./test/cassettes/identity_reset_token.json');
                let resetSecret = await new Identity().setToken(token).resetSecret(`new-secret-${currentTimestampSecond}`, identityCreation.secure_id);
                axiosVCR.ejectCassette('./test/cassettes/identity_reset_token.json');
                expect(resetSecret.message).to.equal('Secret regenerated successfully');

            });

            it('should generate identity secret', async () => {
                axiosVCR.mountCassette('./test/cassettes/identity_reset_token.json');
                let generateSecret = await new Identity().setToken(token).resetSecret(null, identityCreation.secure_id);
                axiosVCR.ejectCassette('./test/cassettes/identity_reset_token.json');
                expect(generateSecret.message).to.equal('Secret regenerated successfully');
            });

        });
    });
});