const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../../src/helpers'),
    Principal = require('../../v1').Principal,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('principal delete', async () => {
    let principal = new Principal();

    // delete principal
    it('should not pass upon deleting because the header does not have a valid authorization token, and it will throw an error', async () => {
        try {
            nock('/principals/334e5b1dd2', 'delete', {}, 403, {
                message: 'Forbidden', errorCode: 3001
            });
            await new Principal().delete('334e5b1dd2',);
            throw 'should not reach this line, because the token is not valid';
        } catch (e) {
            expect(e.message).equals('Forbidden');
            expect(e.errorCode).equals(3001);
        }
    });

    it('should return a success message upon valid request of deleting the principal via ID', async () => {
        nockLogin();
        nock('/principals/8efa33dbf0', 'delete', {}, 200, {
            response: { message: 'Successfully deleted' }
        });
        let deleted = await principal.withAuth().delete('8efa33dbf0');
        expect(deleted.message).to.equal('Successfully deleted');
    });
});