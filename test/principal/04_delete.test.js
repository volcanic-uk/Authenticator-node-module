const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin, generateIdentityOrPrincipal } = require('../helpers'),
    timeStamp = Math.floor(Date.now() / 1000),
    Principal = require('../../v1').Principal,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('principal delete', async () => {
    let principal = new Principal();
    let principalId;
    before (async () => {
        principalId = await generateIdentityOrPrincipal('principal', 'principal', timeStamp + 'test_delete');
    });
    // delete principal
    it('should not pass upon deleting because the header does not have a valid authorization token, and it will throw an error', async () => {
        try {
            nock(`/principals/${principalId}`, 'delete', {}, 403, {
                message: 'Forbidden', errorCode: 3001
            });
            await new Principal().setToken('123').delete(principalId);
            throw 'should not reach this line, because the token is not valid';
        } catch (e) {
            expect(e.message).equals('Forbidden');
            expect(e.errorCode).equals(3001);
        }
    });

    it('should return a success message upon valid request of deleting the principal via ID', async () => {
        nockLogin();
        nock(`/principals/${principalId}`, 'delete', {}, 200, {
            response: { message: 'Successfully deleted' }
        });
        let deleted = await principal.withAuth().delete(principalId);
        expect(deleted.message).to.equal('Principal deleted successfully');
    });
});