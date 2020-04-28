const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin, generateIdentityOrPrincipal } = require('../helpers'),
    timeStamp = Math.floor(Date.now() / 1000),
    Principal = require('../../v1').Principal,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('Principal unblock', async () => {
    let principalId;
    before(async () => {
        principalId = await generateIdentityOrPrincipal('principal', 'principal', timeStamp + '_test_unblock');
    });
    it('unblocks a valid principal', async () => {
        nockLogin();
        nock(`/principals/${principalId}/unblock`, 'post', {}, 200, {
            response: {
                message: 'Principal unblocked successfully'
            }
        });
        let unblock = await new Principal().withAuth().unblock(principalId);
        expect(unblock.message).to.equal('Principal unblocked successfully');
    });
});
